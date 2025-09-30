
import React, { useState, useEffect } from 'react';
import Card from './shared/Card';
import { PlayIcon } from './shared/icons';

const INITIAL_BALANCE = 1000;

interface TransactionState {
  log: string[];
  localBalance: number | null;
  status: 'Idle' | 'Active' | 'Committed' | 'Rolled Back';
}

const steps = [
  { tx: 1, action: 'BEGIN TRANSACTION', description: "T1 starts and intends to withdraw $100." },
  { tx: 1, action: 'READ', description: `T1 reads the account balance: $${INITIAL_BALANCE}.` },
  { tx: 1, action: 'UPDATE_LOCAL', description: "T1 calculates the new balance locally: $1000 - $100 = $900." },
  { tx: 1, action: 'WRITE', description: "T1 writes the new, uncommitted balance ($900) to the database." },
  { tx: 2, action: 'BEGIN TRANSACTION', description: "T2 starts, intending to read the balance for a report." },
  { tx: 2, action: 'READ', isDirty: true, description: "T2 reads the balance. It sees $900, which is uncommitted data from T1." },
  { tx: 1, action: 'ROLLBACK', description: "T1 encounters an error and rolls back. The original balance of $1000 is restored." },
  { tx: 2, action: 'USE_VALUE', description: "T2 proceeds, using the incorrect value of $900 for its report, leading to data inconsistency." },
];

const DirtyRead: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dbBalance, setDbBalance] = useState(INITIAL_BALANCE);
  const [isUncommitted, setIsUncommitted] = useState(false);
  const [t1State, setT1State] = useState<TransactionState>({ log: [], localBalance: null, status: 'Idle' });
  const [t2State, setT2State] = useState<TransactionState>({ log: [], localBalance: null, status: 'Idle' });
  const [isFinished, setIsFinished] = useState(false);
  
  const resetSimulation = () => {
    setCurrentStep(0);
    setDbBalance(INITIAL_BALANCE);
    setIsUncommitted(false);
    setT1State({ log: [], localBalance: null, status: 'Idle' });
    setT2State({ log: [], localBalance: null, status: 'Idle' });
    setIsFinished(false);
  }

  useEffect(resetSimulation, []);

  const handleNextStep = () => {
    if (currentStep >= steps.length) {
        setIsFinished(true);
        return;
    }

    const step = steps[currentStep];
    const newLogEntry = `[Step ${currentStep + 1}] ${step.action}`;

    if (step.tx === 1) {
      const newT1State = { ...t1State, log: [...t1State.log, newLogEntry] };
      switch (step.action) {
        case 'BEGIN TRANSACTION':
          newT1State.status = 'Active';
          break;
        case 'READ':
          newT1State.localBalance = dbBalance;
          break;
        case 'UPDATE_LOCAL':
          newT1State.localBalance = INITIAL_BALANCE - 100;
          break;
        case 'WRITE':
          setDbBalance(900);
          setIsUncommitted(true);
          break;
        case 'ROLLBACK':
          setDbBalance(INITIAL_BALANCE);
          setIsUncommitted(false);
          newT1State.status = 'Rolled Back';
          break;
      }
      setT1State(newT1State);
    } else { // tx === 2
      const newT2State = { ...t2State, log: [...t2State.log, newLogEntry] };
       switch (step.action) {
        case 'BEGIN TRANSACTION':
          newT2State.status = 'Active';
          break;
        case 'READ':
          newT2State.localBalance = dbBalance;
          break;
        case 'USE_VALUE':
          newT2State.status = 'Committed';
          break;
      }
      setT2State(newT2State);
    }
    
    if (currentStep + 1 >= steps.length) {
        setIsFinished(true);
    }
    setCurrentStep(currentStep + 1);
  };
  
  const currentStepInfo = !isFinished ? steps[currentStep]?.description : "Simulation finished. T2 has used inconsistent data.";

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2 text-cyan-400">Dirty Read Simulation</h2>
      <p className="text-center text-slate-400 mb-8">A dirty read occurs when a transaction reads data that has been written by another transaction but has not yet been committed.</p>
      
      <div className="text-center mb-6">
          <button onClick={handleNextStep} disabled={isFinished} className="px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors shadow-md disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center gap-2 mx-auto">
              <PlayIcon className="w-5 h-5"/>
              {isFinished ? 'Finished' : `Execute Step ${currentStep + 1}`}
          </button>
           <button onClick={resetSimulation} className="mt-2 text-sm text-slate-400 hover:text-white">Reset</button>
      </div>

      <Card className="mb-6 bg-slate-900/50" title="Simulation Step Description">
        <p className="text-lg text-yellow-300 text-center font-mono">{currentStepInfo}</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Transaction 1 */}
        <Card title="Transaction 1 (T1)">
          <p className="text-sm mb-2"><strong>Status:</strong> <span className="font-semibold">{t1State.status}</span></p>
          <p className="text-sm mb-4"><strong>Local View of Balance:</strong> <span className="font-mono">{t1State.localBalance === null ? 'N/A' : `$${t1State.localBalance}`}</span></p>
          <div className="h-48 bg-slate-900 p-2 rounded overflow-y-auto font-mono text-xs text-slate-300">
            {t1State.log.map((l, i) => <p key={i}>{l}</p>)}
          </div>
        </Card>
        
        {/* Database State */}
        <Card title="Database State" className="text-center flex flex-col justify-center items-center">
          <p className="text-slate-400">Shared Account Balance</p>
          <p className={`text-6xl font-bold my-4 transition-colors ${isUncommitted ? 'text-orange-400' : 'text-green-400'}`}>
            ${dbBalance}
          </p>
          {isUncommitted && (
            <div className="p-2 bg-orange-500/20 text-orange-300 text-sm rounded-md">
              <p>This value is <strong>UNCOMMITTED</strong>.</p>
            </div>
          )}
        </Card>

        {/* Transaction 2 */}
        <Card title="Transaction 2 (T2)">
          <p className="text-sm mb-2"><strong>Status:</strong> <span className="font-semibold">{t2State.status}</span></p>
          <p className="text-sm mb-4"><strong>Local View of Balance:</strong> <span className="font-mono">{t2State.localBalance === null ? 'N/A' : `$${t2State.localBalance}`}</span></p>
          <div className="h-48 bg-slate-900 p-2 rounded overflow-y-auto font-mono text-xs text-slate-300">
            {t2State.log.map((l, i) => {
              const isDirtyStep = steps[i]?.isDirty && l.includes('READ');
              return (
                <p key={i} className={isDirtyStep ? 'text-red-400 font-bold' : ''}>
                  {l}
                  {isDirtyStep && ' (DIRTY READ!)'}
                </p>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DirtyRead;
