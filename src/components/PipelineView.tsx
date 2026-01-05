import { PipelineStage, PIPELINE_COLORS } from '@/lib/isa-types';
import { cn } from '@/lib/utils';
import { InfoButton } from './InfoButton';

interface PipelineViewProps {
  pipeline: PipelineStage[];
  cycle: number;
}

export function PipelineView({ pipeline, cycle }: PipelineViewProps) {
  return (
    <div className="border-2 border-[hsl(var(--risc))] shadow-sm overflow-hidden">
      <div className="px-3 py-2 bg-[hsl(var(--risc))] text-[hsl(var(--risc-foreground))] font-mono text-sm font-bold uppercase flex items-center justify-between">
        <span>RISC Pipeline (Cycle: {cycle})</span>
        <InfoButton 
          title="RISC 5-Stage Pipeline"
          description={`The RISC pipeline processes instructions in 5 stages:

• IF (Fetch): Get instruction from memory
• ID (Decode): Decode instruction & read registers
• EX (Execute): Perform ALU operation
• MEM (Memory): Access data memory if needed
• WB (Write Back): Write result to register

Each stage handles a different instruction simultaneously, allowing multiple instructions to be in-flight at once. This is called "pipelining" and makes RISC processors very efficient.`}
        />
      </div>
      
      <div className="p-3 bg-card">
        <div className="flex gap-1">
          {pipeline.map((stage, idx) => (
            <div
              key={stage.name}
              className={cn(
                'flex-1 border-2 p-2 text-center transition-all',
                stage.active 
                  ? 'border-[hsl(var(--risc))] bg-[hsl(var(--risc-muted))]' 
                  : 'border-muted bg-muted/30'
              )}
              style={{
                backgroundColor: stage.active ? PIPELINE_COLORS[idx] + '40' : undefined,
                borderColor: stage.active ? PIPELINE_COLORS[idx] : undefined,
              }}
            >
              <div className="font-mono text-xs font-bold">{stage.name}</div>
              {stage.instruction && (
                <div className="font-mono text-[10px] text-muted-foreground mt-1 truncate">
                  {stage.instruction.opcode}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-2 flex gap-2 justify-center flex-wrap">
          {['IF', 'ID', 'EX', 'MEM', 'WB'].map((name, idx) => (
            <div key={name} className="flex items-center gap-1">
              <div 
                className="w-3 h-3 border"
                style={{ backgroundColor: PIPELINE_COLORS[idx] }}
              />
              <span className="font-mono text-[10px]">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
