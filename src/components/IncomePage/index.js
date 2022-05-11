import React, { useState, useReducer, useMemo } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import IncomeListItem from './IncomeListItem';
import getExpensesTotal from '../../selectors/expenses-total';
import getIncomes from '../../selectors/expenses';

import ListFilters from "./ListFilters";
import Sumary from "./Sumary";

const numberOfItemsToShow = 2;

const initialState = {
  startDate: moment().startOf('month'),
  endDate: moment().endOf('month'),
  paymentMethod: 'disabled',
  category: 'disabled',
  text: '',
  sortBy: 'date',
}

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_TEXT':
      return { ...state, text: payload };
    case 'SET_DATES':
      return { ...state, startDate: payload.startDate, endDate: payload.endDate };
    case 'SET_SORT_BY':
      return { ...state, sortBy: payload };
    case 'SET_CATEGORY':
      return { ...state, category: payload };
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: payload };
    default:
      throw new Error();
  }
}

const initialIncome = []

export const IncomePage = ({ incomes = initialIncome, dictionary, locale, ...props }) => {

  const [offset, setOffset] = useState(numberOfItemsToShow);

  const [stateFilter, dispatch] = useReducer(reducer, initialState);

 
  const incomesToShow = useMemo(() => {
    const { startDate, endDate, text, sortBy, category, paymentMethod } = stateFilter;

    const _incomes = getIncomes(incomes, {
      startDate,
      endDate,
      text,
      sortBy,
      category,
      payment_method: paymentMethod,
    });

    return _incomes.slice(0, offset);
  }, [incomes, stateFilter, offset]);

  const shouldRenderLoadMoreButton = incomes.length > offset;

  //   useEffect(() => {
  //     props.setStartDate(moment().startOf('month'))
  //     props.setEndDate(moment().endOf('month'))
  //  },[])

  return (
    <React.Fragment>
      <Sumary
        expenseCount={incomesToShow.length}
        expensesTotal={getExpensesTotal(incomesToShow)}
        dictionary={dictionary}
      />
      <ListFilters filters={stateFilter} dispatch={dispatch} dictionary={dictionary} />

      <div className="content-container">
        <div className="list-header">
          <div >{dictionary.incomePage.tableIncomeText}</div>
          <div >{dictionary.incomePage.tableAmountText}</div>
        </div>
        <div className="list-body">
          {
            incomesToShow.length == 0 ? (
              <div className="list-item-message">
                <span>{dictionary.noExpenseMessage}</span>
              </div>
            ) : (
              incomesToShow.map((expense) => {
                return <IncomeListItem key={expense.id} dictonary={dictionary} {...expense} locale={locale} />
              })
            )
          }

          {shouldRenderLoadMoreButton && <button className="button" style={{ width: '100%', marginTop: '10px' }} onClick={() => setOffset(offset + numberOfItemsToShow)}>{dictionary.buttons.loadMore}</button>}
        </div>
      </div>
    </React.Fragment>

  )
};

const mapDispatchToProps = (dispatch) => ({
});

const mapStateToProps = (state) => {
  return {
    incomes: state.incomes,
    dictionary: state.lang.dictionary,
    locale: state.lang.locale,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IncomePage);
