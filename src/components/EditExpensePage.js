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
    return(
      <div>
        <div className="page-header">
          <div className="content-container">
            <h1 className="page-header__title">Edit Expense</h1>
          </div>
        </div>
        <div className="content-container">
          <ExpenseForm
            expense={this.props.expense}
            onSubmit={this.onSubmit}
          />
          <button className="button button-gray" onClick={this.onClick}>Remove Expense</button>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  expense: state.expenses.present.find((expense) => expense.id == props.match.params.id)
});

const mapDispatchToProps = (dispatch) => ({
  editExpense: (id, expense)=> dispatch(editExpense(id, expense)),
  removeExpense: (id) => dispatch(removeExpense(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditExpensePage);
