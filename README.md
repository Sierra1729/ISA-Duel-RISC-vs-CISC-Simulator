# RISC vs CISC Simulator

Interactive web application visualizes and compares RISC (Reduced Instruction Set Computing) and CISC (Complex Instruction Set Computing) processor architectures through instruction sets, memory states, and performance metrics.

## Features
- Side-by-side comparison of RISC and CISC instruction execution with register files, memory views, and input/output panels.
- Single-cycle and pipelined simulation modes showing control signals and data flow.
- Visual dashboards for performance metrics like cycles, cache hits/misses, and ALU operations.
- Input assembly or binary code for both architectures with step-by-step execution control.

## RISC vs CISC Overview
RISC uses simple, fixed-length instructions executing in one cycle, emphasizing registers and pipelining. CISC employs complex, variable-length instructions handling multiple operations, often requiring microcode and more memory access.

| Aspect          | RISC                          | CISC                          |
|-----------------|-------------------------------|-------------------------------|
| Instruction Size| Fixed (e.g., 32-bit)         | Variable                     |
| Execution Time  | 1 cycle per instruction      | Multiple cycles              |
| Registers       | Many general-purpose         | Fewer, memory-oriented       |
| Examples        | ARM, RISC-V                  | x86, Intel 80486             | [5][3]

## Quick Start
1. Load the app from the provided preview link.
2. Enter test inputs (e.g., ADD, LOAD) in input panels for both RISC and CISC tabs.
3. Use play, step, or reset buttons to simulate execution and observe register/memory changes.
4. View performance stats in bottom dashboard for cycle counts and efficiency.

## Usage
- **Input Panels**: Green/purple tabs for RISC/CISC instructions; supports basic ops like arithmetic, load/store.
- **Simulation Controls**: Execute single steps or full runs; pipeline view shows fetch/decode/execute stages.
- **Output**: Real-time updates to registers (e.g., 15-19 values shown), memory, and stats like 5.00 cycles.
- Test with sample data: RISC might complete in fewer cycles than CISC for simple tasks.[3]

## Technologies
Built with modern web tech (likely React/TS in Lovable.app framework) for interactive GUIs, canvas for visualizations, and JS for simulation logic.

## Installation (Local Dev)
Clone repo (if available), install dependencies via `npm install`, run `npm start` for development server.

## Contributing
Fork, add features like more instructions or export stats, submit PRs. Focus on accuracy for educational use.

## License
MIT License - free for educational and non-commercial use.

