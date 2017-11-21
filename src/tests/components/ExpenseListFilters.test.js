import React from 'react';
import moment from 'moment';
import {shallow} from 'enzyme';
import {ExpenseListFilters} from '../../components/ExpenseListFilters';
import {filters, altfilters} from '../fixtures/filters';

let setTextFilter, sortByDate, sortByAmount, setStartDate, setEndDate, wrapper;

beforeEach(() => {
  setTextFilter = jest.fn();
  sortByDate = jest.fn();
  sortByAmount = jest.fn();
  setStartDate = jest.fn();
  setEndDate = jest.fn();
  wrapper = shallow(
    <ExpenseListFilters
      filters={filters}
      setTextFilter={setTextFilter}
      sortByDate={sortByDate}
      sortByAmount={sortByAmount}
      setStartDate={setStartDate}
      setEndDate={setEndDate}
    />
  );

});

test('should render ExpenseListFilters', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should render ExpenseListFilters with alt data', () => {
  wrapper.setProps({filters: altfilters});
  expect(wrapper).toMatchSnapshot();
});

test('should handle text change', () => {
  const value = 'newText';
  wrapper.find('input').at(0).simulate('change', {
    target: {
      value
    }
  });
  expect(setTextFilter).toHaveBeenLastCalledWith(value);
});

test('should handle sort by date', () => {
  const value = 'date';
  wrapper.find('select').simulate('change', {
    target: {
      value
    }
  });
  expect(sortByDate).toHaveBeenCalled();
});

test('should handle sort by amount', () => {
  const value = 'amount';
  wrapper.find('select').simulate('change', {
    target: {
      value
    }
  });
  expect(sortByAmount).toHaveBeenCalled();
});

test('should handle date changes', () => {
  const startDate = moment(0);
  const endDate = moment(0).add(3,'days');
  wrapper.find('withStyles(DateRangePicker)').prop('onDatesChange')({
    startDate,
    endDate
  });
  expect(setStartDate).toHaveBeenLastCalledWith(startDate);
  expect(setEndDate).toHaveBeenLastCalledWith(endDate);
});

test('should handle date focus changes', () => {
  const calendarFocused = 'startDate';
  wrapper.find('withStyles(DateRangePicker)').prop('onFocusChange')(calendarFocused);
  expect(wrapper.state('calendarFocused')).toBe(calendarFocused);
});
