import React from 'react';
import {shallow} from 'enzyme';
import {ExpenseSumary} from '../../components/ExpenseSumary';
import expenses from '../fixtures/expenses';
import en from '../../locale/en';

test('should render ExpenseSumary with 1 expense', () => {
  const wrapper = shallow(
    <ExpenseSumary
      expenseCount={1}
      expensesTotal={5640}
      hideExpenses={0}
      dictionary={en}
    />);
  expect(wrapper).toMatchSnapshot();

});

test('should render ExpenseSumary with 2 expenses', () => {
  const wrapper = shallow(
    <ExpenseSumary
      expenseCount={2}
      expensesTotal={7895}
      hideExpenses={0}
      dictionary={en}
    />);
  expect(wrapper).toMatchSnapshot();

});
