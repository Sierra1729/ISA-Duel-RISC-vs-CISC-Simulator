import { Cpu } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b-4 border-foreground bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4">
          <div className="p-3 border-2 border-foreground bg-foreground text-background shadow-sm">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-mono tracking-tight">
              RISC vs CISC
            </h1>
            <p className="text-sm md:text-base font-mono text-muted-foreground">
              Instruction Set Architecture Visualizer
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[hsl(var(--risc))] border-2 border-foreground" />
            <span className="font-mono text-sm">
              <span className="font-bold">RISC:</span> Reduced Instruction Set Computing
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[hsl(var(--cisc))] border-2 border-foreground" />
            <span className="font-mono text-sm">
              <span className="font-bold">CISC:</span> Complex Instruction Set Computing
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
