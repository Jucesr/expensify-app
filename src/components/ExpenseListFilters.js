import React from 'react';
import { connect } from 'react-redux';
import { setTextFilter, sortByDate, sortByAmount, setStartDate, setEndDate, setCategoryFilter, setPaymentMethodFilter } from '../actions/filters';
import { DateRangePicker } from 'react-dates';

import categories from "../config/categories";
import payment_methods from "../config/payment_methods";


export class ExpenseListFilters extends React.Component {
  state = {
    calendarFocused: null
  }

  onDatesChange = ({ startDate, endDate }) => {
    this.props.setStartDate(startDate);
    this.props.setEndDate(endDate);
  };

  onFocusChange = (calendarFocused) => {
    this.setState(() => ({ calendarFocused }));
  };

  onSelectChange = (e) => {
    e.target.value == 'date' ? this.props.sortByDate() : this.props.sortByAmount();
  }
  onCategoryChange = (e) => {
    const v = e.target.value;
    this.props.setCategoryFilter(v);
  }
  onPaymentMethodChange = (e) => {
    const v = e.target.value;
    this.props.setPaymentMethodFilter(v);
  }

  onTextChange = (e) => {
    this.props.setTextFilter(e.target.value);
  }

  render() {
    const { dictionary } = this.props;
    return (
      <div className="content-container">
        <div className="input-group">
          <div className="input-group__item">
            <input placeholder={dictionary.textFilter} className="text-input" type="text" value={this.props.filters.text} onChange={this.onTextChange} />
          </div>
          <div className="input-group__item">
            <select className="select" value={this.props.filters.sortBy} onChange={this.onSelectChange}>
              <option value="date" >{dictionary.sortByDate}</option>
              <option value="amount" >{dictionary.sortByAmount}</option>
            </select>
          </div>
          <div className="input-group__item">
            <DateRangePicker
              startDate={this.props.filters.startDate}
              endDate={this.props.filters.endDate}
              onDatesChange={this.onDatesChange}
              focusedInput={this.state.calendarFocused}
              onFocusChange={this.onFocusChange}
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
            <select className="select" value={this.props.filters.category} onChange={this.onCategoryChange}>
              <option value="disabled" >{dictionary.filterByCategoryPlaceholder}</option>
              {categories.map(pm => <option value={pm} key={pm}>
                {dictionary.categories[pm]}
              </option>)}
            </select>
          </div>
          <div className="input-group__item input-group__fluid">
            <select className="select" value={this.props.filters.payment_method} onChange={this.onPaymentMethodChange}>
              <option value="disabled" >{dictionary.filterByPaymentMethodPlaceholder}</option>
              {payment_methods.map(pm => <option value={pm} key={pm}>
                {dictionary.payment_methods[pm]}
              </option>)}
            </select>
          </div>
        </div>
      </div>
    );
  }

}

const mapDispatchToProps = (dispatch) => ({
  setTextFilter: (text) => dispatch(setTextFilter(text)),
  sortByDate: () => dispatch(sortByDate()),
  sortByAmount: () => dispatch(sortByAmount()),
  setStartDate: (startDate) => dispatch(setStartDate(startDate)),
  setEndDate: (endDate) => dispatch(setEndDate(endDate)),
  setCategoryFilter: (endDate) => dispatch(setCategoryFilter(endDate)),
  setPaymentMethodFilter: (endDate) => dispatch(setPaymentMethodFilter(endDate)),
})


const mapStateToProps = (state) => ({
  filters: state.filters,
  dictionary: state.lang.dictionary
});

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseListFilters);
