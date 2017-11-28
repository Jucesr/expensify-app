import expensesReducer from '../../reducers/expenses';
import expenses from '../fixtures/expenses';
import moment from 'moment';

test('should set default state', () => {
  const state = expensesReducer(undefined, {type: '@@INIT'});

  expect(state).toEqual([]);
});

test('should remove expense by id', () => {
  const action = {
    type: 'REMOVE_EXPENSE',
    id: expenses[1].id
  };

  const state = expensesReducer(expenses, action);
  //console.log(JSON.stringify(state, null, 2));
  expect(state).toEqual([expenses[0], expenses[2], expenses[3]]);
});

test('should not remove expense if invalid id', () => {
  const action = {
    type: 'REMOVE_EXPENSE',
    id: '-1'
  };

  const state = expensesReducer(expenses, action);

  expect(state).toEqual(expenses);
});

test('should add an expense', () => {
  const expense = {
    id: '5',
    description: 'Five item',
    note: '',
    amount: 96315,
    createdAt: moment(0).valueOf()
  }

  const action = {
    type: 'ADD_EXPENSE',
    expense: expense

  };

  const state = expensesReducer(expenses, action);

  expect(state).toEqual([...expenses, expense] );
});

test('should edit expense by id', () => {
  const updates = {
    amount: 3333,
  }

  const action = {
    type: 'EDIT_EXPENSE',
    id: '3',
    updates: updates

  };

  const state = expensesReducer(expenses, action);

  expect(state[2].amount).toBe(3333);
});

test('should not edit expense if invalid id', () => {
  const updates = {
    amount: 8545,
  }

  const action = {
    type: 'EDIT_EXPENSE',
    id: '-1',
    updates: updates

  };

  const state = expensesReducer(expenses, action);

  expect(state).toEqual(expenses);
});

test('should set expenses', () => {
  const action = {
    type: 'SET_EXPENSES',
    expenses: [expenses[1]]
  }

  const state = expensesReducer(expenses, action);
  expect(state).toEqual([expenses[1]]);
});
