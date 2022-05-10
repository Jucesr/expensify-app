import React, { useMemo, useState } from 'react'
import { Button, Icon, Table, Modal } from 'semantic-ui-react'
import { connect } from 'react-redux'
import numeral from 'numeral';
import moment from 'moment';

import { groupItemsByProperty, randomInt } from "../../utils/index";
import getExpensesTotal from "../../selectors/expenses-total";

import categories_income from "../../config/categories_income";
import categories_expense from "../../config/categories";
import payment_methods from "../../config/payment_methods"


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
         paymentMethod: payment_methods[randomInt(0, payment_methods.length - 1)],
      })
   }

   return incomes;

}


const formatNumber = number => numeral(number / 100).format('$0,0.00')

const _incomes = generateIncomes(1000, categories_income);
const _expenses = generateIncomes(800, categories_expense);

const IncomeStatementReportPage = (props) => {
   // const { expenses, incomes } = props;
   const { dictionary } = props;

   const incomes = _incomes;
   const expenses = _expenses

   const [exchangeRate, setExchangeRate] = useState(20);
   const [activeMonth, setActiveMonth] = useState(moment().format('MMMM'));

   const incomesRows = useMemo(() => {

      // Filter out incomes that are not in the active month
      const filteredIncomes = incomes.filter(income => {
         const incomeMonth = moment(income.createdAt).format('MMMM');
         return incomeMonth === activeMonth;
      });

      const groupedIncomes = groupItemsByProperty(filteredIncomes, 'category');
      const rows = Object.keys(groupedIncomes).map(key => {
         const incomesByCategory = groupedIncomes[key];
         return {
            category: dictionary.categories_income[key],
            total: getExpensesTotal(incomesByCategory)
         }
      })

      // sort rows by category
      return rows.sort((a, b) => {
         return a.category.localeCompare(b.category);
      })
   }, [incomes, activeMonth])


   const expensesRows = useMemo(() => {
      // Filter out expenses that are not in the active month
      const filteredIncomes = expenses.filter(income => {
         const incomeMonth = moment(income.createdAt).format('MMMM');
         return incomeMonth === activeMonth;
      });

      const groupedIncomes = groupItemsByProperty(filteredIncomes, 'category');
      const rows = Object.keys(groupedIncomes).map(key => {
         const incomesByCategory = groupedIncomes[key];
         return {
            category: dictionary.categories[key],
            total: getExpensesTotal(incomesByCategory)
         }
      })
      // sort rows by category
      return rows.sort((a, b) => {
         return a.category.localeCompare(b.category);
      })
   }, [expenses, activeMonth])

   const lastSixMonths = Array(6).fill().map((_, i) => {
      return moment().subtract(i, 'months')
   })

   const netIncome = useMemo(() => {
      const incomes = incomesRows.reduce((acc, curr) => acc + curr.total, 0);
      const expenses = expensesRows.reduce((acc, curr) => acc + curr.total, 0);
      return incomes - expenses;
   }, [incomesRows, expensesRows])

   return (
      <div style={{ margin: '0 5rem' }}>

         {/* render an array of buttons that represents the last six months of the year */}

         <div style={{ display: 'flex', marginTop: '1rem' }}>
            <React.Fragment >
               {lastSixMonths.reverse().map(month => {
                  return (
                     <Button
                        key={month.format('MMMM')}
                        color="blue"
                        basic={activeMonth !== month.format('MMMM')}
                        onClick={() => setActiveMonth(month.format('MMMM'))}>
                        {moment(month).format('MMMM')}
                     </Button>
                  )
               })}
            </React.Fragment>
         </div>



         {/* <div>
            <label>Exchange Rate</label>
            <input type="number" value={exchangeRate} onChange={(e) => setExchangeRate(e.target.value)} />

         </div> */}

         <SumTable
            title={'Ingresos'}
            titleClass={'IncomeHeaderTitle'}
            rows={incomesRows}
            exchangeRate={exchangeRate}
         />

         <SumTable
            title={'Egresos'}
            titleClass={'ExpenseHeaderTitle'}
            rows={expensesRows}
            exchangeRate={exchangeRate}
            netIncome={netIncome}
         />
      </div>
   )
}

const SumTable = ({
   title,
   titleClass,
   rows,
   exchangeRate,
   netIncome = null
}) => {
   return <Table celled structured compact >
      <Table.Header >
         <Table.Row textAlign='center' className={titleClass}>
            <Table.HeaderCell colSpan='3'>{title}</Table.HeaderCell>
         </Table.Row>
         <Table.Row textAlign='center' className="IncomeStatementTableHeaderRow">
            <Table.HeaderCell rowSpan='2'>Categoria</Table.HeaderCell>
            <Table.HeaderCell colSpan='2'>Importe</Table.HeaderCell>
         </Table.Row>
         <Table.Row textAlign='center' className="IncomeStatementTableHeaderRow">
            <Table.HeaderCell>MXN</Table.HeaderCell>
            {/* <Table.HeaderCell>USD</Table.HeaderCell> */}
         </Table.Row>
      </Table.Header>


      <Table.Body>
         {rows.map(row => {
            return (
               <Table.Row key={row.category} className="IncomeStatementTableHeaderRow">
                  <Table.Cell>{row.category}</Table.Cell>
                  <Table.Cell textAlign='right'>{formatNumber(row.total)}</Table.Cell>
                  {/* <Table.Cell textAlign='right'>{formatNumber(row.total / exchangeRate)}</Table.Cell> */}
               </Table.Row>
            )
         })}
      </Table.Body>

      {/* render a table footer with the total of each row */}
      <Table.Footer>
         <Table.Row>
            <Table.HeaderCell colSpan='1'>Total</Table.HeaderCell>
            <Table.HeaderCell textAlign='right'>{formatNumber(rows.reduce((acc, curr) => acc + curr.total, 0))}</Table.HeaderCell>
            {/* <Table.HeaderCell textAlign='right'>{formatNumber(rows.reduce((acc, curr) => acc + curr.total / exchangeRate, 0))}</Table.HeaderCell> */}
         </Table.Row>
         {/* render a table footer with the net income */}
         {netIncome &&
            <Table.Row className="NetIncomeRow">
               <Table.HeaderCell colSpan='1'>Net Income</Table.HeaderCell>
               <Table.HeaderCell textAlign='right'>{formatNumber(netIncome)}</Table.HeaderCell>
               {/* <Table.HeaderCell textAlign='right'>{formatNumber(netIncome / exchangeRate)}</Table.HeaderCell> */}
            </Table.Row>}
      </Table.Footer>


   </Table>
}

const mapDispatchToProps = (dispatch) => ({

});


const mapStateToProps = (state) => ({
   incomes: state.incomes,
   expenses: state.expenses.present,
   dictionary: state.lang.dictionary,
   locale: state.lang.locale,
});

export default connect(mapStateToProps, mapDispatchToProps)(IncomeStatementReportPage)