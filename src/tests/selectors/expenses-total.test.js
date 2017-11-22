import getExpensesTotal from '../../selectors/expenses-total';
import expenses from '../fixtures/expenses';

test('should return 0 if no expenses', () => {
  const result = getExpensesTotal([]);
  expect(result).toBe(0);
});

test('should add up a single expense', () => {
  const result = getExpensesTotal([expenses[1]]);
  expect(result).toBe(109500);
});

test('should add up a single expense', () => {
  const result = getExpensesTotal(expenses);
  expect(result).toBe(121995);
});
