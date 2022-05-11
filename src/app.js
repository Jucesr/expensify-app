import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import AppRouter, {history} from './routers/AppRouter';
import configureStore from './store/configureStore';
import {setExpenses} from './actions/expenses';
import {setIncomes} from './actions/incomes';
import {login, logout} from './actions/auth';
import {setLanguage} from './actions/lang';
import {firebase} from './firebase/firebase';
import LoadingPage from './components/LoadingPage';


import 'normalize.css/normalize.css';
import 'react-dates/lib/css/_datepicker.css';
import './styles/styles.scss';
import 'moment/locale/es';

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

ReactDom.render(<LoadingPage/>, document.getElementById('app'));

//Set default language
const defaultLanguage = navigator.language || navigator.userLanguage || 'en-US';

if(defaultLanguage == 'es'){
  store.dispatch(setLanguage(defaultLanguage));
}else{
  store.dispatch(setLanguage('es'));
}


firebase.auth().onAuthStateChanged( (user) => {
  if(user){
    store.dispatch(login(user)).then( async () => {
      await store.dispatch(setExpenses())
      await store.dispatch(setIncomes())
      return 
    }).then( () => {
      renderApp();
    });

  }
  else {
    renderApp();
    store.dispatch(logout());
  }
});
