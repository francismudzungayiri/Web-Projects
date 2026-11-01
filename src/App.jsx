import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import './App.css'
import Summary from './components/Summary.jsx'
import TransactionForm from './components/TransactionForm.jsx'
import TransactionList from './components/TransactionList.jsx'

const UNDO_TIMEOUT_MS = 5000;

const CATEGORIES = ["food", "housing", "utilities", "transport", "entertainment", "salary", "other"];

const INITIAL_TRANSACTIONS = [
  { id: 1, description: "Salary", amount: 5000, type: "income", category: "salary", date: "2025-01-01" },
  { id: 2, description: "Rent", amount: 1200, type: "expense", category: "housing", date: "2025-01-02" },
  { id: 3, description: "Groceries", amount: 150, type: "expense", category: "food", date: "2025-01-03" },
  { id: 4, description: "Freelance Work", amount: 800, type: "income", category: "salary", date: "2025-01-05" },
  { id: 5, description: "Electric Bill", amount: 95, type: "expense", category: "utilities", date: "2025-01-06" },
  { id: 6, description: "Dinner Out", amount: 65, type: "expense", category: "food", date: "2025-01-07" },
  { id: 7, description: "Gas", amount: 45, type: "expense", category: "transport", date: "2025-01-08" },
  { id: 8, description: "Netflix", amount: 15, type: "expense", category: "entertainment", date: "2025-01-10" },
];

// Animates rows moving in and out where the browser supports view transitions.
function animateListChange(update) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduceMotion) {
    update();
    return;
  }
  document.startViewTransition(() => flushSync(update));
}

function App() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [lastDeleted, setLastDeleted] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!lastDeleted) return;
    const timer = setTimeout(() => setLastDeleted(null), UNDO_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [lastDeleted]);

  const handleAdd = (transaction) => {
    animateListChange(() => setTransactions(current => [...current, transaction]));
  };

  const handleDelete = (id) => {
    const index = transactions.findIndex(t => t.id === id);
    const transaction = transactions[index];

    animateListChange(() => {
      setTransactions(current => current.filter(t => t.id !== id));
      setLastDeleted({ transaction, index });
    });
  };

  const handleUndo = () => {
    const { transaction, index } = lastDeleted;

    animateListChange(() => {
      setTransactions(current => [...current.slice(0, index), transaction, ...current.slice(index)]);
      setLastDeleted(null);
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Finance Tracker</h1>
        <button className="primary-btn" onClick={() => setIsAdding(true)}>Add transaction</button>
      </header>

      <Summary transactions={transactions} />
      <TransactionList transactions={transactions} categories={CATEGORIES} onDelete={handleDelete} />

      {isAdding && (
        <TransactionForm
          categories={CATEGORIES}
          onAdd={handleAdd}
          onClose={() => setIsAdding(false)}
        />
      )}

      {lastDeleted && (
        <div
          key={lastDeleted.transaction.id}
          className="undo-toast"
          role="status"
          style={{ '--undo-duration': `${UNDO_TIMEOUT_MS}ms` }}
        >
          <span>Deleted "{lastDeleted.transaction.description}"</span>
          <button onClick={handleUndo}>Undo</button>
        </div>
      )}
    </div>
  );
}

export default App
