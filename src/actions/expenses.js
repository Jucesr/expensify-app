import database from '../firebase/firebase'

export const addExpense = (expenseData = {}) => {
  return (dispatch) => {

    const {
      description = '',
      note = '',
      amount = 0,
      createdAt = 0
    } = expenseData;

    const expense = {
      description,
      note,
      amount,
      createdAt
    };

    return database.ref('expenses').push(expense).then((ref) => {
      dispatch({
        type: 'ADD_EXPENSE',
        expense: {
          id: ref.key,
          ...expense
        }
      });
    });

  };
};

export const removeExpense = (id) => {
  return (dispatch) => {

    return database.ref(`expenses/${id}`).remove().then( () => {
      dispatch({
        type: 'REMOVE_EXPENSE',
        id
      });
    });
  };
};

export const editExpense = (id, updates) => {
  return (dispatch) => {
    return database.ref(`expenses/${id}`).update(updates).then( () => {
      dispatch({
        type: 'EDIT_EXPENSE',
        id,
        updates
      })
    });
  };
};

export const setExpenses = () => {
  return (dispatch) => {

    return database.ref('expenses').once('value').then( (snapshot) => {
      //Parsing
      const expenses = [];
      snapshot.forEach( (childSnapshot) => {
        expenses.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });

      dispatch({
        type: 'SET_EXPENSES',
        expenses: expenses
      });
    });
  }
};
