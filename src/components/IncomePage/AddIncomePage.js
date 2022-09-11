import React from 'react';
import ExpenseForm from '../ExpenseForm';
import { connect } from 'react-redux';
import { addIncome } from '../../actions/incomes';

export class AddIncomePage extends React.Component {
  onSubmit = (income) => {
    this.props.addIncome(income);
    this.props.history.push('/income');
  };

  render() {
    const { dictionary } = this.props;
    return (
      <div>
        <div className="page-header">
          <div className="content-container">
            <h1 className="page-header__title">{dictionary.incomePage.pageAddIncomeTitle}</h1>
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
            categories={dictionary.categories_income}
            payment_methods={dictionary.payment_methods}
            extraCategories={[]}
            cards={[]}
          />
        </div>
      </div>
    );
  };
}

const mapDispatchToProps = (dispatch) => ({
  addIncome: (income) => dispatch(addIncome(income))
});

const mapStateToProps = (state) => ({
  dictionary: state.lang.dictionary
});

export default connect(mapStateToProps, mapDispatchToProps)(AddIncomePage);
