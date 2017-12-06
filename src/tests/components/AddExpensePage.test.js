import React from 'react';
import {shallow} from 'enzyme';
import {AddExpensePage} from '../../components/AddExpensePage';
import expenses from '../fixtures/expenses';
import en from '../../locale/en';

let addExpense, history, wrapper;

beforeEach( () => {
  addExpense = jest.fn();
  history = {push: jest.fn()};
  wrapper = shallow(
    <AddExpensePage
      addExpense={addExpense}
      history={history}
      dictionary={en}
    />);

});

test('should render AddExpensePage ', () => {
    expect(wrapper).toMatchSnapshot();
});

test('should handle onSubmit in AddExpensePage ', () => {
  wrapper.find('ExpenseForm').prop('onSubmit')(expenses[1]);
  expect(history.push).toHaveBeenLastCalledWith('/');
  expect(addExpense).toHaveBeenLastCalledWith(expenses[1]);
});
