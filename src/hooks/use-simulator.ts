import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  RISCState, 
  CISCState, 
  Metrics, 
  Program, 
  PipelineStage, 
  MicroStep 
} from '@/lib/isa-types';
import { 
  generateAdditionProgram, 
  generateSubtractionProgram, 
  getInitialRISCRegisters, 
  getInitialCISCRegisters 
} from '@/lib/programs';

const initialPipeline: PipelineStage[] = [
  { name: 'IF', instruction: null, active: false },
  { name: 'ID', instruction: null, active: false },
  { name: 'EX', instruction: null, active: false },
  { name: 'MEM', instruction: null, active: false },
  { name: 'WB', instruction: null, active: false },
];

const getMicroSteps = (): MicroStep[] => [
  { name: 'Fetch', description: 'Fetch instruction from memory', active: false, completed: false },
  { name: 'Decode', description: 'Decode instruction', active: false, completed: false },
  { name: 'Execute', description: 'Execute operation', active: false, completed: false },
  { name: 'Writeback', description: 'Write result', active: false, completed: false },
];

export function useSimulator() {
  const [operandA, setOperandA] = useState(10);
  const [operandB, setOperandB] = useState(5);
  const [operation, setOperation] = useState<'Addition' | 'Subtraction'>('Addition');
  
  const [selectedProgram, setSelectedProgram] = useState<Program>(() => 
    generateAdditionProgram(10, 5)
  );
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [riscState, setRiscState] = useState<RISCState>(() => ({
    registers: getInitialRISCRegisters(),
    memory: [...selectedProgram.initialMemory],
    pc: 0,
    currentCycle: 0,
    instructionCount: selectedProgram.riscInstructions.length,
    completedInstructions: 0,
    pipeline: initialPipeline,
    hazard: false,
    stall: false,
  }));

  const [ciscState, setCiscState] = useState<CISCState>(() => ({
    registers: getInitialCISCRegisters(),
    memory: [...selectedProgram.initialMemory],
    pc: 0,
    currentCycle: 0,
    instructionCount: selectedProgram.ciscInstructions.length,
    completedInstructions: 0,
    microSteps: getMicroSteps(),
    currentMicroStep: 0,
    totalMicroSteps: 4,
  }));

  const [riscMetrics, setRiscMetrics] = useState<Metrics>({
    totalCycles: 0,
    instructionCount: selectedProgram.riscInstructions.length,
    completedInstructions: 0,
    cpi: 0,
    codeSize: selectedProgram.riscInstructions.reduce((acc, i) => acc + i.size, 0),
    efficiency: 0,
  });

  const [ciscMetrics, setCiscMetrics] = useState<Metrics>({
    totalCycles: 0,
    instructionCount: selectedProgram.ciscInstructions.length,
    completedInstructions: 0,
    cpi: 0,
    codeSize: selectedProgram.ciscInstructions.reduce((acc, i) => acc + i.size, 0),
    efficiency: 0,
  });

  const [pipelineHistory, setPipelineHistory] = useState<Array<{cycle: number; stages: PipelineStage[]}>>([]);
  const [ciscHistory, setCiscHistory] = useState<Array<{cycle: number; instruction: number; microStep: number}>>([]);

  // Computed results based on simulation completion
  const riscResult = riscState.completedInstructions >= selectedProgram.riscInstructions.length 
    ? selectedProgram.initialMemory[2]?.value + (operation === 'Addition' ? operandA + operandB : operandA - operandB) - selectedProgram.initialMemory[2]?.value
    : null;
  
  const ciscResult = ciscState.completedInstructions >= selectedProgram.ciscInstructions.length
    ? (operation === 'Addition' ? operandA + operandB : operandA - operandB)
    : null;

  const isComplete = riscState.completedInstructions >= selectedProgram.riscInstructions.length &&
                     ciscState.completedInstructions >= selectedProgram.ciscInstructions.length;

  const updateProgram = useCallback((op: 'Addition' | 'Subtraction', a: number, b: number) => {
    const program = op === 'Addition' 
      ? generateAdditionProgram(a, b)
      : generateSubtractionProgram(a, b);
    setSelectedProgram(program);
    setOperation(op);
    setOperandA(a);
    setOperandB(b);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setRiscState({
      registers: getInitialRISCRegisters(),
      memory: [...selectedProgram.initialMemory],
      pc: 0,
      currentCycle: 0,
      instructionCount: selectedProgram.riscInstructions.length,
      completedInstructions: 0,
      pipeline: initialPipeline.map(s => ({ ...s, instruction: null, active: false })),
      hazard: false,
      stall: false,
    });

    setCiscState({
      registers: getInitialCISCRegisters(),
      memory: [...selectedProgram.initialMemory],
      pc: 0,
      currentCycle: 0,
      instructionCount: selectedProgram.ciscInstructions.length,
      completedInstructions: 0,
      microSteps: getMicroSteps(),
      currentMicroStep: 0,
      totalMicroSteps: 4,
    });

    setRiscMetrics({
      totalCycles: 0,
      instructionCount: selectedProgram.riscInstructions.length,
      completedInstructions: 0,
      cpi: 0,
      codeSize: selectedProgram.riscInstructions.reduce((acc, i) => acc + i.size, 0),
      efficiency: 0,
    });

    setCiscMetrics({
      totalCycles: 0,
      instructionCount: selectedProgram.ciscInstructions.length,
      completedInstructions: 0,
      cpi: 0,
      codeSize: selectedProgram.ciscInstructions.reduce((acc, i) => acc + i.size, 0),
      efficiency: 0,
    });

    setPipelineHistory([]);
    setCiscHistory([]);
  }, [selectedProgram]);

  const stepRISC = useCallback(() => {
    setRiscState(prev => {
      const instructions = selectedProgram.riscInstructions;
      const newPipeline = [...prev.pipeline];
      let completedThisCycle = 0;

      if (newPipeline[4].instruction) {
        completedThisCycle = 1;
      }

      newPipeline[4] = { ...newPipeline[4], instruction: newPipeline[3].instruction, active: !!newPipeline[3].instruction };
      newPipeline[3] = { ...newPipeline[3], instruction: newPipeline[2].instruction, active: !!newPipeline[2].instruction };
      newPipeline[2] = { ...newPipeline[2], instruction: newPipeline[1].instruction, active: !!newPipeline[1].instruction };
      newPipeline[1] = { ...newPipeline[1], instruction: newPipeline[0].instruction, active: !!newPipeline[0].instruction };

      const nextInstrIndex = prev.pc / 4;
      if (nextInstrIndex < instructions.length) {
        newPipeline[0] = { ...newPipeline[0], instruction: instructions[nextInstrIndex], active: true };
      } else {
        newPipeline[0] = { ...newPipeline[0], instruction: null, active: false };
      }

      const newCompletedInstructions = prev.completedInstructions + completedThisCycle;
      const newCycle = prev.currentCycle + 1;

      return {
        ...prev,
        pipeline: newPipeline,
        pc: nextInstrIndex < instructions.length ? prev.pc + 4 : prev.pc,
        currentCycle: newCycle,
        completedInstructions: newCompletedInstructions,
      };
    });

    setRiscMetrics(prev => {
      const newCycles = prev.totalCycles + 1;
      return {
        ...prev,
        totalCycles: newCycles,
        completedInstructions: riscState.completedInstructions,
        cpi: riscState.completedInstructions > 0 ? newCycles / riscState.completedInstructions : 0,
        efficiency: riscState.completedInstructions / newCycles,
      };
    });

    setPipelineHistory(prev => [...prev, { cycle: riscState.currentCycle + 1, stages: [...riscState.pipeline] }]);
  }, [selectedProgram.riscInstructions, riscState]);

  const stepCISC = useCallback(() => {
    setCiscState(prev => {
      const instructions = selectedProgram.ciscInstructions;
      const currentInstrIndex = Math.floor(prev.pc);
      
      if (currentInstrIndex >= instructions.length) {
        return prev;
      }

      const currentInstr = instructions[currentInstrIndex];
      const newMicroSteps = [...prev.microSteps];
      let newMicroStep = prev.currentMicroStep;
      let newPc = prev.pc;
      let completedThisCycle = 0;

      newMicroSteps.forEach((s, i) => {
        s.active = i === newMicroStep;
        s.completed = i < newMicroStep;
      });

      newMicroStep++;

      if (newMicroStep >= currentInstr.cycles) {
        completedThisCycle = 1;
        newPc = currentInstrIndex + 1;
        newMicroStep = 0;
        newMicroSteps.forEach(s => {
          s.active = false;
          s.completed = false;
        });
      }

      return {
        ...prev,
        microSteps: newMicroSteps,
        currentMicroStep: newMicroStep,
        pc: newPc,
        currentCycle: prev.currentCycle + 1,
        completedInstructions: prev.completedInstructions + completedThisCycle,
      };
    });

    setCiscMetrics(prev => {
      const newCycles = prev.totalCycles + 1;
      return {
        ...prev,
        totalCycles: newCycles,
        completedInstructions: ciscState.completedInstructions,
        cpi: ciscState.completedInstructions > 0 ? newCycles / ciscState.completedInstructions : 0,
        efficiency: ciscState.completedInstructions / newCycles,
      };
    });

    setCiscHistory(prev => [...prev, { 
      cycle: ciscState.currentCycle + 1, 
      instruction: Math.floor(ciscState.pc), 
      microStep: ciscState.currentMicroStep 
    }]);
  }, [selectedProgram.ciscInstructions, ciscState]);

  const step = useCallback(() => {
    stepRISC();
    stepCISC();
  }, [stepRISC, stepCISC]);

  const run = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  useEffect(() => {
    reset();
  }, [selectedProgram, reset]);

  useEffect(() => {
    if (isRunning) {
      const riscDone = riscState.completedInstructions >= selectedProgram.riscInstructions.length;
      const ciscDone = ciscState.completedInstructions >= selectedProgram.ciscInstructions.length;
      
      if (riscDone && ciscDone) {
        setIsRunning(false);
        return;
      }

      intervalRef.current = setInterval(step, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, speed, step, riscState.completedInstructions, ciscState.completedInstructions, selectedProgram]);

  return {
    selectedProgram,
    operandA,
    operandB,
    operation,
    updateProgram,
    riscState,
    ciscState,
    riscMetrics,
    ciscMetrics,
    riscResult,
    ciscResult,
    isComplete,
    pipelineHistory,
    ciscHistory,
    isRunning,
    speed,
    setSpeed,
    step,
    run,
    pause,
    reset,
  };
}
