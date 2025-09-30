
import React, { useState } from 'react';
import Tabs from './components/shared/Tabs';
import TransactionStates from './components/TransactionStates';
import AcidProperties from './components/AcidProperties';
import DirtyRead from './components/DirtyRead';
import GrantRevoke from './components/GrantRevoke';
import { DatabaseIcon } from './components/shared/icons';

type Tab = 'states' | 'acid' | 'dirty' | 'dcl';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('states');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'states', label: 'Transaction States' },
    { id: 'acid', label: 'ACID Properties' },
    { id: 'dirty', label: 'Dirty Read Scenario' },
    { id: 'dcl', label: 'GRANT & REVOKE' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'states':
        return <TransactionStates />;
      case 'acid':
        return <AcidProperties />;
      case 'dirty':
        return <DirtyRead />;
      case 'dcl':
        return <GrantRevoke />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4">
            <DatabaseIcon className="w-12 h-12 text-cyan-400" />
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Transaction Management Simulator
            </h1>
          </div>
          <p className="mt-4 text-lg text-slate-400">
            An interactive tool to understand core database concepts.
          </p>
        </header>

        <main>
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <div className="mt-6 bg-slate-800/50 p-6 rounded-lg shadow-2xl border border-slate-700 min-h-[600px]">
            {renderContent()}
          </div>
        </main>
        
        <footer className="text-center mt-8 text-slate-500">
          <p>Built with React, TypeScript, and Tailwind CSS.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
