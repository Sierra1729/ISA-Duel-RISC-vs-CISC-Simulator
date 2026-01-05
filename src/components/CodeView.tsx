import { Instruction } from '@/lib/isa-types';
import { cn } from '@/lib/utils';
import { InfoButton } from './InfoButton';

interface CodeViewProps {
  title: string;
  instructions: Instruction[];
  currentPc: number;
  variant: 'risc' | 'cisc';
  activeIndices?: number[];
}

export function CodeView({ title, instructions, currentPc, variant, activeIndices = [] }: CodeViewProps) {
  const variantStyles = {
    risc: {
      border: 'border-[hsl(var(--risc))]',
      header: 'bg-[hsl(var(--risc))] text-[hsl(var(--risc-foreground))]',
      active: 'bg-[hsl(var(--risc-muted))]',
    },
    cisc: {
      border: 'border-[hsl(var(--cisc))]',
      header: 'bg-[hsl(var(--cisc))] text-[hsl(var(--cisc-foreground))]',
      active: 'bg-[hsl(var(--cisc-muted))]',
    },
  };

  const styles = variantStyles[variant];

  const infoDescription = variant === 'risc' 
    ? `RISC (Reduced Instruction Set Computer):

• Uses simple, fixed-length instructions (32 bits each)
• Load/Store architecture: only LOAD and STORE access memory
• All other operations work only with registers
• Each instruction typically takes 1 clock cycle
• Requires more instructions but executes faster
• Examples: ARM, MIPS, RISC-V`
    : `CISC (Complex Instruction Set Computer):

• Uses complex, variable-length instructions (1-15 bytes)
• Can directly operate on memory locations
• Fewer instructions needed but each takes multiple cycles
• Complex addressing modes supported
• Examples: x86, x86-64`;

  return (
    <div className={cn('border-2 border-foreground shadow-sm overflow-hidden', styles.border)}>
      <div className={cn('px-3 py-2 font-mono text-sm font-bold uppercase flex items-center justify-between', styles.header)}>
        <span>{title}</span>
        <InfoButton title={variant === 'risc' ? 'RISC Assembly Code' : 'CISC Assembly Code'} description={infoDescription} />
      </div>
      
      <div className="max-h-48 overflow-y-auto bg-card">
        <table className="w-full font-mono text-xs">
          <thead className="bg-muted sticky top-0">
            <tr>
              <th className="px-2 py-1 text-left border-b border-foreground">Addr</th>
              <th className="px-2 py-1 text-left border-b border-foreground">Instruction</th>
              <th className="px-2 py-1 text-left border-b border-foreground">Description</th>
            </tr>
          </thead>
          <tbody>
            {instructions.map((instr, idx) => {
              const isActive = activeIndices.includes(idx) || Math.floor(currentPc / (variant === 'risc' ? 4 : 1)) === idx;
              return (
                <tr
                  key={idx}
                  className={cn(
                    'border-b border-muted transition-colors',
                    isActive && styles.active
                  )}
                >
                  <td className="px-2 py-1.5 text-muted-foreground">
                    0x{instr.address.toString(16).padStart(2, '0').toUpperCase()}
                  </td>
                  <td className="px-2 py-1.5">
                    <span className="font-bold">{instr.opcode}</span>{' '}
                    <span className="text-muted-foreground">{instr.operands.join(', ')}</span>
                  </td>
                  <td className="px-2 py-1.5 text-muted-foreground text-[10px]">
                    {instr.description}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
