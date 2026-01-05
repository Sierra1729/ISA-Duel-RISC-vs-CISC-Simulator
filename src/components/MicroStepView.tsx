import { MicroStep, Instruction, MICRO_COLORS } from '@/lib/isa-types';
import { cn } from '@/lib/utils';
import { InfoButton } from './InfoButton';

interface MicroStepViewProps {
  microSteps: MicroStep[];
  currentStep: number;
  cycle: number;
  currentInstruction: Instruction | null;
  totalCycles: number;
}

export function MicroStepView({ microSteps, currentStep, cycle, currentInstruction, totalCycles }: MicroStepViewProps) {
  return (
    <div className="border-2 border-[hsl(var(--cisc))] shadow-sm overflow-hidden">
      <div className="px-3 py-2 bg-[hsl(var(--cisc))] text-[hsl(var(--cisc-foreground))] font-mono text-sm font-bold uppercase flex items-center justify-between">
        <span>CISC Micro-Steps (Cycle: {cycle})</span>
        <InfoButton 
          title="CISC Micro-Step Execution"
          description={`CISC processors break complex instructions into micro-steps:

• Fetch: Get instruction from memory
• Decode: Understand the instruction
• Execute: Perform the operation
• Writeback: Store the result

Unlike RISC, each instruction may take multiple cycles to complete. Complex operations like memory-to-memory addition require more micro-steps.

Current instruction needs ${totalCycles} cycles to complete.`}
        />
      </div>
      
      <div className="p-3 bg-card">
        {currentInstruction && (
          <div className="mb-2 p-2 bg-muted border-2 border-dashed border-muted-foreground">
            <div className="font-mono text-xs">
              <span className="font-bold">{currentInstruction.opcode}</span>{' '}
              <span className="text-muted-foreground">{currentInstruction.operands.join(', ')}</span>
            </div>
            <div className="font-mono text-[10px] text-muted-foreground mt-1">
              Step {currentStep}/{totalCycles} cycles
            </div>
          </div>
        )}
        
        <div className="flex gap-1">
          {microSteps.slice(0, 4).map((step, idx) => (
            <div
              key={step.name}
              className={cn(
                'flex-1 border-2 p-2 text-center transition-all',
                step.active 
                  ? 'border-[hsl(var(--cisc))]' 
                  : step.completed
                    ? 'border-muted bg-muted'
                    : 'border-muted bg-muted/30'
              )}
              style={{
                backgroundColor: step.active ? MICRO_COLORS[idx] + '40' : undefined,
                borderColor: step.active ? MICRO_COLORS[idx] : undefined,
              }}
            >
              <div className="font-mono text-xs font-bold">{step.name}</div>
              <div className="font-mono text-[10px] text-muted-foreground">
                {step.completed ? '✓' : step.active ? '→' : '○'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
