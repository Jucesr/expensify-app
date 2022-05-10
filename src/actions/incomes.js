import database from '../firebase/firebase'
import Income from "../models/Income";

export const addIncome = (incomeData = {}) => {
  return (dispatch, getState) => {
    const uid = getState().auth.uid;
    const {
      payment_method = '',
      category = '',
      description = '',
      note = '',
      amount = 0,
      createdAt = 0
    } = incomeData;

    const incomeEntity = new Income(
      category,
      description,
      amount,
      payment_method,
      createdAt,
      note,
    );

    return database.ref(`users/${uid}/incomes`).push(incomeEntity).then((ref) => {
      dispatch({
        type: 'ADD_INCOME',
        income: {
          id: ref.key,
          ...incomeEntity
        }
      });
    });

  };
};

export const removeIncome = (id) => {
  return (dispatch, getState) => {
    const uid = getState().auth.uid;
    return database.ref(`users/${uid}/incomes/${id}`).remove().then( () => {
      dispatch({
        type: 'REMOVE_INCOME',
        id
      });
    });
  };
};

export const editIncome = (id, updates) => {
  return (dispatch, getState) => {
    const uid = getState().auth.uid;
    return database.ref(`users/${uid}/incomes/${id}`).update(updates).then( () => {
      dispatch({
        type: 'EDIT_INCOME',
        id,
        updates
      })
    });
  };
};

export const setIncomes = () => {
  return (dispatch, getState) => {
    const uid = getState().auth.uid;
    return database.ref(`users/${uid}/incomes`).once('value').then( (snapshot) => {
      //Parsing
      const incomes = [];
      snapshot.forEach( (childSnapshot) => {
        incomes.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });

      dispatch({
        type: 'SET_INCOMES',
        incomes: incomes
      });
    });
  }
};
