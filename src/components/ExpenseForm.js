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
      const createdAt = props.expense ? moment(props.expense.createdAt) : moment();
      const editMode = props.expense ? true : false;
      
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
         createdAt,
         dateString: createdAt.format('DD/MM/YYYY'),
         calendarFocused: false,
         error: '',
         editMode,
         // Multi-expense mode
         multiMode: false,
         expenseItems: [this.createNewExpenseItem()],
         activeCalendarIndex: null,
      };
   }

   createNewExpenseItem = () => {
      const now = moment();
      return {
         id: Date.now() + Math.random(),
         description: '',
         amount: '',
         note: '',
         createdAt: now,
         dateString: now.format('DD/MM/YYYY'),
      };
   };

   // Toggle multi-mode
   toggleMultiMode = () => {
      this.setState((prevState) => ({
         multiMode: !prevState.multiMode,
         expenseItems: [this.createNewExpenseItem()],
         error: '',
      }));
   };

   // Add new expense item in multi-mode
   addExpenseItem = () => {
      this.setState((prevState) => ({
         expenseItems: [...prevState.expenseItems, this.createNewExpenseItem()],
      }));
   };

   // Remove expense item in multi-mode
   removeExpenseItem = (id) => {
      this.setState((prevState) => ({
         expenseItems: prevState.expenseItems.filter((item) => item.id !== id),
      }));
   };

   // Update expense item field in multi-mode
   updateExpenseItem = (id, field, value) => {
      this.setState((prevState) => ({
         expenseItems: prevState.expenseItems.map((item) =>
            item.id === id ? {...item, [field]: value} : item
         ),
      }));
   };

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
         this.setState(() => ({
            createdAt,
            dateString: createdAt.format('DD/MM/YYYY'),
         }));
      }
   };
   onDateStringChange = (e) => {
      let value = e.target.value;
      
      // Remove any non-numeric characters except slashes
      value = value.replace(/[^\d]/g, '');
      
      // Auto-insert slashes at appropriate positions
      if (value.length > 4) {
         value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
      } else if (value.length > 2) {
         value = value.slice(0, 2) + '/' + value.slice(2);
      }
      
      // Limit to DD/MM/YYYY format (10 chars max)
      if (value.length <= 10) {
         this.setState(() => ({dateString: value}));
         
         // Try to parse the date string when complete
         if (value.length === 10) {
            const parsedDate = moment(value, 'DD/MM/YYYY', true);
            if (parsedDate.isValid()) {
               this.setState(() => ({createdAt: parsedDate}));
            }
         }
      }
   };
   onFocusChange = ({focused}) => {
      this.setState(() => ({calendarFocused: focused}));
   };
   openCalendar = () => {
      this.setState(() => ({calendarFocused: true}));
   };

   // Multi-mode handlers
   onItemDescriptionChange = (id, e) => {
      this.updateExpenseItem(id, 'description', e.target.value);
   };

   onItemAmountChange = (id, e) => {
      const amount = e.target.value;
      if (amount.match(/^\d*(\.\d{0,2})?$/)) {
         this.updateExpenseItem(id, 'amount', amount);
      }
   };

   onItemNoteChange = (id, e) => {
      this.updateExpenseItem(id, 'note', e.target.value);
   };

   onItemDateChange = (id, createdAt) => {
      if (createdAt) {
         this.setState((prevState) => ({
            expenseItems: prevState.expenseItems.map((item) =>
               item.id === id
                  ? {...item, createdAt, dateString: createdAt.format('DD/MM/YYYY')}
                  : item
            ),
         }));
      }
   };

   onItemDateStringChange = (id, e) => {
      let value = e.target.value;
      value = value.replace(/[^\d]/g, '');
      
      if (value.length > 4) {
         value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
      } else if (value.length > 2) {
         value = value.slice(0, 2) + '/' + value.slice(2);
      }
      
      if (value.length <= 10) {
         this.setState((prevState) => {
            const newItems = prevState.expenseItems.map((item) => {
               if (item.id !== id) return item;
               const updates = {dateString: value};
               if (value.length === 10) {
                  const parsedDate = moment(value, 'DD/MM/YYYY', true);
                  if (parsedDate.isValid()) {
                     updates.createdAt = parsedDate;
                  }
               }
               return {...item, ...updates};
            });
            return {expenseItems: newItems};
         });
      }
   };

   onItemFocusChange = (id, {focused}) => {
      this.setState(() => ({
         activeCalendarIndex: focused ? id : null,
      }));
   };

   openItemCalendar = (id) => {
      this.setState(() => ({activeCalendarIndex: id}));
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

      const {multiMode, expenseItems} = this.state;

      if (multiMode) {
         // Validate all expense items
         const invalidItems = expenseItems.filter(
            (item) => !item.description || !item.amount
         );
         
         if (invalidItems.length > 0) {
            this.setState(() => ({
               error: 'Please provide description and amount for all items',
            }));
            return;
         }

         // Clear error and submit all expenses
         this.setState(() => ({error: ''}));
         
         const expenses = expenseItems.map((item) => ({
            payment_method: this.state.payment_method,
            category: this.state.category,
            sub_category: this.state.sub_category,
            description: item.description,
            amount: parseFloat(item.amount, 10) * 100,
            createdAt: item.createdAt.valueOf(),
            note: item.note,
            card_id: this.state.card_id,
         }));

         // Submit each expense
         expenses.forEach((expense) => {
            this.props.onSubmit(expense);
         });

         // Reset expense items after submission
         this.setState(() => ({
            expenseItems: [this.createNewExpenseItem()],
         }));
      } else {
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
      }
   };

   getSubCategories = (category) => {
      const {extraCategories} = this.props;
      const cats = extraCategories.filter((c) => c.parent_id === category);
      return cats ? cats : [];
   };

   renderSingleExpenseFields() {
      return (
         <React.Fragment>
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
            <div className="date-picker-container">
               <input
                  className="text-input"
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={this.state.dateString}
                  onChange={this.onDateStringChange}
               />
               <button
                  type="button"
                  className="button button--calendar"
                  onClick={this.openCalendar}
               >
                  📅
               </button>
               <div className="date-picker-calendar-wrapper">
                  <SingleDatePicker
                     date={this.state.createdAt}
                     onDateChange={this.onDateChange}
                     focused={this.state.calendarFocused}
                     onFocusChange={this.onFocusChange}
                     numberOfMonths={1}
                     isOutsideRange={() => false}
                     id="expense-date-picker"
                  />
               </div>
            </div>
            <textarea
               className="textarea"
               placeholder={this.props.notePlaceholder}
               value={this.state.note}
               onChange={this.onNoteChange}
            ></textarea>
         </React.Fragment>
      );
   }

   renderMultiExpenseFields() {
      const {expenseItems, activeCalendarIndex} = this.state;

      return (
         <div className="multi-expense-container">
            <div className="expense-rows-header">
               <span>#</span>
               <span>Descripción</span>
               <span>Monto</span>
               <span>Fecha</span>
               <span>Nota</span>
               <span></span>
            </div>
            {expenseItems.map((item, index) => (
               <div key={item.id} className="expense-item-group">
                  <span className="expense-item-number">{index + 1}</span>
                  <input
                     className="text-input"
                     type="text"
                     placeholder={this.props.descriptionPlaceholder}
                     value={item.description}
                     onChange={(e) => this.onItemDescriptionChange(item.id, e)}
                  />
                  <input
                     className="text-input"
                     type="text"
                     placeholder={this.props.amountPlaceholder}
                     value={item.amount}
                     onChange={(e) => this.onItemAmountChange(item.id, e)}
                  />
                  <div className="date-picker-container">
                     <input
                        className="text-input"
                        type="text"
                        placeholder="DD/MM/YYYY"
                        value={item.dateString}
                        onChange={(e) => this.onItemDateStringChange(item.id, e)}
                     />
                     <button
                        type="button"
                        className="button button--calendar"
                        onClick={() => this.openItemCalendar(item.id)}
                     >
                        📅
                     </button>
                     <div className="date-picker-calendar-wrapper">
                        <SingleDatePicker
                           date={item.createdAt}
                           onDateChange={(date) => this.onItemDateChange(item.id, date)}
                           focused={activeCalendarIndex === item.id}
                           onFocusChange={(obj) => this.onItemFocusChange(item.id, obj)}
                           numberOfMonths={1}
                           isOutsideRange={() => false}
                           id={`expense-date-picker-${item.id}`}
                        />
                     </div>
                  </div>
                  <textarea
                     className="textarea"
                     placeholder={this.props.notePlaceholder}
                     value={item.note}
                     onChange={(e) => this.onItemNoteChange(item.id, e)}
                  ></textarea>
                  <button
                     type="button"
                     className="button button--remove"
                     onClick={() => this.removeExpenseItem(item.id)}
                     disabled={expenseItems.length <= 1}
                  >
                     ✕
                  </button>
               </div>
            ))}
            <button
               type="button"
               className="button button--add-item"
               onClick={this.addExpenseItem}
            >
               + Agregar otro gasto
            </button>
         </div>
      );
   }

   render() {
      const {categories, payment_methods, cards = []} = this.props;
      const {category, multiMode, editMode, expenseItems} = this.state;

      const sub_categories = category ? this.getSubCategories(category) : [];

      return (
         <form className="form" onSubmit={this.onSubmit}>
            {this.state.error.length > 0 && (
               <p className="form__error">{this.state.error}</p>
            )}

            {/* Multi-mode toggle - only show in add mode, not edit mode */}
            {!editMode && (
               <div className="multi-mode-toggle">
                  <label className="toggle-label">
                     <input
                        type="checkbox"
                        checked={multiMode}
                        onChange={this.toggleMultiMode}
                     />
                     <span className="toggle-text">
                        Agregar múltiples gastos
                     </span>
                  </label>
               </div>
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

            {multiMode ? this.renderMultiExpenseFields() : this.renderSingleExpenseFields()}

            <div>
               <button className="button">
                  {editMode
                     ? `${this.props.saveExpenseButton} `
                     : multiMode
                        ? `Agregar ${expenseItems.length} gasto${expenseItems.length > 1 ? 's' : ''}`
                        : `${this.props.newExpenseButton} `}
               </button>
            </div>
         </form>
      );
   }
}
