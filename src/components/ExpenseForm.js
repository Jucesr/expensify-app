import React from 'react';
import moment from 'moment';
import {SingleDatePicker} from 'react-dates';

export default class ExpenseForm extends React.Component {
   /*
    Props

    expense = (Optional)
    onSubmit = (Require)
  */

   constructor(props) {
      super(props);

      const defaultCategory = Object.keys(props.categories)[0];
      this.state = {
         payment_method: props.expense
            ? props.expense.payment_method
               ? props.expense.payment_method
               : 'cash'
            : 'cash',
         card_id: props.expense
            ? props.expense.card_id
               ? props.expense.card_id
               : ''
            : '',
         category: props.expense
            ? props.expense.category
               ? props.expense.category
               : defaultCategory
            : defaultCategory,
         sub_category: props.expense
            ? props.expense.sub_category
               ? props.expense.sub_category
               : ''
            : '',
         description: props.expense ? props.expense.description : '',
         note: props.expense ? props.expense.note : '',
         amount: props.expense ? (props.expense.amount / 100).toString() : '',
         createdAt: props.expense ? moment(props.expense.createdAt) : moment(),
         calendarFocused: false,
         error: '',
         editMode: props.expense ? true : false,
      };
   }

   onDescriptionChange = (e) => {
      const description = e.target.value;
      this.setState(() => ({description}));
   };
   onNoteChange = (e) => {
      const note = e.target.value;
      this.setState(() => ({note}));
   };
   onAmountChange = (e) => {
      const amount = e.target.value;

      if (amount.match(/^\d*(\.\d{0,2})?$/)) {
         this.setState(() => ({amount}));
      }
   };
   onDateChange = (createdAt) => {
      if (createdAt) {
         this.setState(() => ({createdAt}));
      }
   };
   onFocusChange = ({focused}) => {
      this.setState(() => ({calendarFocused: focused}));
   };

   onSelectChange = (e) => {
      const v = e.target.value;

      this.setState(() => ({category: v}));
   };
   onCategoryChange = (e) => {
      const v = e.target.value;

      this.setState(() => ({sub_category: v}));
   };

   onPaymentMethodChange = (e) => {
      const v = e.target.value;

      this.setState(() => ({payment_method: v}));
   };

   onCardIdChange = (e) => {
      const v = e.target.value;

      this.setState(() => ({card_id: v}));
   };

   onSubmit = (e) => {
      e.preventDefault();

      if (!this.state.description || !this.state.amount) {
         //Set error: Please provide description and amount
         this.setState(() => ({
            error: 'Please provide description and amount',
         }));
      } else {
         //Clear error
         this.setState(() => ({error: ''}));
         this.props.onSubmit({
            payment_method: this.state.payment_method,
            category: this.state.category,
            sub_category: this.state.sub_category,
            description: this.state.description,
            amount: parseFloat(this.state.amount, 10) * 100,
            createdAt: this.state.createdAt.valueOf(),
            note: this.state.note,
            card_id: this.state.card_id,
         });
      }
   };

   getSubCategories = (category) => {
      const {extraCategories} = this.props;
      const cats = extraCategories.filter((c) => c.parent_id === category);
      return cats ? cats : [];
   };

   render() {
      const {categories, payment_methods, cards = []} = this.props;
      const {category} = this.state;

      const sub_categories = category ? this.getSubCategories(category) : [];

      return (
         <form className="form" onSubmit={this.onSubmit}>
            {this.state.error.length > 0 && (
               <p className="form__error">{this.state.error}</p>
            )}

            <select
               className="text-input"
               value={this.state.payment_method}
               onChange={this.onPaymentMethodChange}
            >
               <option value="cash">{payment_methods.cash}</option>
               <option value="credit_card">
                  {payment_methods.credit_card}
               </option>
               <option value="debit_card">{payment_methods.debit_card}</option>
               <option value="vouchers">{payment_methods.vouchers}</option>
               <option value="other">{payment_methods.other}</option>
            </select>

            {this.state.payment_method === 'credit_card' && (
               <select
                  className="text-input"
                  value={this.state.card_id}
                  onChange={this.onCardIdChange}
               >
                  <option value=''>Selecciona una tarjeta</option>
                  {cards.map((card) => (
                     <option key={card.id} value={card.id}>
                        {`${card.name} (${card.number})`}
                     </option>
                  ))}
               </select>
            )}

            <select
               className="text-input"
               value={this.state.category}
               onChange={this.onSelectChange}
            >
               {Object.keys(categories).map((key) => {
                  return (
                     <option key={key} value={key}>
                        {categories[key]}
                     </option>
                  );
               })}
            </select>

            <select
               className="text-input"
               value={this.state.sub_category}
               onChange={this.onCategoryChange}
            >
               <option value="">Sin subcategoria</option>
               {sub_categories.map((opt) => (
                  <option value={opt.code} key={opt.code}>
                     {opt.spanishDescription}
                  </option>
               ))}
            </select>

            <input
               className="text-input"
               type="text"
               placeholder={this.props.descriptionPlaceholder}
               autoFocus
               value={this.state.description}
               onChange={this.onDescriptionChange}
            />
            <input
               className="text-input"
               type="text"
               placeholder={this.props.amountPlaceholder}
               value={this.state.amount}
               onChange={this.onAmountChange}
            />
            <SingleDatePicker
               date={this.state.createdAt}
               onDateChange={this.onDateChange}
               focused={this.state.calendarFocused}
               onFocusChange={this.onFocusChange}
               numberOfMonths={1}
               isOutsideRange={() => false}
            />
            <textarea
               className="textarea"
               placeholder={this.props.notePlaceholder}
               value={this.state.note}
               onChange={this.onNoteChange}
            ></textarea>
            <div>
               <button className="button">
                  {this.state.editMode
                     ? `${this.props.saveExpenseButton} `
                     : `${this.props.newExpenseButton} `}
               </button>
            </div>
         </form>
      );
   }
}
