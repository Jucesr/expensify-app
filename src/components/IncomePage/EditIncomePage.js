import React from 'react';
import {connect} from 'react-redux';
import ExpenseForm from '../ExpenseForm';
import {editIncome, removeIncome} from '../../actions/incomes';


export class EditExpensePage extends React.Component{

  onSubmit = (income) => {
    this.props.editIncome(this.props.income.id, income);
    this.props.history.push('/income');
  };

  onClick = () => {
    this.props.removeIncome(this.props.income.id);
    this.props.history.push('/income');
  };

  render(){
    const {dictionary} = this.props;
    return(
      <div>
        <div className="page-header">
          <div className="content-container">
            <h1 className="page-header__title">{dictionary.incomePage.pageEditIncomeTitle}</h1>
          </div>
        </div>
        <div className="content-container">
          <ExpenseForm
            expense={this.props.income}
            onSubmit={this.onSubmit}
            descriptionPlaceholder={dictionary.descriptionPlaceholder}
            amountPlaceholder={dictionary.amountPlaceholder}
            notePlaceholder={dictionary.notePlaceholder}
            saveExpenseButton={dictionary.saveExpenseButton}
            newExpenseButton={dictionary.newExpenseButton}
            expenseButton={dictionary.tableExpense}
            categories={dictionary.categories_income}
            payment_methods={dictionary.payment_methods}
          />
          <button className="button button-gray" onClick={this.onClick}>{dictionary.removeExpenseButton}</button>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  income: state.incomes.find((income) => income.id == props.match.params.id),
  dictionary: state.lang.dictionary
});

const mapDispatchToProps = (dispatch) => ({
  editIncome: (id, expense)=> dispatch(editIncome(id, expense)),
  removeIncome: (id) => dispatch(removeIncome(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditExpensePage);
