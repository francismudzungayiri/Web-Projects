import { useState } from 'react'
import formatMoney from '../formatMoney.js'
import CategoryIcon from './CategoryIcon.jsx'

const TYPE_FILTERS = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expenses" },
];

function formatDay(date) {
  const [year, month, day] = date.split('-').map(Number);
  const value = new Date(year, month - 1, day);
  const today = new Date();
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

  if (value.toDateString() === today.toDateString()) return "Today";
  if (value.toDateString() === yesterday.toDateString()) return "Yesterday";
  return value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function groupByDay(transactions) {
  const newestFirst = [...transactions].sort((a, b) => b.date.localeCompare(a.date));
  const groups = [];
  for (const transaction of newestFirst) {
    const group = groups.at(-1);
    if (group?.date === transaction.date) {
      group.transactions.push(transaction);
    } else {
      groups.push({ date: transaction.date, transactions: [transaction] });
    }
  }
  return groups;
}

function FilterPills({ label, options, value, onChange }) {
  return (
    <div className="pills" role="group" aria-label={label}>
      {options.map(option => (
        <button
          key={option.value}
          className="pill"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function TransactionList({ transactions, categories, onDelete }) {
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [revealedId, setRevealedId] = useState(null);

  let filteredTransactions = transactions;
  if (filterType !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.type === filterType);
  }
  if (filterCategory !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.category === filterCategory);
  }

  const categoryFilters = [
    { value: "all", label: "All categories" },
    ...categories.map(cat => ({ value: cat, label: cat })),
  ];

  return (
    <section className="transactions">
      <h2>Transactions</h2>
      <div className="filters">
        <FilterPills label="Filter by type" options={TYPE_FILTERS} value={filterType} onChange={setFilterType} />
        <FilterPills label="Filter by category" options={categoryFilters} value={filterCategory} onChange={setFilterCategory} />
      </div>

      {groupByDay(filteredTransactions).map(group => (
        <div key={group.date} className="day" style={{ viewTransitionName: `day-${group.date}` }}>
          <h3>{formatDay(group.date)}</h3>
          <ul className="card">
            {group.transactions.map(t => (
              <li
                key={t.id}
                className={`row ${revealedId === t.id ? "is-revealed" : ""}`}
                style={{ viewTransitionName: `row-${t.id}` }}
              >
                <span className="row-icon"><CategoryIcon category={t.category} /></span>
                <div className="row-text">
                  <span className="row-description">{t.description}</span>
                  <span className="row-category">{t.category}</span>
                </div>
                <span className={`row-amount ${t.type === "income" ? "income-amount" : "expense-amount"}`}>
                  {t.type === "income" ? "+" : "-"}{formatMoney(t.amount)}
                </span>
                <button
                  className="icon-btn row-more"
                  aria-label={`More actions for ${t.description}`}
                  aria-expanded={revealedId === t.id}
                  onClick={() => setRevealedId(revealedId === t.id ? null : t.id)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h.01" />
                    <path d="M12 12h.01" />
                    <path d="M19 12h.01" />
                  </svg>
                </button>
                <button
                  className="delete-btn"
                  aria-label={`Delete ${t.description}`}
                  onClick={() => onDelete(t.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {filteredTransactions.length === 0 && (
        <p className="empty-state card">
          {transactions.length === 0
            ? "No transactions yet. Add one to start your balance."
            : "No transactions match these filters. Change a filter to see more."}
        </p>
      )}
    </section>
  );
}

export default TransactionList
