import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import AppRouter from './routers/AppRouter';

import configureStore from './store/configureStore';
import {setExpenses} from './actions/expenses';
import {setTextFilter, sortByDate, sortByAmount, setStartDate, setEndDate} from './actions/filters';
import getVisibleExpenses from './selectors/expenses';

import './firebase/firebase';

import 'normalize.css/normalize.css';
import 'react-dates/lib/css/_datepicker.css';
import './styles/styles.scss';

const store = configureStore();

const state = store.getState();

const jsx = (
  <Provider store={store}>
    <AppRouter/>
  </Provider>
);

ReactDom.render(<p> Loading... </p>, document.getElementById('app'));

store.dispatch(setExpenses()).then( () => {
  ReactDom.render(jsx, document.getElementById('app'));
}).catch( () => {
  ReactDom.render(<p> Could not fetch data.</p>, document.getElementById('app'));
});
