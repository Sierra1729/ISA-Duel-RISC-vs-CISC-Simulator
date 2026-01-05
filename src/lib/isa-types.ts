// RISC and CISC ISA Type Definitions

export interface Register {
  name: string;
  value: number;
}

export interface MemoryCell {
  address: number;
  value: number;
}

export interface Instruction {
  address: number;
  opcode: string;
  operands: string[];
  binary: string;
  size: number; // bytes
  cycles: number;
  description: string;
}

export interface PipelineStage {
  name: 'IF' | 'ID' | 'EX' | 'MEM' | 'WB';
  instruction: Instruction | null;
  active: boolean;
}

export interface MicroStep {
  name: string;
  description: string;
  active: boolean;
  completed: boolean;
}

export interface CPUState {
  registers: Register[];
  memory: MemoryCell[];
  pc: number; // Program Counter
  currentCycle: number;
  instructionCount: number;
  completedInstructions: number;
}

export interface RISCState extends CPUState {
  pipeline: PipelineStage[];
  hazard: boolean;
  stall: boolean;
}

export interface CISCState extends CPUState {
  microSteps: MicroStep[];
  currentMicroStep: number;
  totalMicroSteps: number;
}

export interface Metrics {
  totalCycles: number;
  instructionCount: number;
  completedInstructions: number;
  cpi: number; // Cycles Per Instruction
  codeSize: number; // bytes
  efficiency: number; // instructions per cycle
}

export interface Program {
  name: string;
  description: string;
  riscInstructions: Instruction[];
  ciscInstructions: Instruction[];
  initialMemory: MemoryCell[];
}

// Pipeline stage colors as array for index access
export const PIPELINE_COLORS = [
  '#3b82f6', // IF - blue
  '#22c55e', // ID - green
  '#f59e0b', // EX - amber
  '#ef4444', // MEM - red
  '#8b5cf6', // WB - purple
] as const;

export const MICRO_COLORS = [
  '#6366f1', // Fetch - indigo
  '#14b8a6', // Decode - teal
  '#f97316', // Execute - orange
  '#ec4899', // Writeback - pink
] as const;
