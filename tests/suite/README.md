# Pumpkin Language Compliance Suite

This directory contains the canonical test suite for the Pumpkin language. Implementers should ensure their interpreter passes these tests.

## Test Format

Each `.pumpkin` file contains a test case. Metadata is provided in the header comments:

* `# EXPECT: success` - Program should run without error.
* `# EXPECT: error <PartialErrorMessage>` - Program should fail with the given error.
* `# OUTPUT: <Line>` - Expected standard output line.

## Structure

* `parsing/`: Tests for syntax validation (invalid syntax should error).
* `execution/`: Tests for runtime logic correctness (math, loops, functions).
* `errors/`: Tests for runtime error reporting (types, bounds).
