use crate::value::PumpkinValue;
use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Debug, Clone, PartialEq, Serialize)]
#[repr(u8)]
pub enum OpCode {
    // 0x00 - 0x0F: Stack & Constants
    Return = 0x00,
    Constant = 0x01,
    Pop = 0x02,
    Nil = 0x03,
    True = 0x04,
    False = 0x05,
    Print = 0x06,

    // 0x10 - 0x2F: Values
    GetLocal = 0x10,
    SetLocal = 0x11,
    GetGlobal = 0x12,
    SetGlobal = 0x13,

    // 0x30 - 0x4F: Arithmetic & Logic
    Add = 0x30,
    Sub = 0x31,
    Mul = 0x32,
    Div = 0x33,
    Equal = 0x34,
    Greater = 0x35,
    Less = 0x36,
    Not = 0x37,

    // 0x50 - 0x6F: Control Flow
    Jump = 0x50,
    JumpIfFalse = 0x51,
    Loop = 0x52,
    Call = 0x53,
    RepeatStart = 0x54,
    RepeatEnd = 0x55,

    // 0x70+: Extensions
    ArrayLit = 0x70,

    IndexGet = 0x71,
    IndexSet = 0x72,
    GetProp = 0x73,
    Import = 0x74,
    Export = 0x75,
}

impl From<u8> for OpCode {
    fn from(byte: u8) -> Self {
        unsafe { std::mem::transmute(byte) }
    }
}

#[derive(Debug, Clone, Serialize, PartialEq)]
pub struct Chunk {
    pub code: Vec<u8>,
    pub constants: Vec<PumpkinValue>,
    pub lines: Vec<usize>, // Line info for errors
}

impl Chunk {
    pub fn new() -> Self {
        Self {
            code: Vec::new(),
            constants: Vec::new(),
            lines: Vec::new(),
        }
    }

    pub fn write(&mut self, byte: u8, line: usize) {
        self.code.push(byte);
        self.lines.push(line);
    }

    pub fn write_op(&mut self, op: OpCode, line: usize) {
        self.code.push(op as u8);
        self.lines.push(line);
    }

    pub fn add_constant(&mut self, value: PumpkinValue) -> usize {
        self.constants.push(value);
        self.constants.len() - 1
    }
}

// Disassembler for debugging
impl fmt::Display for Chunk {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        writeln!(f, "== Chunk ==")?;
        let mut i = 0;
        while i < self.code.len() {
            write!(f, "{:04} ", i)?;
            let op = OpCode::from(self.code[i]);
            match op {
                OpCode::Constant | OpCode::GetGlobal | OpCode::SetGlobal => {
                    let constant = self.code[i + 1]; // Implies u8 constant index for now
                    writeln!(f, "{:?} {}", op, constant)?;
                    i += 2;
                }
                OpCode::Jump | OpCode::JumpIfFalse | OpCode::Loop => {
                    // 16-bit operand
                    let offset = ((self.code[i + 1] as u16) << 8) | (self.code[i + 2] as u16);
                    writeln!(f, "{:?} {}", op, offset)?;
                    i += 3;
                }
                _ => {
                    writeln!(f, "{:?}", op)?;
                    i += 1;
                }
            }
        }
        Ok(())
    }
}
