import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import AppRouter from './routers/AppRouter';

import configureStore from './store/configureStore';
import {addExpense, removeExpense, editExpense} from './actions/expenses';
import {setTextFilter, sortByDate, sortByAmount, setStartDate, setEndDate} from './actions/filters';
import getVisibleExpenses from './selectors/expenses';

import './firebase/firebase';

import 'normalize.css/normalize.css';
import 'react-dates/lib/css/_datepicker.css';
import './styles/styles.scss';

const store = configureStore();

//add 1000 expenses

for (var i = 0; i < 4; i++) {
  store.dispatch( addExpense({
    description: `expense ${i}`,
    amount: i,
    createdAt: i
  }));
}

const state = store.getState();

const jsx = (
  <Provider store={store}>
    <AppRouter/>
  </Provider>
);

ReactDom.render(jsx, document.getElementById('app'));
