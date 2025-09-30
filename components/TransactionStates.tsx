
import React, { useState } from 'react';
import { TransactionState } from '../types';
import { ArrowRightIcon, CheckCircleIcon, XCircleIcon } from './shared/icons';

const stateConfig = {
  [TransactionState.IDLE]: {
    label: 'Idle',
    description: 'The system is ready to begin a new transaction. No operations are currently in progress.',
    color: 'bg-slate-600',
    actions: [{ label: 'Begin Transaction', nextState: TransactionState.ACTIVE }],
  },
  [TransactionState.ACTIVE]: {
    label: 'Active',
    description: 'The transaction is in progress. Operations (read, write, update) are being executed. Changes are not yet permanent.',
    color: 'bg-blue-500',
    actions: [
      { label: 'Execute Operation', nextState: TransactionState.ACTIVE },
      { label: 'End Transaction', nextState: TransactionState.PARTIALLY_COMMITTED },
      { label: 'Simulate Failure', nextState: TransactionState.FAILED },
    ],
  },
  [TransactionState.PARTIALLY_COMMITTED]: {
    label: 'Partially Committed',
    description: 'All operations have finished successfully. Changes are saved to a temporary log, awaiting final commit to the database.',
    color: 'bg-yellow-500',
    actions: [
      { label: 'Commit', nextState: TransactionState.COMMITTED },
      { label: 'Simulate Failure', nextState: TransactionState.FAILED },
    ],
  },
  [TransactionState.COMMITTED]: {
    label: 'Committed',
    description: 'The transaction has completed successfully. All changes are now permanently saved to the database.',
    color: 'bg-green-500',
    actions: [{ label: 'Start New', nextState: TransactionState.IDLE }],
  },
  [TransactionState.FAILED]: {
    label: 'Failed',
    description: 'An error occurred during the Active or Partially Committed state. The transaction must be rolled back.',
    color: 'bg-red-500',
    actions: [{ label: 'Rollback', nextState: TransactionState.ABORTED }],
  },
  [TransactionState.ABORTED]: {
    label: 'Aborted',
    description: 'The transaction has been rolled back. The database is restored to its state before the transaction began.',
    color: 'bg-gray-500',
    actions: [{ label: 'Start New', nextState: TransactionState.IDLE }],
  },
};

const StateBox: React.FC<{ state: TransactionState; isActive: boolean }> = ({ state, isActive }) => {
  const config = stateConfig[state];
  return (
    <div className={`
      p-4 rounded-lg border-2 text-center transition-all duration-300
      ${isActive ? `${config.color} border-white shadow-lg scale-110` : 'bg-slate-700 border-slate-600'}
    `}>
      <h4 className="font-bold">{config.label}</h4>
    </div>
  );
};

const TransactionStates: React.FC = () => {
  const [currentState, setCurrentState] = useState<TransactionState>(TransactionState.IDLE);
  const [log, setLog] = useState<string[]>(['Simulator initialized.']);

  const handleAction = (nextState: TransactionState, actionLabel: string) => {
    if (nextState === TransactionState.IDLE) {
      setLog(['Simulator reset.']);
    } else {
      setLog(prev => [...prev, `Action: "${actionLabel}" -> State: ${stateConfig[nextState].label}`]);
    }
    setCurrentState(nextState);
  };

  const currentConfig = stateConfig[currentState];

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2 text-cyan-400">Interactive Transaction State Machine</h2>
      <p className="text-center text-slate-400 mb-8">Click the buttons to move the transaction through its lifecycle.</p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mb-12 flex-wrap">
        <StateBox state={TransactionState.ACTIVE} isActive={currentState === TransactionState.ACTIVE} />
        <ArrowRightIcon className="w-6 h-6 text-slate-500 rotate-90 md:rotate-0" />
        <StateBox state={TransactionState.PARTIALLY_COMMITTED} isActive={currentState === TransactionState.PARTIALLY_COMMITTED} />
        <ArrowRightIcon className="w-6 h-6 text-slate-500 rotate-90 md:rotate-0" />
        <StateBox state={TransactionState.COMMITTED} isActive={currentState === TransactionState.COMMITTED} />
        <div className="w-full md:w-auto flex justify-center items-center mt-4 md:mt-0">
          <div className="h-12 w-px bg-slate-600 md:h-px md:w-12"></div>
          <div className="flex flex-col items-center gap-2 mx-4">
              <span className="text-red-400 text-sm">On Failure</span>
              <ArrowRightIcon className="w-6 h-6 text-red-400 rotate-90" />
          </div>
          <div className="h-12 w-px bg-slate-600 md:h-px md:w-12"></div>
        </div>
        <StateBox state={TransactionState.FAILED} isActive={currentState === TransactionState.FAILED} />
        <ArrowRightIcon className="w-6 h-6 text-slate-500 rotate-90 md:rotate-0" />
        <StateBox state={TransactionState.ABORTED} isActive={currentState === TransactionState.ABORTED} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${currentConfig.color}`}></div>
            Current State: <span className="text-cyan-300">{currentConfig.label}</span>
          </h3>
          <p className="text-slate-300 min-h-[80px]">{currentConfig.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {currentConfig.actions.map(({ label, nextState }) => (
              <button
                key={label}
                onClick={() => handleAction(nextState, label)}
                className="px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors shadow-md"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
          <h3 className="text-xl font-semibold mb-4">Transaction Log</h3>
          <div className="h-48 overflow-y-auto bg-slate-900 p-3 rounded-md font-mono text-sm text-slate-400 space-y-2">
            {log.map((entry, i) => (
              <div key={i} className="flex items-start gap-2">
                {entry.includes('COMMITTED') || entry.includes('Aborted') ? (
                  entry.includes('COMMITTED') ? <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-px"/> : <XCircleIcon className="w-5 h-5 text-gray-500 flex-shrink-0 mt-px"/>
                ) : <span className="text-slate-600 flex-shrink-0">&gt;</span>}
                <p>{entry}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStates;
