use crate::vm::{VM, StepResult};
use crate::errors::PumpkinError;
use crate::value::PumpkinValue;
use serde::{Deserialize, Serialize};
use std::collections::HashSet;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum StopReason {
    Step,
    Breakpoint(usize),
    Halted,
    Error(String),
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DebugState {
    pub ip: usize,
    pub line: usize,
    pub stack: Vec<String>, // simplified for display
    pub is_running: bool,
}

pub struct DebugSession<'a> {
    pub vm: VM<'a>,
    pub breakpoints: HashSet<usize>, // Line numbers
    pub paused: bool,
}

impl<'a> DebugSession<'a> {
    pub fn new(vm: VM<'a>) -> Self {
        Self {
            vm,
            breakpoints: HashSet::new(),
            paused: true, // Start paused or running? Usually start running until break. Let's say paused initially for "Start Debugging".
        }
    }

    pub fn set_breakpoint(&mut self, line: usize) {
        self.breakpoints.insert(line);
    }
    
    pub fn remove_breakpoint(&mut self, line: usize) {
        self.breakpoints.remove(&line);
    }

    pub fn resume(&mut self) -> Result<StopReason, PumpkinError> {
        self.paused = false;
        loop {
            // 1. Check Breakpoints
            // We need current line. VM doesn't expose it cheaply without mapping.
            // But VM has chunk.
            if let Some(line) = self.current_line() {
                if self.breakpoints.contains(&line) {
                    self.paused = true;
                    return Ok(StopReason::Breakpoint(line));
                }
            }

            // 2. Step
            match self.vm.step() {
                Ok(StepResult::Continue) => {
                    // check breakpoints again? No, we check BEFORE execution usually.
                    // But if we just stepped, we are at NEW line.
                    // Loop will catch it next iteration?
                    // Problem: if we just continued from a breakpoint, we don't want to break immediately on same line.
                    // Debuggers usually step once then run.
                    // Simplification: checking at top of loop is correct. 
                    // To proceed FROM a breakpoint, the UI calls 'step' then 'resume', or we handle the 'advance past break' here.
                    // We'll require user to 'step' off a breakpoint manually if needed, or handle it logicwise.
                    // Actually, standard is: execute, then check if we should stop.
                    // Let's stick to check-then-exec.
                },
                Ok(StepResult::Return(_)) | Ok(StepResult::Done) => {
                    self.paused = true;
                    return Ok(StopReason::Halted);
                },
                Err(e) => {
                    self.paused = true;
                    return Ok(StopReason::Error(e.message));
                }
            }
        }
    }

    pub fn step(&mut self) -> Result<StopReason, PumpkinError> {
        match self.vm.step() {
            Ok(StepResult::Continue) => Ok(StopReason::Step),
            Ok(_) => Ok(StopReason::Halted),
            Err(e) => Ok(StopReason::Error(e.message)),
        }
    }
    
    pub fn get_state(&self) -> DebugState {
        DebugState {
            ip: self.vm.ip(), // Need to expose ip
            line: self.current_line().unwrap_or(0),
            stack: self.vm.get_stack_names(), // Need to expose stack
            is_running: !self.paused,
        }
    }
    
    fn current_line(&self) -> Option<usize> {
        self.vm.chunk().lines.get(self.vm.ip()).cloned()
    }
}
