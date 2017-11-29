import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import AppRouter, {history} from './routers/AppRouter';

import configureStore from './store/configureStore';
import {setExpenses} from './actions/expenses';
import {login, logout} from './actions/auth';

import {firebase} from './firebase/firebase';

import 'normalize.css/normalize.css';
import 'react-dates/lib/css/_datepicker.css';
import './styles/styles.scss';

const store = configureStore();

const jsx = (
  <Provider store={store}>
    <AppRouter/>
  </Provider>
);

let hasRenderer = false;
const renderApp = () => {
  if(!hasRenderer){
    ReactDom.render(jsx, document.getElementById('app'));
    hasRenderer = true;
  }
};

ReactDom.render(<p> Loading... </p>, document.getElementById('app'));

firebase.auth().onAuthStateChanged( (user) => {
  if(user){
    store.dispatch(login(user.uid));
    store.dispatch(setExpenses()).then( () => {
      renderApp();
      if(history.location.pathname === '/'){
        history.push('/dashboard');
      }
    });
  }
  else {
    store.dispatch(logout());
    renderApp();
    history.push('/');
  }
});
