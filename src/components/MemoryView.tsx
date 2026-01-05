import { MemoryCell } from '@/lib/isa-types';
import { InfoButton } from './InfoButton';

interface MemoryViewProps {
  memory: MemoryCell[];
}

export function MemoryView({ memory }: MemoryViewProps) {
  const labels = ['A (Input)', 'B (Input)', 'Result'];
  
  return (
    <div className="border-2 border-foreground shadow-sm overflow-hidden">
      <div className="px-3 py-2 bg-muted font-mono text-sm font-bold uppercase flex items-center justify-between">
        <span>Memory</span>
        <InfoButton 
          title="Memory"
          description={`Memory stores data that the CPU operates on.

• Address 0x100: First input value (A)
• Address 0x104: Second input value (B)  
• Address 0x108: Result of the operation

Both RISC and CISC share the same memory, but access it differently:
• RISC: Must load values to registers first, then operate
• CISC: Can operate directly on memory locations`}
        />
      </div>
      
      <div className="p-3 bg-card">
        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
          {memory.map((cell, idx) => (
            <div
              key={cell.address}
              className="flex flex-col items-center px-3 py-2 border-2 border-muted hover:bg-muted transition-colors"
            >
              <span className="text-[10px] text-muted-foreground mb-1">
                {labels[idx] || 'Memory'}
              </span>
              <span className="text-muted-foreground">
                [0x{cell.address.toString(16).toUpperCase()}]
              </span>
              <span className="font-bold text-lg">{cell.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
