export function formatPrice(value: number): string {
  return 'R$ ' + value.toFixed(2);
}

export function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
}
