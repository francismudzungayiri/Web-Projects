export default function formatMoney(value) {
  const hasCents = Math.round(value * 100) % 100 !== 0;
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  });
}
