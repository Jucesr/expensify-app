import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import undoable, { distinctState } from 'redux-undo';
import thunk from 'redux-thunk';
import expensesReducer from '../reducers/expenses';
import filtersReducer from '../reducers/filters';
import authReducer from '../reducers/auth';
import langReducer from '../reducers/lang';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      expenses: undoable(expensesReducer, {
        limit: 3,
        filter: distinctState()
      }),
      filters: filtersReducer,
      auth: authReducer,
      lang: langReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
  );

  return store;
};
