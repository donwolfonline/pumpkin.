#!/bin/bash

PUMPKIN="node dist/src/cli.js"

echo "🎃 Running Smoke Tests..."
echo "-----------------------------------"

# Function to run valid tests
run_test() {
    file=$1
    echo "Testing $file..."
    $PUMPKIN run "$file"
    if [ $? -eq 0 ]; then
        echo "✅ PASS"
    else
        echo "❌ FAIL"
        exit 1
    fi
    echo ""
}

# Function to run error tests (expects failure)
run_error_test() {
    file=$1
    expect_type=$2
    echo "Testing $file (Expecting $expect_type Error)..."
    output=$($PUMPKIN run "$file" 2>&1)
    exit_code=$?
    
    if [ $exit_code -ne 0 ]; then
        echo "✅ PASS (Correctly Failed)"
    else
        echo "❌ FAIL (Should have failed but succeeded)"
        exit 1
    fi
    echo ""
}

run_test "tests/smoke/01_basics.pumpkin"
run_test "tests/smoke/02_flow_control.pumpkin"
run_test "tests/smoke/03_functions_scope.pumpkin"

echo "-----------------------------------"
echo "Testing Error Handling (Should fail gracefully)"
echo "-----------------------------------"

run_error_test "tests/smoke/04_error_syntax.pumpkin" "Syntax"
run_error_test "tests/smoke/05_error_runtime.pumpkin" "Runtime"

echo "🎉 All Smoke Tests Passed!"
