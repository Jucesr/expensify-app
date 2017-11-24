import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import undoable, { distinctState } from 'redux-undo'
import expensesReducer from '../reducers/expenses';
import filtersReducer from '../reducers/filters';
import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      expenses: undoable(expensesReducer, {
        limit: 3,
        filter: distinctState()
      }),
      filters: filtersReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
  );

  return store;
};
