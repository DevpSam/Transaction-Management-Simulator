
import React from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'sql' }) => {
  return (
    <div className="bg-slate-900 rounded-md my-4">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-700/50 rounded-t-md">
        <span className="text-xs font-sans text-slate-400">{language}</span>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          Copy
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className={`language-${language} text-sm text-slate-300`}>
          {code.trim()}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
