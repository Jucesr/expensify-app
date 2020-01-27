import React from 'react';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';

export default class ExpenseForm extends React.Component {

  /*
    Props

    expense = (Optional)
    onSubmit = (Require)
  */

  constructor(props) {
    super(props);
    this.state = {
      payment_method: props.expense ? (props.expense.payment_method ? props.expense.payment_method : 'cash' ) : 'cash',
      category: props.expense ? (props.expense.category ? props.expense.category : 'food' ) : 'food',
      description: props.expense ? props.expense.description : '',
      note: props.expense ? props.expense.note : '',
      amount: props.expense ? (props.expense.amount / 100 ).toString(): '',
      createdAt: props.expense ? moment(props.expense.createdAt) : moment(),
      calendarFocused: false,
      error: '',
      editMode: props.expense ? true : false
    }
  };

  onDescriptionChange = (e) => {
    const description = e.target.value;
    this.setState(() => ({ description }));
  };
  onNoteChange = (e) => {
    const note = e.target.value;
    this.setState(() => ({ note }));
  };
  onAmountChange = (e) => {
    const amount = e.target.value;

    if (amount.match(/^\d*(\.\d{0,2})?$/)) {
      this.setState(() => ({ amount }));
    }
  };
  onDateChange = (createdAt) => {
    if(createdAt){
      this.setState(() => ({ createdAt }));
    }
  }
  onFocusChange = ({ focused }) => {
    this.setState(() => ({ calendarFocused: focused }));
  };

  onSelectChange = (e) =>{

    const v = e.target.value
    
    this.setState(() => ({ category: v }));
  }

  onPaymentMethodChange = (e) =>{

    const v = e.target.value
    
    this.setState(() => ({ payment_method: v }));
  }

  onSubmit = (e) => {
    e.preventDefault();

    if(!this.state.description || !this.state.amount){
      //Set error: Please provide description and amount
      this.setState( () => ({error: 'Please provide description and amount'}));
    }else {
      //Clear error
      this.setState( () => ({error:''}));
      this.props.onSubmit({
        payment_method: this.state.payment_method,
        category: this.state.category,
        description: this.state.description,
        amount: parseFloat(this.state.amount, 10) * 100,
        createdAt: this.state.createdAt.valueOf(),
        note: this.state.note
      });
    }
  }
  render() {
    const {categories, payment_methods} = this.props;
    return (
        <form className="form" onSubmit={this.onSubmit}>
          {this.state.error.length > 0 && <p className="form__error">{this.state.error}</p>  }

          <select className="text-input" value={this.state.payment_method} onChange={ this.onPaymentMethodChange }>
            <option value="cash" >{payment_methods.cash}</option>
            <option value="credit_card" >{payment_methods.credit_card}</option>
            <option value="debit_card" >{payment_methods.debit_card}</option>
            <option value="vouchers" >{payment_methods.vouchers}</option>
            <option value="other" >{payment_methods.other}</option>
          </select>

          <select className="text-input" value={this.state.category} onChange={ this.onSelectChange }>
            <option value="food" >{categories.food}</option>
            <option value="bills" >{categories.bills}</option>
            <option value="housing" >{categories.housing}</option>
            <option value="clothing" >{categories.clothing}</option>
            <option value="health" >{categories.health}</option>
            <option value="leisure" >{categories.leisure}</option>
            <option value="transport" >{categories.transport}</option>
            <option value="other" >{categories.other}</option>
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
          >
          </textarea>
          <div>
            <button className="button">{this.state.editMode ? `${this.props.saveExpenseButton} ` : `${this.props.newExpenseButton} `} {this.props.expenseButton}</button>
          </div>
        </form>
    )
  }
}
