import React, { useState } from 'react';
import { connect } from 'react-redux';
import { DateRangePicker } from 'react-dates';

import categories from "../../config/categories_income";
import payment_methods from "../../config/payment_methods";

const ListFilters = (props) => {

  const { dictionary, filters, dispatch } = props;
  const [calendarFocused, setCalendarFocused] = useState(null);

  const { 
    startDate, 
    endDate,
    text,
    sortBy,
    category,
    paymentMethod
  } = filters;


  const onDatesChange = ({ startDate, endDate }) => {
    dispatch({
      type: 'SET_DATES',
      payload: {
        startDate,
        endDate,
      }
    })
  };

  const onFocusChange = (calendarFocused) => {
    setCalendarFocused(calendarFocused);
  };

  const onSelectChange = (e) => {
    dispatch({
      type: 'SET_SORT_BY',
      payload: e.target.value,
    })
  }
  const onCategoryChange = (e) => {
    const v = e.target.value;
    dispatch({
      type: 'SET_CATEGORY',
      payload: v,
    })
  }
  const onPaymentMethodChange = (e) => {
    const v = e.target.value;
    dispatch({
      type: 'SET_PAYMENT_METHOD',
      payload: v,
    })
  }

  const onTextChange = (e) => {
    const v = e.target.value;
    dispatch({
      type: 'SET_TEXT',
      payload: v,
    })
  }

  return (
    <div className="content-container">
      <div className="input-group">
        <div className="input-group__item">
          <input placeholder={dictionary.textFilter} className="text-input" type="text" value={text} onChange={onTextChange} />
        </div>
        <div className="input-group__item">
          <select className="select" value={sortBy} onChange={onSelectChange}>
            <option value="date" >{dictionary.sortByDate}</option>
            <option value="amount" >{dictionary.sortByAmount}</option>
          </select>
        </div>
        <div className="input-group__item">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onDatesChange={onDatesChange}
            focusedInput={calendarFocused}
            onFocusChange={onFocusChange}
            numberOfMonths={1}
            isOutsideRange={() => false}
            showClearDates={true}
            startDatePlaceholderText={dictionary.startDatePicker}
            endDatePlaceholderText={dictionary.endDatePicker}
          />
        </div>
      </div>

      <div className="input-group">
        <div className="input-group__item input-group__fluid ">
          <select className="select" value={category} onChange={onCategoryChange}>
            <option value="disabled" >{dictionary.filterByCategoryPlaceholder}</option>
            {categories.map(pm => <option value={pm} key={pm}>
              {dictionary.categories_income[pm]}
            </option>)}
          </select>
        </div>
        <div className="input-group__item input-group__fluid">
          <select className="select" value={paymentMethod} onChange={onPaymentMethodChange}>
            <option value="disabled" >{dictionary.filterByPaymentMethodPlaceholder}</option>
            {payment_methods.map(pm => <option value={pm} key={pm}>
              {dictionary.payment_methods[pm]}
            </option>)}
          </select>
        </div>
      </div>
    </div>
  )
}

ListFilters.propTypes = {

}

export default ListFilters