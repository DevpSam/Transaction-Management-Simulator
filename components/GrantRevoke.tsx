
import React, { useState } from 'react';
import Card from './shared/Card';
import CodeBlock from './shared/CodeBlock';
import { CheckCircleIcon, XCircleIcon } from './shared/icons';

const sampleData = [
  { id: 1, name: 'Laptop', price: 1200 },
  { id: 2, name: 'Mouse', price: 25 },
  { id: 3, name: 'Keyboard', price: 75 },
];

const GrantRevoke: React.FC = () => {
  const [hasSelectPrivilege, setHasSelectPrivilege] = useState(false);
  const [attemptResult, setAttemptResult] = useState<{ type: 'none' | 'success' | 'error'; message: string }>({ type: 'none', message: '' });

  const handleGrant = () => {
    setHasSelectPrivilege(true);
    setAttemptResult({type: 'none', message: ''});
  };

  const handleRevoke = () => {
    setHasSelectPrivilege(false);
    setAttemptResult({type: 'none', message: ''});
  };

  const handleSelectAttempt = () => {
    if (hasSelectPrivilege) {
      setAttemptResult({
        type: 'success',
        message: JSON.stringify(sampleData, null, 2),
      });
    } else {
      setAttemptResult({
        type: 'error',
        message: 'Error: Access denied. User "Bob" does not have SELECT privilege on table "Products".',
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2 text-cyan-400">Data Control Language (DCL) Demo</h2>
      <p className="text-center text-slate-400 mb-8">Simulate GRANT and REVOKE commands to manage user permissions.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Admin Panel */}
        <Card title="Admin (DBA) Control Panel">
          <p className="mb-4 text-slate-300">As the Database Administrator, you can grant or revoke privileges for users.</p>
          <div className="mb-6">
            <h4 className="font-semibold text-slate-200">User Privileges for "Bob"</h4>
            <div className="flex items-center gap-3 mt-2">
              {hasSelectPrivilege ? (
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
              ) : (
                <XCircleIcon className="w-6 h-6 text-red-500" />
              )}
              <span className={`font-mono ${hasSelectPrivilege ? 'text-green-400' : 'text-red-400'}`}>
                SELECT on Products: {hasSelectPrivilege ? 'GRANTED' : 'REVOKED'}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <CodeBlock code="GRANT SELECT ON Products TO Bob;" language="sql" />
              <button onClick={handleGrant} className="w-full px-4 py-2 rounded-md bg-green-600 hover:bg-green-500 text-white font-semibold transition-colors">
                Execute GRANT
              </button>
            </div>
            <div>
              <CodeBlock code="REVOKE SELECT ON Products FROM Bob;" language="sql" />
              <button onClick={handleRevoke} className="w-full px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors">
                Execute REVOKE
              </button>
            </div>
          </div>
        </Card>

        {/* User Panel */}
        <Card title='User "Bob" Session'>
          <p className="mb-4 text-slate-300">As user "Bob", you can attempt to query the Products table.</p>
          <CodeBlock code="SELECT * FROM Products;" language="sql" />
          <button onClick={handleSelectAttempt} className="w-full px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors">
            Attempt to SELECT data
          </button>
          <div className="mt-6">
            <h4 className="font-semibold text-slate-200 mb-2">Query Result:</h4>
            {attemptResult.type !== 'none' && (
              <div className={`p-4 rounded-md font-mono text-sm border ${
                attemptResult.type === 'success'
                  ? 'bg-green-900/50 border-green-700 text-green-300'
                  : 'bg-red-900/50 border-red-700 text-red-300'
              }`}>
                <pre>{attemptResult.message}</pre>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GrantRevoke;
