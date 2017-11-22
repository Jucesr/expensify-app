import React from 'react';
import {shallow} from 'enzyme';
import {ExpenseSumary} from '../../components/ExpenseSumary';
import expenses from '../fixtures/expenses';

test('should render ExpenseSumary with 1 expense', () => {
  const wrapper = shallow(<ExpenseSumary expenseCount={1} expensesTotal={5640}/>);
  expect(wrapper).toMatchSnapshot();

});

test('should render ExpenseSumary with 2 expenses', () => {
  const wrapper = shallow(<ExpenseSumary expenseCount={2} expensesTotal={7895}/>);
  expect(wrapper).toMatchSnapshot();

});
