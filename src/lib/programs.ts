import { Program, Instruction, MemoryCell } from './isa-types';

// Helper to create RISC instructions (fixed 32-bit / 4 bytes)
const riscInstr = (
  address: number,
  opcode: string,
  operands: string[],
  binary: string,
  description: string
): Instruction => ({
  address,
  opcode,
  operands,
  binary,
  size: 4, // Fixed 32-bit
  cycles: 1, // Single cycle in pipeline
  description,
});

// Helper to create CISC instructions (variable length)
const ciscInstr = (
  address: number,
  opcode: string,
  operands: string[],
  binary: string,
  size: number,
  cycles: number,
  description: string
): Instruction => ({
  address,
  opcode,
  operands,
  binary,
  size,
  cycles,
  description,
});

// Generate programs dynamically based on user input
export function generateAdditionProgram(a: number, b: number): Program {
  return {
    name: 'Addition',
    description: `Calculate ${a} + ${b} = ${a + b}`,
    initialMemory: [
      { address: 0x100, value: a },  // Operand A
      { address: 0x104, value: b },  // Operand B
      { address: 0x108, value: 0 },  // Result
    ],
    riscInstructions: [
      riscInstr(0x00, 'LW', ['$t0', '0x100'], '10001100000010000000000100000000', `Load A (${a}) into $t0`),
      riscInstr(0x04, 'LW', ['$t1', '0x104'], '10001100000010010000000100000100', `Load B (${b}) into $t1`),
      riscInstr(0x08, 'ADD', ['$t2', '$t0', '$t1'], '00000001000010010101000000100000', 'Add $t2 = $t0 + $t1'),
      riscInstr(0x0C, 'SW', ['$t2', '0x108'], '10101100000010100000000100001000', 'Store result to memory'),
    ],
    ciscInstructions: [
      ciscInstr(0x00, 'MOV', ['AX', `[0x100]`], '8B060001', 2, 2, `Load A (${a}) into AX`),
      ciscInstr(0x02, 'ADD', ['AX', `[0x104]`], '03060401', 2, 3, `Add B (${b}) to AX`),
      ciscInstr(0x04, 'MOV', ['[0x108]', 'AX'], '89060801', 2, 2, 'Store result to memory'),
    ],
  };
}

export function generateSubtractionProgram(a: number, b: number): Program {
  return {
    name: 'Subtraction',
    description: `Calculate ${a} - ${b} = ${a - b}`,
    initialMemory: [
      { address: 0x100, value: a },  // Operand A
      { address: 0x104, value: b },  // Operand B
      { address: 0x108, value: 0 },  // Result
    ],
    riscInstructions: [
      riscInstr(0x00, 'LW', ['$t0', '0x100'], '10001100000010000000000100000000', `Load A (${a}) into $t0`),
      riscInstr(0x04, 'LW', ['$t1', '0x104'], '10001100000010010000000100000100', `Load B (${b}) into $t1`),
      riscInstr(0x08, 'SUB', ['$t2', '$t0', '$t1'], '00000001000010010101000000100010', 'Subtract $t2 = $t0 - $t1'),
      riscInstr(0x0C, 'SW', ['$t2', '0x108'], '10101100000010100000000100001000', 'Store result to memory'),
    ],
    ciscInstructions: [
      ciscInstr(0x00, 'MOV', ['AX', `[0x100]`], '8B060001', 2, 2, `Load A (${a}) into AX`),
      ciscInstr(0x02, 'SUB', ['AX', `[0x104]`], '2B060401', 2, 3, `Subtract B (${b}) from AX`),
      ciscInstr(0x04, 'MOV', ['[0x108]', 'AX'], '89060801', 2, 2, 'Store result to memory'),
    ],
  };
}

export const PROGRAMS: Program[] = [
  generateAdditionProgram(10, 5),
  generateSubtractionProgram(20, 8),
];

export const getInitialRISCRegisters = () => [
  { name: '$zero', value: 0 },
  { name: '$t0', value: 0 },
  { name: '$t1', value: 0 },
  { name: '$t2', value: 0 },
  { name: '$t3', value: 0 },
  { name: 'PC', value: 0 },
];

export const getInitialCISCRegisters = () => [
  { name: 'AX', value: 0 },
  { name: 'BX', value: 0 },
  { name: 'CX', value: 0 },
  { name: 'DX', value: 0 },
  { name: 'IP', value: 0 },
];
