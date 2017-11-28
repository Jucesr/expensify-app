import database from '../firebase/firebase'

// ADD_EXPENSE


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

// REMOVE_EXPENSE

export const removeExpense = ( {id} = {}) => ({
  type: 'REMOVE_EXPENSE',
  id
});

// EDIT_EXPENSE

export const editExpense = (id, updates) => ({
  type: 'EDIT_EXPENSE',
  id,
  updates
});

//SET_EXPENSES

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
