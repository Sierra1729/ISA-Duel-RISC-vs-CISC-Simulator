import { Metrics } from '@/lib/isa-types';
import { cn } from '@/lib/utils';
import { InfoButton } from './InfoButton';

interface MetricsPanelProps {
  riscMetrics: Metrics;
  ciscMetrics: Metrics;
}

interface MetricCardProps {
  label: string;
  riscValue: string | number;
  ciscValue: string | number;
  highlight?: 'risc' | 'cisc' | null;
}

function MetricCard({ label, riscValue, ciscValue, highlight }: MetricCardProps) {
  return (
    <div className="border-2 border-foreground shadow-xs bg-card">
      <div className="px-3 py-1.5 bg-muted border-b-2 border-foreground">
        <span className="font-mono text-xs font-bold uppercase">{label}</span>
      </div>
      <div className="p-2">
        <div className="grid grid-cols-2 gap-2">
          <div className={cn(
            'text-center p-2 border-2',
            highlight === 'risc' 
              ? 'border-[hsl(var(--risc))] bg-[hsl(var(--risc-muted))]' 
              : 'border-muted'
          )}>
            <div className="font-mono text-xl font-bold">{riscValue}</div>
            <div className="font-mono text-[10px] text-[hsl(var(--risc))] font-bold">RISC</div>
          </div>
          <div className={cn(
            'text-center p-2 border-2',
            highlight === 'cisc' 
              ? 'border-[hsl(var(--cisc))] bg-[hsl(var(--cisc-muted))]' 
              : 'border-muted'
          )}>
            <div className="font-mono text-xl font-bold">{ciscValue}</div>
            <div className="font-mono text-[10px] text-[hsl(var(--cisc))] font-bold">CISC</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MetricsPanel({ riscMetrics, ciscMetrics }: MetricsPanelProps) {
  const determineWinner = (risc: number, cisc: number, lowerIsBetter: boolean = true) => {
    if (risc === cisc || risc === 0 || cisc === 0) return null;
    if (lowerIsBetter) return risc < cisc ? 'risc' : 'cisc';
    return risc > cisc ? 'risc' : 'cisc';
  };

  return (
    <div className="border-2 border-foreground shadow-md overflow-hidden">
      <div className="px-4 py-3 bg-foreground text-background font-mono text-sm font-bold uppercase flex items-center justify-between">
        <span>Performance Comparison</span>
        <InfoButton 
          title="Performance Metrics"
          description={`Compare how RISC and CISC execute the same program:

• Total Cycles: Clock cycles to complete (lower = faster)
• Instructions: Number of assembly instructions (RISC has more, simpler ones)
• CPI: Cycles Per Instruction (RISC aims for ~1, CISC is higher)
• Code Size: Program size in bytes (CISC is more compact)

Key insight: RISC uses more instructions but each is faster. CISC uses fewer instructions but each takes longer.`}
        />
      </div>
      
      <div className="p-4 bg-card">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard
            label="Cycles"
            riscValue={riscMetrics.totalCycles}
            ciscValue={ciscMetrics.totalCycles}
            highlight={determineWinner(riscMetrics.totalCycles, ciscMetrics.totalCycles)}
          />
          
          <MetricCard
            label="Instructions"
            riscValue={riscMetrics.instructionCount}
            ciscValue={ciscMetrics.instructionCount}
            highlight={determineWinner(riscMetrics.instructionCount, ciscMetrics.instructionCount)}
          />
          
          <MetricCard
            label="CPI"
            riscValue={riscMetrics.cpi.toFixed(2)}
            ciscValue={ciscMetrics.cpi.toFixed(2)}
            highlight={determineWinner(riscMetrics.cpi, ciscMetrics.cpi)}
          />
          
          <MetricCard
            label="Size"
            riscValue={`${riscMetrics.codeSize}B`}
            ciscValue={`${ciscMetrics.codeSize}B`}
            highlight={determineWinner(riscMetrics.codeSize, ciscMetrics.codeSize)}
          />
        </div>
      </div>
    </div>
  );
}
