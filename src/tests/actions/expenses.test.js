import mockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {addExpense, editExpense, removeExpense, setExpenses} from '../../actions/expenses';
import expenses from '../fixtures/expenses';
import database from '../../firebase/firebase';

const uid = 'thisismytestuid';
const createMockStore = mockStore([thunk]);
const expenseData = {};

beforeEach( (done) => {

  expenses.forEach(({id, description, note, amount, createdAt}) => {
    expenseData[id] = { description, note, amount, createdAt}
  });
  database.ref(`users/${uid}/expenses`).set(expenseData).then( () => done());
});

test('should save expense in redux store and database', (done) => {
  const store = createMockStore({auth: {uid}});
  const expense = {
    description: 'none',
    amount: 450,
    createdAt: 8798,
    note: ''
  }

  store.dispatch(addExpense(expense)).then( () => {
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: 'ADD_EXPENSE',
      expense: {
        id: expect.any(String),
        ...expense
      }
    });

    return database.ref(`users/${uid}/expenses/${actions[0].expense.id}`).once('value');
  }).then( (snapshot) => {
    expect(snapshot.val()).toEqual(expense);
    done();
  });
});

test('should save expense with default values in redux store and database', (done) => {
  const store = createMockStore({auth: {uid}});

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

    return database.ref(`users/${uid}/expenses/${actions[0].expense.id}`).once('value');
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

test('should set expenses in redux store from database data', (done) => {
  const store = createMockStore({auth: {uid}});

  store.dispatch(setExpenses()).then( () => {
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: 'SET_EXPENSES',
      expenses: expenses
    });
    done();
  });
});

test('should remove expense from store and database', (done) => {
  const store = createMockStore({auth: {uid}});
  const id = 2;

  store.dispatch(removeExpense(id)).then( () => {
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: 'REMOVE_EXPENSE',
      id: id
    });

    return database.ref(`users/${uid}/expenses/${id}`).once('value');
  }).then( (snapshot) => {
    expect(snapshot.val()).toBeFalsy();
    done();
  });
});

test('should edit expense in store and database', (done) => {
  const store = createMockStore({auth: {uid}});
  const id = 1;
  const updates = {
    description: 'this is from test',
    amount: 1234567
  };

  store.dispatch(editExpense(id, updates)).then( () => {
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: 'EDIT_EXPENSE',
      id,
      updates
    });

    return database.ref(`users/${uid}/expenses/${id}`).once('value');
  }).then( (snapshot) => {
    expect(snapshot.val().description).toEqual(updates.description );
    done();
  });

});
