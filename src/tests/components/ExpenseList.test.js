import React from 'react';
import {shallow} from 'enzyme';
import {ExpenseList} from '../../components/ExpenseList';
import expenses from '../fixtures/expenses';
import en from '../../locale/en';

test('should render ExpenseList with expenses', () => {
  const wrapper = shallow(
    <ExpenseList
      expenses={expenses}
      dictionary={en}
    />);
  expect(wrapper).toMatchSnapshot();
});

test('should render ExpenseList with NO expenses', () => {
  const wrapper = shallow(
    <ExpenseList
      expenses={[]}
      dictionary={en}
    />);
  expect(wrapper).toMatchSnapshot();
});
