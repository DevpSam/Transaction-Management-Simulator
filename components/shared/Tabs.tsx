import React from 'react';

interface TabsProps<T extends string> {
  tabs: { id: T; label: string }[];
  activeTab: T;
  // FIX: Update type to be compatible with useState's setter function, which can accept a value or a function.
  setActiveTab: React.Dispatch<React.SetStateAction<T>>;
}

const Tabs = <T extends string,>({ tabs, activeTab, setActiveTab }: TabsProps<T>) => {
  return (
    <div className="border-b border-slate-700">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${
              activeTab === tab.id
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
