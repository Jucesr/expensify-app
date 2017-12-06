import React from 'react';
import ExpenseForm from './ExpenseForm';
import {connect} from 'react-redux';
import {addExpense} from '../actions/expenses';

export class AddExpensePage extends React.Component {
  onSubmit = (expense) => {
    this.props.addExpense(expense);
    this.props.history.push('/');
  };

  render(){
    const {dictionary} = this.props;
    return (
      <div>
        <div className="page-header">
          <div className="content-container">
            <h1 className="page-header__title">{dictionary.pageAddExpense}</h1>
          </div>
        </div>
          <div className="content-container">
            <ExpenseForm
              onSubmit={this.onSubmit}
              descriptionPlaceholder={dictionary.descriptionPlaceholder}
              amountPlaceholder={dictionary.amountPlaceholder}
              notePlaceholder={dictionary.notePlaceholder}
              saveExpenseButton={dictionary.saveExpenseButton}
              newExpenseButton={dictionary.newExpenseButton}
              expenseButton={dictionary.tableExpense}
            />
          </div>
      </div>
    );
  };
}

const mapDispatchToProps = (dispatch) => ({
    addExpense: (expense) => dispatch(addExpense(expense))
});

const mapStateToProps = (state) => ({
  dictionary: state.lang.dictionary
});

export default connect(mapStateToProps, mapDispatchToProps)(AddExpensePage);
