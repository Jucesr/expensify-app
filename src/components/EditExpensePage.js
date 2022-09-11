import React from 'react';
import {connect} from 'react-redux';
import ExpenseForm from './ExpenseForm';
import {editExpense, removeExpense} from '../actions/expenses';


export class EditExpensePage extends React.Component{

  onSubmit = (expense) => {
    this.props.editExpense(this.props.expense.id, expense);
    this.props.history.push('/');
  };

  onClick = () => {
    this.props.removeExpense(this.props.expense.id);
    this.props.history.push('/');
  };

  render(){
    const {dictionary} = this.props;
    return(
      <div>
        <div className="page-header">
          <div className="content-container">
            <h1 className="page-header__title">{dictionary.pageEditExpense}</h1>
          </div>
        </div>
        <div className="content-container">
          <ExpenseForm
            expense={this.props.expense}
            onSubmit={this.onSubmit}
            descriptionPlaceholder={dictionary.descriptionPlaceholder}
            amountPlaceholder={dictionary.amountPlaceholder}
            notePlaceholder={dictionary.notePlaceholder}
            saveExpenseButton={dictionary.saveExpenseButton}
            newExpenseButton={dictionary.newExpenseButton}
            expenseButton={dictionary.tableExpense}
            categories={dictionary.categories}
            extraCategories={this.props.categories}
            payment_methods={dictionary.payment_methods}
            cards={this.props.cards}
          />
          <button className="button button-gray" onClick={this.onClick}>{dictionary.removeExpenseButton}</button>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  expense: state.expenses.present.find((expense) => expense.id == props.match.params.id),
  dictionary: state.lang.dictionary,
  categories: state.categories,
  cards: state.cards,
});

const mapDispatchToProps = (dispatch) => ({
  editExpense: (id, expense)=> dispatch(editExpense(id, expense)),
  removeExpense: (id) => dispatch(removeExpense(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditExpensePage);
