const ICONS = {
  food: (
    <>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </>
  ),
  housing: (
    <>
      <path d="M3 10a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
    </>
  ),
  utilities: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  transport: (
    <>
      <path d="M3 17v-4l2.5-6a2 2 0 0 1 1.8-1h9.4a2 2 0 0 1 1.8 1l2.5 6v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M3 13h18" />
      <path d="M7 18v2" />
      <path d="M17 18v2" />
    </>
  ),
  entertainment: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m10 8 6 4-6 4z" />
    </>
  ),
  salary: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 12h.01" />
      <path d="M18 12h.01" />
    </>
  ),
  other: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h.01" />
      <path d="M12 12h.01" />
      <path d="M16 12h.01" />
    </>
  ),
};

function CategoryIcon({ category }) {
  return (
    <svg className="category-icon" viewBox="0 0 24 24" aria-hidden="true">
      {ICONS[category] ?? ICONS.other}
    </svg>
  );
}

export default CategoryIcon
