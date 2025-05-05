export const formatAmount = (amount: string): string => {
  const num = parseFloat(amount) / 1_000_000_000_000_000_000;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });
};
