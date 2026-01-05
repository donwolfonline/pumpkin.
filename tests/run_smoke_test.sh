#!/bin/bash

# Pumpkin End-to-End Smoke Test Runner
# This script validates Pumpkin works across all environments

set -e  # Exit on error

echo "🎃 Running Pumpkin Smoke Tests..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Expected output
EXPECTED_LINES=8
EXPECTED_FIRST_LINE="=== Pumpkin Smoke Test ==="

# Test 1: CLI Test
echo "📋 Test 1: CLI Execution"
echo "Running: pumpkin run tests/smoke.pumpkin"

CLI_OUTPUT=$(pumpkin run tests/smoke.pumpkin 2>&1)
CLI_LINE_COUNT=$(echo "$CLI_OUTPUT" | wc -l | tr -d ' ')

if [ "$CLI_LINE_COUNT" -ne "$EXPECTED_LINES" ]; then
    echo -e "${RED}❌ CLI Test Failed: Expected $EXPECTED_LINES lines, got $CLI_LINE_COUNT${NC}"
    echo "Output:"
    echo "$CLI_OUTPUT"
    exit 1
fi

if ! echo "$CLI_OUTPUT" | head -1 | grep -q "$EXPECTED_FIRST_LINE"; then
    echo -e "${RED}❌ CLI Test Failed: First line doesn't match${NC}"
    echo "Expected: $EXPECTED_FIRST_LINE"
    echo "Got: $(echo "$CLI_OUTPUT" | head -1)"
    exit 1
fi

echo -e "${GREEN}✅ CLI Test Passed${NC}"
echo ""

# Test 2: Node.js API Test
echo "📋 Test 2: Node.js API"
echo "Running programmatic test..."

# Create a temporary test file
cat > /tmp/pumpkin_api_test.mjs << 'EOF'
import { parseToAST } from './dist/src/parser.js';
import init, { PumpkinVM } from './dist/pkg/pumpkin_core.js';
import fs from 'fs';

try {
    await init(fs.readFileSync('./dist/pkg/pumpkin_core_bg.wasm'));
    const vm = new PumpkinVM();
    
    const source = fs.readFileSync('./tests/smoke.pumpkin', 'utf-8');
    const ast = parseToAST(source);
    const result = vm.run(JSON.stringify(ast));
    
    if (!result.success) {
        console.error('Execution failed:', result.error);
        process.exit(1);
    }
    
    if (result.output.length !== 8) {
        console.error(`Wrong output length: expected 8, got ${result.output.length}`);
        process.exit(1);
    }
    
    if (result.output[0] !== '=== Pumpkin Smoke Test ===') {
        console.error(`First line mismatch: ${result.output[0]}`);
        process.exit(1);
    }
    
    console.log('✅ All assertions passed');
    process.exit(0);
} catch (e) {
    console.error('Test error:', e);
    process.exit(1);
}
EOF

if node /tmp/pumpkin_api_test.mjs; then
    echo -e "${GREEN}✅ Node.js API Test Passed${NC}"
else
    echo -e "${RED}❌ Node.js API Test Failed${NC}"
    rm /tmp/pumpkin_api_test.mjs
    exit 1
fi

rm /tmp/pumpkin_api_test.mjs
echo ""

# Test 3: Browser Test (Manual)
echo "📋 Test 3: Browser (Manual Verification Required)"
echo -e "${YELLOW}⚠️  Please manually verify the browser playground works${NC}"
echo "   1. Open the playground in your browser"
echo "   2. Paste contents of tests/smoke.pumpkin"
echo "   3. Run and verify output matches expected"
echo ""

# Summary
echo "================================"
echo -e "${GREEN}🎉 All Automated Tests Passed!${NC}"
echo "================================"
echo ""
echo "Note: Don't forget to manually verify the browser test before release."
