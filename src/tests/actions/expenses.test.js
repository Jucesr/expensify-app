import mockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {addExpense, editExpense, removeExpense} from '../../actions/expenses';
import expenses from '../fixtures/expenses';
import database from '../../firebase/firebase';

const createMockStore = mockStore([thunk]);

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

test('should save expense in redux store and database', (done) => {
  const store = createMockStore({});
  const expense = expenses[0];
  delete expense.id;

  store.dispatch(addExpense(expense)).then( () => {
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: 'ADD_EXPENSE',
      expense: {
        id: expect.any(String),
        ...expense
      }
    });

    return database.ref(`expenses/${actions[0].expense.id}`).once('value');
  }).then( (snapshot) => {
    expect(snapshot.val()).toEqual(expense);
    done();
  });
});

test('should save expense with default values in redux store and database', (done) => {
  const store = createMockStore({});

  store.dispatch(addExpense()).then( () => {
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: 'ADD_EXPENSE',
      expense: {
        id: expect.any(String),
        description: '',
        note: '',
        amount: 0,
        createdAt : 0
      }
    });

    return database.ref(`expenses/${actions[0].expense.id}`).once('value');
  }).then( (snapshot) => {
    expect(snapshot.val()).toEqual({
      description : '',
      note : '',
      amount : 0,
      createdAt : 0
    });
    done();
  });
});
