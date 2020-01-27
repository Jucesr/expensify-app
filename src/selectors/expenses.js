import moment from 'moment';

// Get visible expenses

export default (expenses, {text, sortBy, startDate, endDate, category, payment_method}) => {

  return expenses.filter( (expense) => {
    const createdAtMoment = moment(expense.createdAt);
    const startDateMatch = startDate ? startDate.isSameOrBefore(createdAtMoment, 'day') : true
    const endDateMatch = endDate ? endDate.isSameOrAfter(createdAtMoment, 'day') : true
    const textMatch = text.length === 0 || expense.description.toLowerCase().includes(text.toLowerCase());
    const categoryMatch = category == 'disabled' ? true : (expense.category == category);
    const paymentMethodMatch = payment_method == 'disabled' ? true : (expense.payment_method == payment_method);
    return startDateMatch && endDateMatch && textMatch && categoryMatch && paymentMethodMatch;
  }).sort( (a, b) => {
    switch (sortBy) {
      case 'date':
        return a.createdAt < b.createdAt ? 1: -1;
      case 'amount':
        return a.amount < b.amount ? 1: -1;
    }
  });
}
