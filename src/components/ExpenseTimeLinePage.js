import React, { useMemo, useEffect, useState } from 'react'
import { Checkbox, Icon, Table, Modal } from 'semantic-ui-react'
import { connect } from 'react-redux';
import moment from 'moment';
import ExpenseListFilters from './ExpenseListFilters';
import selectExpenses from '../selectors/expenses'
import numeral from 'numeral';
import GoogleChart from "react-google-charts";
import times from "lodash/times";
import categories from '../config/categories';

import { setStartDate } from "../actions/filters";

const ExpenseTimeLinePage = (props) => {
   const { expenses, dictionary } = props;
   const { pageTimeLineExpense } = dictionary;

   const [selectedCategories, setSelectedCategories] = useState(categories)
   const [selectedExpenses, setSelectedExpenses] = useState([])
   const [sortAmount, setSortAmount] = useState('none')
   const [sortDate, setSortDate] = useState('none')

   useEffect(() => {
      props.setStartDate(moment().subtract(12, 'months'))
   }, [])

   const expensesFilteredByCategory = useMemo(() => {
      return expenses.filter(expense => selectedCategories.includes(expense.category))
   }, [expenses, selectedCategories])

   // Iterate all expenses and group them by month.
   const expensesByMonth = useMemo(() => expensesFilteredByCategory.reduce((acum, expense) => {
      const month = moment(expense.createdAt).startOf('month');
      const monthString = month.format('MMM YY').toUpperCase()
      return {
         ...acum,
         [monthString]: acum[monthString] ? acum[monthString].concat(expense) : [expense]
      }
   }, {}), [expensesFilteredByCategory])

   const dataObj = expensesFilteredByCategory.reduce((acum, expense) => {
      const month = moment(expense.createdAt).startOf('month');
      let total = 0;
      total = expense.amount / 100;
      const monthString = month.format('MM-DD-YYYY')
      return {
         ...acum,
         [monthString]: acum[monthString] ? acum[monthString] + total : total
      }
   }, {})

   const googleData = useMemo(() => {
      const dates = Object.keys(dataObj).map(key => {
         return moment(key).format('MM-DD-YYYY')
      })

      const firstDate = dates[dates.length - 1];
      const lastDate = dates[0];

      const nMonths = moment(lastDate).diff(firstDate, 'months')
      const lastNMonths = times(nMonths + 1, (n) => {
         return moment(lastDate).subtract(n, 'months').format('MM-DD-YYYY');
      })

      return lastNMonths.map(key => {
         const value = dataObj[key] ? dataObj[key] : 0
         return [
            moment(key).format('MMM YY').toUpperCase(),
            value
         ]
      })

   }, [dataObj])

   const chartEvents = [
      {
         eventName: "select",
         callback({ chartWrapper }) {
            const selection = chartWrapper.getChart().getSelection()[0];
            if (selection) {
               const { row, column } = selection;
               const selected = googleData[row][column - 1];
               const expenses = expensesByMonth[selected]
               setSelectedExpenses(expenses)
            }
         }
      }
   ];

   const toggleSort = (state) => {
      switch (state) {
         case 'up':
            return 'down'
         case 'down':
            return 'none'
         case 'none':
            return 'up'
         default:
            break;
      }
   }

   const getIconName = (state) => {
      switch (state) {
         case 'up':
            return 'sort amount up'
         case 'down':
            return 'sort amount down'
         case 'none':
            return 'list'
         default:
            break;
      }
   }

   return (
      <div>
         <Modal
            onClose={() => setSelectedExpenses([])}
            open={selectedExpenses.length !== 0}
         >
            <Modal.Content >

               <Modal.Description>
                  <Table celled>
                     <Table.Header>
                        <Table.Row>
                           <Table.HeaderCell>
                              Fecha
                              <Icon onClick={() => {
                                 setSortDate(toggleSort(sortDate))
                              }} name={getIconName(sortDate)}></Icon>
                           </Table.HeaderCell>
                           <Table.HeaderCell>Nombre</Table.HeaderCell>
                           <Table.HeaderCell>Categoria</Table.HeaderCell>
                           <Table.HeaderCell>Método de pago</Table.HeaderCell>
                           <Table.HeaderCell>
                              Monto <Icon onClick={() => {
                                 setSortAmount(toggleSort(sortAmount))
                              }} name={getIconName(sortAmount)}></Icon>
                           </Table.HeaderCell>
                        </Table.Row>
                     </Table.Header>

                     <Table.Body>
                        {selectedExpenses.sort((a, b) => {
                           if (sortDate !== 'none') {
                              const isUp = sortDate === 'up';
                              if (moment(a.createdAt).isAfter(b.createdAt)) {
                                 return isUp ? -1 : 1
                              } else {
                                 return isUp ? 1 : -1
                              }
                           }


                           return sortAmount === 'up' ? a.amount - b.amount : b.amount - a.amount
                        }).map(expense => <Table.Row key={expense.id}>
                           <Table.Cell>{moment(expense.createdAt).format('MMMM Do , YYYY')}</Table.Cell>
                           <Table.Cell>{expense.description}</Table.Cell>
                           <Table.Cell>{dictionary.categories[expense.category]}</Table.Cell>
                           <Table.Cell>{dictionary.payment_methods[expense.payment_method]}</Table.Cell>
                           <Table.Cell>{numeral(expense.amount / 100).format('$0,0.00')}</Table.Cell>
                        </Table.Row>)}

                     </Table.Body>
                  </Table>
               </Modal.Description>
            </Modal.Content>

         </Modal>
         <div className="page-header">
            <div className="content-container">
               <h1 className="page-header__title">{pageTimeLineExpense.title}</h1>
            </div>
         </div>
         <div className="content-container">
            <ExpenseListFilters />
            <GoogleChart
               width="100%"
               height="500px"
               chartType="LineChart"
               // loader={<div className="DashboardCardLoader">
               //    <Dimmer active inverted>
               //       <Loader>Cargando Gráfica</Loader>
               //    </Dimmer>
               // </div>}
               data={[
                  ['Fecha', 'Monto'],
                  ...googleData.reverse()
               ]}
               options={{
                  chartArea: { width: "80%", height: "80%" },
                  legend: {
                     position: 'none'
                  }
               }}
               chartEvents={chartEvents}
            // rootProps={{ 'data-testid': '1' }}
            />

            <div style={{
               display: 'flex',
               flexDirection: 'column',
            }}>
               {categories.map(c => {
                  return <Checkbox
                     key={c}
                     label={dictionary.categories[c]}
                     checked={selectedCategories.includes(c)}
                     onChange={(e, data) => {
                        if (data.checked) {
                           setSelectedCategories(selectedCategories.concat(c))
                        } else {
                           setSelectedCategories(selectedCategories.filter(sc => sc !== c))
                        }

                     }} />
               })}

            </div>
         </div>

      </div>
   )
}

const mapDispatchToProps = (dispatch) => ({
   setStartDate: (date) => dispatch(setStartDate(date))
});

const mapStateToProps = (state) => ({
   dictionary: state.lang.dictionary,
   expenses: selectExpenses(state.expenses.present, state.filters),
   filters: state.filters
});

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseTimeLinePage);