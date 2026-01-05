import { Register } from '@/lib/isa-types';
import { cn } from '@/lib/utils';
import { InfoButton } from './InfoButton';

interface RegisterViewProps {
  title: string;
  registers: Register[];
  variant: 'risc' | 'cisc';
}

export function RegisterView({ title, registers, variant }: RegisterViewProps) {
  const variantStyles = {
    risc: {
      border: 'border-[hsl(var(--risc))]',
      header: 'bg-[hsl(var(--risc))] text-[hsl(var(--risc-foreground))]',
    },
    cisc: {
      border: 'border-[hsl(var(--cisc))]',
      header: 'bg-[hsl(var(--cisc))] text-[hsl(var(--cisc-foreground))]',
    },
  };

  const styles = variantStyles[variant];

  const infoDescription = variant === 'risc'
    ? `RISC Registers:

• $zero: Always contains 0
• $t0-$t3: Temporary registers for calculations
• PC: Program Counter (current instruction address)

RISC uses many registers to reduce memory access. Values must be loaded into registers before operations.`
    : `CISC Registers:

• AX: Primary accumulator for arithmetic
• BX, CX, DX: General purpose registers
• IP: Instruction Pointer (like Program Counter)

CISC uses fewer registers but can operate directly on memory locations.`;

  return (
    <div className={cn('border-2 border-foreground shadow-sm overflow-hidden', styles.border)}>
      <div className={cn('px-3 py-2 font-mono text-sm font-bold uppercase flex items-center justify-between', styles.header)}>
        <span>{title}</span>
        <InfoButton title={title} description={infoDescription} />
      </div>
      
      <div className="p-2 bg-card">
        <div className="grid grid-cols-3 gap-1 font-mono text-xs">
          {registers.map((reg) => (
            <div
              key={reg.name}
              className="flex justify-between px-2 py-1 border border-muted hover:bg-muted transition-colors"
            >
              <span className="text-muted-foreground">{reg.name}</span>
              <span className="font-bold">{reg.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
