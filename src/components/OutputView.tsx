import { InfoButton } from './InfoButton';

interface OutputViewProps {
  riscResult: number | null;
  ciscResult: number | null;
  operandA: number;
  operandB: number;
  operation: string;
  isComplete: boolean;
}

export function OutputView({ 
  riscResult, 
  ciscResult, 
  operandA, 
  operandB, 
  operation,
  isComplete 
}: OutputViewProps) {
  const expectedResult = operation === 'Addition' 
    ? operandA + operandB 
    : operandA - operandB;

  return (
    <div className="border-2 border-foreground shadow-md overflow-hidden">
      <div className="px-4 py-3 bg-foreground text-background font-mono text-sm font-bold uppercase flex items-center justify-between">
        <span>Output / Result</span>
        <InfoButton 
          title="Output Section"
          description={`This section shows the final result of the computation.

Both RISC and CISC architectures perform the same operation but in different ways:
• RISC uses multiple simple instructions
• CISC uses fewer complex instructions

The result should be the same: ${operandA} ${operation === 'Addition' ? '+' : '-'} ${operandB} = ${expectedResult}`}
        />
      </div>
      
      <div className="p-6 bg-card">
        <div className="text-center mb-4">
          <div className="font-mono text-lg text-muted-foreground">
            {operandA} {operation === 'Addition' ? '+' : '-'} {operandB} = ?
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* RISC Result */}
          <div className="border-2 border-[hsl(var(--risc))] p-4 text-center">
            <div className="font-mono text-xs text-[hsl(var(--risc))] font-bold mb-2">RISC RESULT</div>
            <div className="font-mono text-4xl font-bold">
              {isComplete ? (riscResult ?? '—') : '...'}
            </div>
            {isComplete && riscResult === expectedResult && (
              <div className="mt-2 text-xs text-green-600 font-mono">✓ Correct</div>
            )}
          </div>

          {/* CISC Result */}
          <div className="border-2 border-[hsl(var(--cisc))] p-4 text-center">
            <div className="font-mono text-xs text-[hsl(var(--cisc))] font-bold mb-2">CISC RESULT</div>
            <div className="font-mono text-4xl font-bold">
              {isComplete ? (ciscResult ?? '—') : '...'}
            </div>
            {isComplete && ciscResult === expectedResult && (
              <div className="mt-2 text-xs text-green-600 font-mono">✓ Correct</div>
            )}
          </div>
        </div>

        {isComplete && (
          <div className="mt-4 p-3 bg-muted border-2 border-dashed border-muted-foreground">
            <p className="font-mono text-xs text-center text-muted-foreground">
              Both architectures computed the same result using different instruction sets!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
