import moment from 'moment';

// Get visible expenses

export default (expenses, {text, sortBy, startDate, endDate, category, sub_category, payment_method, card_id}) => {

  return expenses.filter( (expense) => {
    const createdAtMoment = moment(expense.createdAt);
    const startDateMatch = startDate ? startDate.isSameOrBefore(createdAtMoment, 'day') : true
    const endDateMatch = endDate ? endDate.isSameOrAfter(createdAtMoment, 'day') : true
    const textMatch = text.length === 0 || expense.description.toLowerCase().includes(text.toLowerCase()) || expense.note.toLowerCase().includes(text.toLowerCase());
    const categoryMatch = category == 'disabled' ? true : (expense.category == category);
    const subCategoryMatch = sub_category == 'disabled' ? true : (expense.sub_category == sub_category);
    const paymentMethodMatch = payment_method == 'disabled' ? true : (expense.payment_method == payment_method);
    const cardIdMatch = card_id == 'disabled' ? true : (expense.card_id == card_id);
    return startDateMatch && endDateMatch && textMatch && categoryMatch && paymentMethodMatch && subCategoryMatch && cardIdMatch;
  }).sort( (a, b) => {
    switch (sortBy) {
      case 'date':
        return a.createdAt < b.createdAt ? 1: -1;
      case 'amount':
        return a.amount < b.amount ? 1: -1;
    }
  });
}
