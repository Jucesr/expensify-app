import React, {useMemo, useState, useReducer, useEffect} from 'react';
import {Button, Icon, Table, Modal} from 'semantic-ui-react';
import {connect} from 'react-redux';
import numeral from 'numeral';
import moment from 'moment';
import CTable from '../Table';

import {groupItemsByProperty, randomInt, addOrRemove} from '../../utils/index';
import getExpensesTotal from '../../selectors/expenses-total';

import payment_methods from '../../config/payment_methods';

// function to generate a rendom number of expenses
const generateIncomes = (numberOfElements, cats) => {
   const incomes = [];
   for (let i = 0; i < numberOfElements; i++) {
      incomes.push({
         id: i,
         description: `Ingreso ${i}`,
         amount: randomInt(10000, 100000),
         createdAt: moment().subtract(randomInt(0, 6), 'months').toDate(),
         category: cats[randomInt(0, cats.length - 1)],
         paymentMethod:
            payment_methods[randomInt(0, payment_methods.length - 1)],
      });
   }

   return incomes;
};
// const _incomes = generateIncomes(3, categories_income);
// const _expenses = generateIncomes(10000, categories_expense);

const groupItemsByCategory = (items, activeMonth, dictonary_categories) => {
   // Filter out incomes that are not in the active month
   const startRange = moment(activeMonth).startOf('month');
   const endRange = moment(activeMonth).endOf('month');
   const filteredIncomes = items.filter((income) => {
      const createdAtMoment = moment(income.createdAt);
      const startDateMatch = startRange.isSameOrBefore(createdAtMoment, 'day');
      const endDateMatch = endRange.isSameOrAfter(createdAtMoment, 'day');
      return startDateMatch && endDateMatch;
   });

   // Get incomes from previuos month to get % of increase/decrease
   const previuosMonth = moment(activeMonth).subtract(1, 'months');
   const _startRange = moment(previuosMonth).startOf('month');
   const _endRange = moment(previuosMonth).endOf('month');
   const previousIncomes = items.filter((income) => {
      const createdAtMoment = moment(income.createdAt);
      const _startDateMatch = _startRange.isSameOrBefore(
         createdAtMoment,
         'day',
      );
      const _endDateMatch = _endRange.isSameOrAfter(createdAtMoment, 'day');
      return _startDateMatch && _endDateMatch;
   });

   const groupedIncomes = groupItemsByProperty(filteredIncomes, 'category');
   const groupedPreviousIncomes = groupItemsByProperty(
      previousIncomes,
      'category',
   );

   const rows = Object.keys(dictonary_categories).map((key) => {
      const incomesByCategory = groupedIncomes[key] ? groupedIncomes[key] : [];
      return {
         id: key,
         key: key,
         category: dictonary_categories[key],
         total: getExpensesTotal(incomesByCategory),
         data: incomesByCategory,
      };
   });

   const rowsOfPrevIncomes = Object.keys(groupedPreviousIncomes).map((key) => {
      const incomesByCategory = groupedPreviousIncomes[key];
      return {
         category: dictonary_categories[key],
         total: getExpensesTotal(incomesByCategory),
      };
   });

   // Add the percentage of increase/decrease based on the previous month
   const _rows = rows.map((row) => {
      const prevRow = rowsOfPrevIncomes.find(
         (prevRow) => prevRow.category === row.category,
      );
      if (prevRow) {
         const increase = (row.total - prevRow.total) / prevRow.total;
         return {
            ...row,
            increase: increase,
            increase_percentage: numeral(increase).format('0.00%'),
         };
      }
      return {
         ...row,
         increase: 0,
         increase_percentage: numeral(0).format('0.00%'),
      };
   });

   // sort rows by category
   return _rows.sort((a, b) => {
      return a.category.localeCompare(b.category);
   });
};

const IncomeStatementReportPage = (props) => {
   const {expenses, incomes} = props;
   const {dictionary} = props;
   // const incomes = _incomes;
   // const expenses = _expenses

   const [activeMonth, setActiveMonth] = useState(moment());
   const [incomeFilters, setIncomeFilters] = useState(['travel']);
   const [expenseFilters, setExpenseFilters] = useState(['travel']);
   const [modalExpenses, setModalExpenses] = useState([]);

   const incomesRows = useMemo(() => {
      return groupItemsByCategory(
         incomes,
         activeMonth,
         dictionary.categories_income,
      );
   }, [incomes, activeMonth]);

   const expensesRows = useMemo(() => {
      return groupItemsByCategory(expenses, activeMonth, dictionary.categories);
   }, [expenses, activeMonth]);

   const lastSixMonths = Array(12)
      .fill()
      .map((_, i) => {
         return moment().subtract(i, 'months');
      });

   const netIncome = useMemo(() => {
      const _incomesRows = incomesRows.filter(
         (row) => !incomeFilters.includes(row.key),
      );
      const incomes = _incomesRows.reduce((acc, curr) => acc + curr.total, 0);

      const _expensesRows = expensesRows.filter(
         (row) => !expenseFilters.includes(row.key),
      );
      const expenses = _expensesRows.reduce((acc, curr) => acc + curr.total, 0);
      return incomes - expenses;
   }, [incomesRows, expensesRows, incomeFilters, expenseFilters]);

   return (
      <div>
         <div className="page-header">
            <div
               className="content-container"
               style={{display: 'flex', alignItems: 'center'}}
            >
               <Button
                  basic
                  circular
                  icon="arrow left"
                  onClick={() => {
                     props.history.push('/income');
                  }}
               />
               <h1 className="page-header__title">
                  {dictionary.incomeStatementPage.title}
               </h1>
            </div>
         </div>
         <div className="content-container" style={{marginBottom: '1rem'}}>
            {/* render an array of buttons that represents the last six months of the year */}

            <div style={{display: 'flex'}}>
               <React.Fragment>
                  {lastSixMonths.reverse().map((month) => {
                     return (
                        <Button
                           key={month.format('MMMM')}
                           color="blue"
                           basic={
                              activeMonth.format('MMMM') !==
                              month.format('MMMM')
                           }
                           onClick={() => setActiveMonth(month)}
                        >
                           {moment(month).format('MMMM')}
                        </Button>
                     );
                  })}
               </React.Fragment>
            </div>

            <CTable
               title={'Ingresos'}
               titleClass={'IncomeHeaderTitle'}
               rows={incomesRows}
               totalRow={['total']}
               columns={[
                  {
                     name: 'category',
                     label: 'Categoría',
                     onClick: (row) => {
                        setIncomeFilters(addOrRemove(incomeFilters, row.key));
                     },
                     width: 12,
                  },
                  {
                     name: 'total',
                     label: 'Importe',
                     format: 'currency',
                     textAlign: 'right',
                     width: 2,
                     onClick: (row) => {
                        setModalExpenses(row.data);
                     },
                  },
                  {
                     name: 'increase_percentage',
                     label: '%I/D',
                     color: true,
                     textAlign: 'right',
                     width: 2,
                  },
               ]}
               filters={incomeFilters}
            />

            <CTable
               title={'Egresos'}
               titleClass={'ExpenseHeaderTitle'}
               rows={expensesRows}
               totalRow={['total']}
               columns={[
                  {
                     name: 'category',
                     label: 'Categoría',
                     onClick: (row) => {
                        setExpenseFilters(addOrRemove(expenseFilters, row.key));
                     },
                     width: 12,
                  },
                  {
                     name: 'total',
                     label: 'Importe',
                     format: 'currency',
                     textAlign: 'right',
                     width: 2,
                     onClick: (row) => {
                        setModalExpenses(row.data);
                     },
                  },
                  {
                     name: 'increase_percentage',
                     label: '%I/D',
                     color: true,
                     textAlign: 'right',
                     width: 2,
                  },
               ]}
               granTotal={netIncome}
               filters={expenseFilters}
            />
         </div>
         <Modal
            onClose={() => setModalExpenses([])}
            open={modalExpenses.length !== 0}
         >
            <Modal.Content>
               <Modal.Description>
                  <CTable
                     title={'Egresos'}
                     rows={modalExpenses}
                     columns={[{
                        name: 'createdAt',
                        label: 'Fecha',
                        format: 'date',
                     },{
                        name: 'sub_category',
                        label: 'Subcategoría',

                     },{
                        name: 'description',
                        label: 'Descripción',

                     },{
                        name: 'payment_method',
                        label: 'Método de pago',
                     },{
                        name: 'amount',
                        label: 'Importe',
                        format: 'currency',
                     }]}
                  />
               </Modal.Description>
            </Modal.Content>
         </Modal>
      </div>
   );
};

const mapDispatchToProps = (dispatch) => ({});

const mapStateToProps = (state) => ({
   incomes: state.incomes,
   expenses: state.expenses.present,
   dictionary: state.lang.dictionary,
   locale: state.lang.locale,
});

export default connect(
   mapStateToProps,
   mapDispatchToProps,
)(IncomeStatementReportPage);
