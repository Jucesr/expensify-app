import React from 'react';
import moment from 'moment';
import {shallow} from 'enzyme';
import ExpenseForm from '../../components/ExpenseForm';
import expenses from '../fixtures/expenses';

test('should render ExpenseForm', () => {
  const wrapper = shallow(<ExpenseForm/>);
  expect(wrapper).toMatchSnapshot();
});

test('should render ExpenseForm with expense data', () => {
  const wrapper = shallow(<ExpenseForm expense={expenses[0]} />);
  expect(wrapper).toMatchSnapshot();
});

test('should render error in ExpenseForm with invalid submission', () => {
  const wrapper = shallow(<ExpenseForm />);
  expect(wrapper).toMatchSnapshot();
  wrapper.find('form').simulate('submit', {
    preventDefault: () => {}
  });

  expect(wrapper.state('error').length).toBeGreaterThan(0);
  expect(wrapper).toMatchSnapshot();
});

test('should set description in ExpenseForm on input change', () => {
  const value = 'test description';
  const wrapper = shallow(<ExpenseForm/>);
  wrapper.find('input').at(0).simulate('change',{
    target: {
      value
    }
  });
  expect(wrapper.state('description')).toBe(value);
});

test('should set note in ExpenseForm on textArea change', () => {
  const value = 'test description';
  const wrapper = shallow(<ExpenseForm/>);
  wrapper.find('textarea').at(0).simulate('change',{
    target: {
      value
    }
  });
  expect(wrapper.state('note')).toBe(value);
});

test('should set amount on input change if valid input', () => {
  const value = '23.50';
  const wrapper = shallow(<ExpenseForm/>);
  wrapper.find('input').at(1).simulate('change',{
    target: {
      value
    }
  });
  expect(wrapper.state('amount')).toBe(value);
});

test('should NOT set amount on input change if invalid input', () => {
  const value = 'abc132';
  const wrapper = shallow(<ExpenseForm/>);
  wrapper.find('input').at(1).simulate('change',{
    target: {
      value
    }
  });
  expect(wrapper.state('amount')).not.toBe(value);
});

test('should call onSubmit prop for valid form submission', () => {
  const onSubmitSpy = jest.fn();
  const {description, amount, note, createdAt} = expenses[0];
  const wrapper = shallow(<ExpenseForm expense={expenses[0]} onSubmit={onSubmitSpy}/>);
  wrapper.find('form').simulate('submit', {
    preventDefault: () => {}
  });

  expect(wrapper.state('error')).toBe('');
  expect(onSubmitSpy).toHaveBeenLastCalledWith({
    description,
    amount,
    note,
    createdAt,
  });
});

test('should set new date on date change', () => {
  const now = moment();
  const wrapper = shallow(<ExpenseForm />);
  wrapper.find('SingleDatePicker').prop('onDateChange')(now);
  expect(wrapper.state('createdAt')).toEqual(now);

});

test('should set calendarFocused on focused change', () => {
  const wrapper = shallow(<ExpenseForm />);
  wrapper.find('SingleDatePicker').prop('onFocusChange')({focused: true});
  expect(wrapper.state('calendarFocused')).toBe(true);

});
