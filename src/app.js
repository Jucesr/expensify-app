import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import AppRouter from './routers/AppRouter';

import configureStore from './store/configureStore';
import {addExpense, removeExpense, editExpense} from './actions/expenses';
import {setTextFilter, sortByDate, sortByAmount, setStartDate, setEndDate} from './actions/filters';
import getVisibleExpenses from './selectors/expenses';

import 'normalize.css/normalize.css';
import './styles/styles.scss';

const store = configureStore();

store.dispatch( addExpense({
  description: 'Water bill',
  amount: 4500
}));

store.dispatch( addExpense({
  description: 'Rent bill',
  amount: 6000
}));

store.dispatch( setTextFilter('water'));

setTimeout( () => {
  store.dispatch( setTextFilter('rent'));
},3000);

const state = store.getState();
console.log(getVisibleExpenses(state.expenses, state.filters));

const jsx = (
  <Provider store={store}>
    <AppRouter/>
  </Provider>
);

ReactDom.render(jsx, document.getElementById('app'));
