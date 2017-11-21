import {
  setTextFilter,
  sortByDate,
  sortByAmount,
  setStartDate,
  setEndDate
} from '../../actions/filters'
import moment from 'moment';

test('should setup SET_START_DATE action object', () => {
  const action = setStartDate(moment(0));

  expect(action).toEqual({
    type: 'SET_START_DATE',
    startDate: moment(0)
  })
});

test('should setup SET_END_DATE action object', () => {
  const action = setEndDate(moment(0));

  expect(action).toEqual({
    type: 'SET_END_DATE',
    endDate: moment(0)
  })
});

test('should setup SET_TEXT_FILTER action object with provided data', () => {
  const action = setTextFilter('some filter');

  expect(action).toEqual({
    type: 'SET_TEXT_FILTER',
    text: 'some filter'
  });
});

test('should setup SET_TEXT_FILTER action object with default data', () => {
  const action = setTextFilter();

  expect(action).toEqual({
    type: 'SET_TEXT_FILTER',
    text: ''
  });
});

test('should setup SORT_BY_DATE action object', () => {
  const action = sortByDate();

  expect(action).toEqual({
    type: 'SORT_BY_DATE'
  });
});

test('should setup SORT_BY_AMOUNT action object', () => {
  const action = sortByAmount();

  expect(action).toEqual({
    type: 'SORT_BY_AMOUNT'
  });
});
