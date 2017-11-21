import {addExpense, editExpense, removeExpense} from '../../actions/expenses';

test('should setup remove expense action object', () => {
  const action = removeExpense({
    id: '123abc'
  });

  expect(action).toEqual({
    type: 'REMOVE_EXPENSE',
    id: '123abc'
  });
});

test('should setup edit expense action object', () => {
  const action = editExpense('123abc', {
    description: 'some expense',
    amount: 1000
  });

  expect(action).toEqual({
    id: '123abc',
    type: 'EDIT_EXPENSE',
    updates: {
      amount: 1000,
      description: 'some expense'
    }
  });
});

test('should setup add expense action object with provided values', () => {
  const data = {
    description: 'Something',
    amount: 10050,
    createdAt: 1000,
    note: 'this was last month rent'
  };

  const action = addExpense(data);

  expect(action).toEqual({
    type: 'ADD_EXPENSE',
    expense: {
      ...data,
      id: expect.any(String)
    }
  });

});

test('should setup add expense action object with default values', () => {
  const action = addExpense();

  expect(action).toEqual({
    type: 'ADD_EXPENSE',
    expense: {
      description: '',
      note: '',
      amount: 0,
      createdAt: 0,
      id: expect.any(String)
    }
  });
});
