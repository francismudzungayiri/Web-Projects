import { useEffect, useRef, useState } from 'react'
import formatMoney from '../formatMoney.js'

const COUNT_DURATION_MS = 400;

function useCountingNumber(target) {
  const [displayed, setDisplayed] = useState(target);
  const currentRef = useRef(target);

  useEffect(() => {
    const from = currentRef.current;
    if (from === target) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduceMotion ? 0 : COUNT_DURATION_MS;
    const start = performance.now();
    let frame;

    const step = (now) => {
      const progress = duration ? Math.min((now - start) / duration, 1) : 1;
      if (progress < 1) {
        const eased = 1 - (1 - progress) ** 3;
        currentRef.current = from + (target - from) * eased;
        setDisplayed(Math.round(currentRef.current));
        frame = requestAnimationFrame(step);
      } else {
        currentRef.current = target;
        setDisplayed(target);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return displayed;
}

function ProgressRing({ percentLeft }) {
  return (
    <div className="ring" role="img" aria-label={`${percentLeft}% of income left`}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className="ring-track" cx="50" cy="50" r="44" />
        <circle
          className="ring-fill"
          cx="50"
          cy="50"
          r="44"
          pathLength="100"
          strokeDasharray={`${percentLeft} 100`}
          opacity={percentLeft > 0 ? 1 : 0}
        />
      </svg>
      <div className="ring-label" aria-hidden="true">
        <strong>{percentLeft}%</strong>
        <span>left</span>
      </div>
    </div>
  );
}

function Summary({ transactions }) {
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const displayedBalance = useCountingNumber(balance);
  const percentLeft = totalIncome > 0 ? Math.max(0, Math.round((balance / totalIncome) * 100)) : 0;

  return (
    <section className="summary card" aria-label="Summary">
      <div className="summary-main">
        <div className="balance">
          <h2>Balance</h2>
          <p className={`balance-amount ${balance < 0 ? "expense-amount" : ""}`}>{formatMoney(displayedBalance)}</p>
        </div>
        <ProgressRing percentLeft={percentLeft} />
      </div>
      <dl className="stats">
        <div>
          <dt>Income</dt>
          <dd className="income-amount">{formatMoney(totalIncome)}</dd>
        </div>
        <div>
          <dt>Expenses</dt>
          <dd className="expense-amount">{formatMoney(totalExpenses)}</dd>
        </div>
      </dl>
    </section>
  );
}

export default Summary
