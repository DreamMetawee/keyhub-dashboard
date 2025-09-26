// src/lib/utils.ts

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('th-TH', { // เปลี่ยนเป็น th-TH
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
  });
}