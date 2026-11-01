import { useEffect, useRef, useState } from 'react'

function TransactionForm({ categories, onAdd, onClose }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("food");
  const dialogRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
    descriptionRef.current.focus();
  }, []);

  const close = () => dialogRef.current.close();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    close();
    onAdd({
      id: Date.now(),
      description,
      amount: Number(amount),
      type,
      category,
      date: new Date().toLocaleDateString('en-CA'),
    });
  };

  return (
    <dialog
      ref={dialogRef}
      className="add-panel"
      aria-labelledby="add-panel-title"
      onClose={onClose}
      onClick={(e) => { if (e.target === dialogRef.current) close(); }}
    >
      <div className="add-panel-content">
        <div className="add-panel-header">
          <h2 id="add-panel-title">Add transaction</h2>
          <button className="icon-btn" aria-label="Close" onClick={close}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <fieldset className="type-switch">
            <legend className="visually-hidden">Type</legend>
            {["expense", "income"].map(option => (
              <label key={option}>
                <input
                  type="radio"
                  name="type"
                  value={option}
                  checked={type === option}
                  onChange={(e) => setType(e.target.value)}
                />
                <span>{option}</span>
              </label>
            ))}
          </fieldset>
          <label className="field">
            Description
            <input
              ref={descriptionRef}
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label className="field">
            Amount
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <label className="field">
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
          <button className="primary-btn" type="submit">Add transaction</button>
        </form>
      </div>
    </dialog>
  );
}

export default TransactionForm
