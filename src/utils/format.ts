export const formatAmount = (amount: string): string => {
  const num = parseFloat(amount) / 1_000_000;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
};
