import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import AppRouter from './routers/AppRouter';

import configureStore from './store/configureStore';
import {addExpense, removeExpense, editExpense} from './actions/expenses';
import {setTextFilter, sortByDate, sortByAmount, setStartDate, setEndDate} from './actions/filters';
import getVisibleExpenses from './selectors/expenses';

import 'normalize.css/normalize.css';
import 'react-dates/lib/css/_datepicker.css';
import './styles/styles.scss';

const store = configureStore();

store.dispatch( addExpense({
  description: 'Water bill',
  amount: 4500,
  createdAt: 1000
}));

store.dispatch( addExpense({
  description: 'Rent bill',
  amount: 50000,
  createdAt: 6589
}));

store.dispatch( addExpense({
  description: 'Gas bill',
  amount: 12000,
  createdAt: 580
}));

store.dispatch( addExpense({
  description: 'Dinner with mom',
  amount: 6000,
  createdAt: 8000
}));

const state = store.getState();
console.log(getVisibleExpenses(state.expenses, state.filters));

const jsx = (
  <Provider store={store}>
    <AppRouter/>
  </Provider>
);

ReactDom.render(jsx, document.getElementById('app'));
