import React from 'react';
import {connect} from 'react-redux';
import {
   setTextFilter,
   sortByDate,
   sortByAmount,
   setStartDate,
   setEndDate,
   setCategoryFilter,
   setSubCategoryFilter,
   setPaymentMethodFilter,
   setCardIdFilter,
} from '../actions/filters';
import {DateRangePicker} from 'react-dates';

import categories from '../config/categories';
import payment_methods from '../config/payment_methods';

export class ExpenseListFilters extends React.Component {
   state = {
      calendarFocused: null,
   };

   onDatesChange = ({startDate, endDate}) => {
      this.props.setStartDate(startDate);
      this.props.setEndDate(endDate);
   };

   onFocusChange = (calendarFocused) => {
      this.setState(() => ({calendarFocused}));
   };

   onSelectChange = (e) => {
      e.target.value == 'date'
         ? this.props.sortByDate()
         : this.props.sortByAmount();
   };
   onCategoryChange = (e) => {
      const v = e.target.value;
      this.props.setCategoryFilter(v);
   };
   onSubCategoryChange = (e) => {
      const v = e.target.value;
      this.props.setSubCategoryFilter(v);
   };
   onCardChange = (e) => {
      const v = e.target.value;
      this.props.setCardIdFilter(v);
   };
   onPaymentMethodChange = (e) => {
      const v = e.target.value;
      this.props.setPaymentMethodFilter(v);
   };

   onTextChange = (e) => {
      this.props.setTextFilter(e.target.value);
   };

   getSubCategories = (category) => {
      const {sub_categories} = this.props;
      const cats = sub_categories.filter((c) => c.parent_id === category);
      return cats ? cats : [];
   };

   render() {
      const {dictionary} = this.props;

      const sub_categories = this.props.filters.category
         ? this.getSubCategories(this.props.filters.category)
         : [];

      return (
         <div className="content-container">
            <div className="input-group">
               <div className="input-group__item">
                  <input
                     placeholder={dictionary.textFilter}
                     className="text-input"
                     type="text"
                     value={this.props.filters.text}
                     onChange={this.onTextChange}
                  />
               </div>
               <div className="input-group__item">
                  <select
                     className="select"
                     value={this.props.filters.sortBy}
                     onChange={this.onSelectChange}
                  >
                     <option value="date">{dictionary.sortByDate}</option>
                     <option value="amount">{dictionary.sortByAmount}</option>
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
                  <select
                     className="select"
                     value={this.props.filters.category}
                     onChange={this.onCategoryChange}
                  >
                     <option value="disabled">
                        {dictionary.filterByCategoryPlaceholder}
                     </option>
                     {categories.map((pm) => (
                        <option value={pm} key={pm}>
                           {dictionary.categories[pm]}
                        </option>
                     ))}
                  </select>
                  {this.props.filters.category != 'disabled' && (
                     <select
                        className="select"
                        value={this.props.filters.sub_category}
                        onChange={this.onSubCategoryChange}
                     >
                        <option value="disabled">
                           {dictionary.filterByCategoryPlaceholder}
                        </option>
                        {sub_categories.map((pm) => (
                           <option value={pm.code} key={pm.code}>
                              {pm.spanishDescription}
                           </option>
                        ))}
                     </select>
                  )}
               </div>
               <div className="input-group__item input-group__fluid">
                  <select
                     className="select"
                     value={this.props.filters.payment_method}
                     onChange={this.onPaymentMethodChange}
                  >
                     <option value="disabled">
                        {dictionary.filterByPaymentMethodPlaceholder}
                     </option>
                     {payment_methods.map((pm) => (
                        <option value={pm} key={pm}>
                           {dictionary.payment_methods[pm]}
                        </option>
                     ))}
                  </select>
                  {this.props.filters.payment_method != 'disabled' && (
                     <select
                        className="select"
                        value={this.props.filters.card_id}
                        onChange={this.onCardChange}
                     >
                        <option value="disabled">
                           Filtrar por tarjeta de crédito
                        </option>
                        {this.props.cards.map((card) => (
                           <option value={card.id} key={card.id}>
                              {card.name} - {card.number}
                           </option>
                        ))}
                     </select>
                  )}
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
   setSubCategoryFilter: (endDate) => dispatch(setSubCategoryFilter(endDate)),
   setCardIdFilter: (endDate) => dispatch(setCardIdFilter(endDate)),
   setPaymentMethodFilter: (endDate) =>
      dispatch(setPaymentMethodFilter(endDate)),
});

const mapStateToProps = (state) => ({
   filters: state.filters,
   dictionary: state.lang.dictionary,
   sub_categories: state.categories,
   cards: state.cards,
});

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseListFilters);
