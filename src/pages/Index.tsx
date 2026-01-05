import { Header } from '@/components/Header';
import { ControlPanel } from '@/components/ControlPanel';
import { CodeView } from '@/components/CodeView';
import { PipelineView } from '@/components/PipelineView';
import { MicroStepView } from '@/components/MicroStepView';
import { RegisterView } from '@/components/RegisterView';
import { MemoryView } from '@/components/MemoryView';
import { MetricsPanel } from '@/components/MetricsPanel';
import { OutputView } from '@/components/OutputView';
import { useSimulator } from '@/hooks/use-simulator';

const Index = () => {
  const {
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
    isRunning,
    speed,
    setSpeed,
    step,
    run,
    pause,
    reset,
  } = useSimulator();

  const currentCiscInstrIndex = Math.floor(ciscState.pc);
  const currentCiscInstruction = selectedProgram.ciscInstructions[currentCiscInstrIndex] || null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Control Panel */}
        <ControlPanel
          operandA={operandA}
          operandB={operandB}
          operation={operation}
          onUpdateProgram={updateProgram}
          isRunning={isRunning}
          speed={speed}
          onSpeedChange={setSpeed}
          onStep={step}
          onRun={run}
          onPause={pause}
          onReset={reset}
        />

        {/* Output Section */}
        <OutputView
          riscResult={riscResult}
          ciscResult={ciscResult}
          operandA={operandA}
          operandB={operandB}
          operation={operation}
          isComplete={isComplete}
        />

        {/* Main visualization grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* RISC Side */}
          <div className="space-y-4">
            <CodeView
              title="RISC Assembly"
              instructions={selectedProgram.riscInstructions}
              currentPc={riscState.pc}
              variant="risc"
            />
            <PipelineView
              pipeline={riscState.pipeline}
              cycle={riscState.currentCycle}
            />
            <RegisterView
              title="RISC Registers"
              registers={riscState.registers}
              variant="risc"
            />
          </div>

          {/* CISC Side */}
          <div className="space-y-4">
            <CodeView
              title="CISC Assembly"
              instructions={selectedProgram.ciscInstructions}
              currentPc={ciscState.pc}
              variant="cisc"
            />
            <MicroStepView
              microSteps={ciscState.microSteps}
              currentStep={ciscState.currentMicroStep}
              cycle={ciscState.currentCycle}
              currentInstruction={currentCiscInstruction}
              totalCycles={currentCiscInstruction?.cycles || 1}
            />
            <RegisterView
              title="CISC Registers"
              registers={ciscState.registers}
              variant="cisc"
            />
          </div>
        </div>

        {/* Shared Memory View */}
        <MemoryView memory={riscState.memory} />

        {/* Metrics Panel */}
        <MetricsPanel riscMetrics={riscMetrics} ciscMetrics={ciscMetrics} />
      </main>
    </div>
  );
};

export default Index;
