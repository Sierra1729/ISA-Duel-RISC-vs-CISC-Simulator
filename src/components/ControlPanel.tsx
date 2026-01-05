import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { InfoButton } from './InfoButton';
import { useState } from 'react';

interface ControlPanelProps {
  operandA: number;
  operandB: number;
  operation: 'Addition' | 'Subtraction';
  onUpdateProgram: (op: 'Addition' | 'Subtraction', a: number, b: number) => void;
  isRunning: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onStep: () => void;
  onRun: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function ControlPanel({
  operandA,
  operandB,
  operation,
  onUpdateProgram,
  isRunning,
  speed,
  onSpeedChange,
  onStep,
  onRun,
  onPause,
  onReset,
}: ControlPanelProps) {
  const [inputA, setInputA] = useState(operandA.toString());
  const [inputB, setInputB] = useState(operandB.toString());
  const [selectedOp, setSelectedOp] = useState<'Addition' | 'Subtraction'>(operation);

  const handleApply = () => {
    const a = parseInt(inputA) || 0;
    const b = parseInt(inputB) || 0;
    onUpdateProgram(selectedOp, a, b);
  };

  return (
    <div className="border-2 border-foreground bg-card p-4 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-sm font-bold uppercase">Control Panel</span>
        <InfoButton 
          title="Control Panel"
          description={`Use this panel to:

• Enter your own values for A and B
• Choose between Addition or Subtraction
• Click "Apply" to update the program
• Use Step to execute one cycle at a time
• Use Play to run automatically
• Use Reset to start over
• Adjust speed to control animation speed`}
        />
      </div>

      <div className="flex flex-wrap items-end gap-4">
        {/* Input Values */}
        <div className="flex items-end gap-2">
          <div className="space-y-1">
            <label className="font-mono text-xs font-bold">Value A</label>
            <Input
              type="number"
              value={inputA}
              onChange={(e) => setInputA(e.target.value)}
              className="w-20 border-2 border-foreground font-mono"
              disabled={isRunning}
            />
          </div>
          
          <div className="space-y-1">
            <label className="font-mono text-xs font-bold">Operation</label>
            <Select
              value={selectedOp}
              onValueChange={(v) => setSelectedOp(v as 'Addition' | 'Subtraction')}
              disabled={isRunning}
            >
              <SelectTrigger className="w-[120px] border-2 border-foreground font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Addition" className="font-mono">+ Addition</SelectItem>
                <SelectItem value="Subtraction" className="font-mono">- Subtraction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs font-bold">Value B</label>
            <Input
              type="number"
              value={inputB}
              onChange={(e) => setInputB(e.target.value)}
              className="w-20 border-2 border-foreground font-mono"
              disabled={isRunning}
            />
          </div>

          <Button
            variant="outline"
            onClick={handleApply}
            disabled={isRunning}
            className="border-2 border-foreground shadow-xs hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-mono"
          >
            Apply
          </Button>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onStep}
            disabled={isRunning}
            className="border-2 border-foreground shadow-xs hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            title="Step"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          
          {isRunning ? (
            <Button
              variant="outline"
              size="icon"
              onClick={onPause}
              className="border-2 border-foreground shadow-xs hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              title="Pause"
            >
              <Pause className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={onRun}
              className="border-2 border-foreground shadow-xs hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              title="Run"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            className="border-2 border-foreground shadow-xs hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <span className="font-mono text-xs font-bold uppercase whitespace-nowrap">Speed:</span>
          <Slider
            value={[1000 - speed]}
            onValueChange={([v]) => onSpeedChange(1000 - v)}
            min={0}
            max={900}
            step={100}
            className="flex-1"
          />
          <span className="font-mono text-xs w-16">{speed}ms</span>
        </div>
      </div>

      {/* Current Operation Display */}
      <div className="mt-3 p-2 bg-muted border-2 border-dashed border-muted-foreground">
        <p className="font-mono text-sm text-center">
          Computing: <span className="font-bold">{operandA}</span> {operation === 'Addition' ? '+' : '-'} <span className="font-bold">{operandB}</span> = <span className="font-bold">{operation === 'Addition' ? operandA + operandB : operandA - operandB}</span>
        </p>
      </div>
    </div>
  );
}
