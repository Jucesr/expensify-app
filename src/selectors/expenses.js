// Get visible expenses

export default (expenses, {text, sortBy, startDate, endDate}) => {

  return expenses.filter( (expense) => {
    const startDateMatch = typeof startDate !== 'number' || expense.createdAt >= startDate;
    const endDateMatch = typeof endDate !== 'number' || expense.createdAt <= endDate;
    const textMatch = text.length === 0 || expense.description.toLowerCase().includes(text.toLowerCase());
    return startDateMatch && endDateMatch && textMatch;
  }).sort( (a, b) => {
    switch (sortBy) {
      case 'date':
        return a.createdAt < b.createdAt ? 1: -1;
      case 'amount':
        return a.amount < b.amount ? 1: -1;
    }
  });
}
