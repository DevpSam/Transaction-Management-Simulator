
import React, { useState } from 'react';
import CodeBlock from './shared/CodeBlock';

type AcidProperty = 'A' | 'C' | 'I' | 'D';

const properties = {
  A: {
    name: 'Atomicity',
    tagline: 'All or nothing.',
    description: 'An atomic transaction is an indivisible and irreducible series of database operations such that either all occurs, or nothing occurs. It ensures that any transaction is treated as a single "unit" which cannot be partially completed.',
    example: `
BEGIN TRANSACTION;

-- Step 1: Debit $100 from Alice's account
UPDATE Accounts SET balance = balance - 100 WHERE name = 'Alice';

-- Imagine a system crash happens here!

-- Step 2: Credit $100 to Bob's account
UPDATE Accounts SET balance = balance + 100 WHERE name = 'Bob';

COMMIT;
    `,
    explanation: "With atomicity, if the system crashes after step 1, the entire transaction is rolled back. Alice's account is not debited. The database state remains unchanged, preventing inconsistencies."
  },
  C: {
    name: 'Consistency',
    tagline: 'Data stays valid.',
    description: 'Consistency ensures that a transaction brings the database from one valid state to another. Any data written to the database must be valid according to all defined rules, including constraints, cascades, triggers, and any combination thereof.',
    example: `
-- Rule: An account balance cannot be negative.
-- Initial State: Alice has $50, Bob has $100.
BEGIN TRANSACTION;

-- Attempt to transfer $70 from Alice to Bob
UPDATE Accounts SET balance = balance - 70 WHERE name = 'Alice'; -- This would make Alice's balance -$20
UPDATE Accounts SET balance = balance + 70 WHERE name = 'Bob';

COMMIT;
    `,
    explanation: "With consistency, this transaction would fail and be rolled back because it violates the business rule (balance >= 0). The database state is preserved, remaining consistent."
  },
  I: {
    name: 'Isolation',
    tagline: 'Transactions don’t interfere.',
    description: "Isolation ensures that the concurrent execution of transactions results in a system state that would be obtained if transactions were executed sequentially. Each transaction is in a 'bubble', unaware of other ongoing transactions.",
    example: `
-- Transaction 1
BEGIN TRANSACTION;
SELECT SUM(balance) FROM Accounts;
-- (sees total: $1500)

-- Meanwhile, Transaction 2 runs
BEGIN TRANSACTION;
UPDATE Accounts SET balance = balance - 100 WHERE name = 'Charlie';
COMMIT;

-- Back to Transaction 1
SELECT SUM(balance) FROM Accounts;
-- (still sees total: $1500, not $1400)
COMMIT;
    `,
    explanation: "Because of isolation, T1's view of the database is a consistent snapshot from when it began. It doesn't see T2's uncommitted (or even committed) changes, preventing confusion and ensuring predictable results. The 'Dirty Read' tab demonstrates a failure of isolation."
  },
  D: {
    name: 'Durability',
    tagline: 'Once committed, it stays committed.',
    description: 'Durability guarantees that once a transaction has been committed, it will remain so, even in the event of power loss, crashes, or errors. In a relational database, for instance, once a group of SQL statements execute, the results need to be stored permanently.',
    example: `
BEGIN TRANSACTION;

-- Register a new user
INSERT INTO Users (username, password_hash) VALUES ('dave', 'xyz123');

COMMIT; -- This call blocks until the data is written to permanent storage (e.g., disk).
    `,
    explanation: "After the COMMIT returns success, the new user 'dave' is guaranteed to exist in the database, even if the server loses power a millisecond later. This is typically achieved through mechanisms like write-ahead logging."
  }
};

const AccordionItem: React.FC<{
  property: AcidProperty;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ property, isOpen, onToggle }) => {
  const { name, tagline, description, example, explanation } = properties[property];

  return (
    <div className="border-b border-slate-700">
      <h2>
        <button
          type="button"
          className="flex items-center justify-between w-full p-5 font-medium text-left text-slate-300 hover:bg-slate-800/50"
          onClick={onToggle}
          aria-expanded={isOpen}
        >
          <div className="flex items-center">
            <span className="text-3xl font-bold text-cyan-400 mr-4">{property}</span>
            <div>
              <span className="text-xl">{name}</span>
              <span className="text-sm text-slate-400 block">{tagline}</span>
            </div>
          </div>
          <svg className={`w-6 h-6 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
      </h2>
      <div className={`p-5 border-t border-slate-700 bg-slate-900/30 ${!isOpen ? 'hidden' : ''}`}>
        <p className="mb-2 text-slate-300">{description}</p>
        <CodeBlock code={example} />
        <p className="text-slate-300 italic">{explanation}</p>
      </div>
    </div>
  );
};


const AcidProperties: React.FC = () => {
  const [openProperty, setOpenProperty] = useState<AcidProperty | null>('A');

  const handleToggle = (property: AcidProperty) => {
    setOpenProperty(openProperty === property ? null : property);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2 text-cyan-400">The ACID Properties of Transactions</h2>
      <p className="text-center text-slate-400 mb-8">A set of properties that guarantee database transactions are processed reliably.</p>
      <div className="rounded-lg overflow-hidden border border-slate-700">
        {(['A', 'C', 'I', 'D'] as AcidProperty[]).map((prop) => (
          <AccordionItem
            key={prop}
            property={prop}
            isOpen={openProperty === prop}
            onToggle={() => handleToggle(prop)}
          />
        ))}
      </div>
    </div>
  );
};

export default AcidProperties;
