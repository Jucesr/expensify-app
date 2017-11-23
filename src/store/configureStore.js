import {createStore, combineReducers} from 'redux';
import undoable, { distinctState } from 'redux-undo'
import expensesReducer from '../reducers/expenses';
import filtersReducer from '../reducers/filters';

export default () => {
  const store = createStore(
    combineReducers({
      expenses: undoable(expensesReducer, {
        limit: 3,
        filter: distinctState()
      }),
      filters: filtersReducer
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  return store;
};
