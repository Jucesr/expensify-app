import React from 'react';
import ExpenseListFilters from './ExpenseListFilters';
import {connect} from 'react-redux';
import selectExpenses from '../selectors/expenses';
import numeral from 'numeral';
import {convertArrayToObject} from '../utils/index';
import CTable from "./Table";


import AnyChart from 'anychart-react/dist/anychart-react.min.js';

export class ReportExpensePage extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         category_selected: null,
      };
   }

   onSubmit = (expense) => {
      this.props.addExpense(expense);
      this.props.history.push('/');
   };

   render() {
      const {dictionary} = this.props;
      const {category_selected} = this.state;
      const {categories, payment_methods, pageReportExpense} = dictionary;
      const sub_categories = convertArrayToObject(
        this.props.sub_categories,
        'code',
     );
      const expenses = this.props.expenses;
      //  Get category totals.
      let data = expenses.reduce((current, expense) => {
         let category = expense.hasOwnProperty('category')
            ? expense.category
            : 'other';

         if (!current.hasOwnProperty(category)) {
            current[category] = 0;
         }
         current[category] += expense.amount;
         return current;
      }, {});

      let chart_data = Object.keys(data).map((property) => ({
         x: categories[property],
         category: property,
         value: data[property],
         id: property,
      }));

      //  Payment method data
      let payment_method_data = expenses.reduce((current, expense) => {
         let pm = expense.hasOwnProperty('payment_method')
            ? payment_methods[expense.payment_method]
            : payment_methods['other'];

         if (!current.hasOwnProperty(pm)) {
            current[pm] = 0;
         }
         current[pm] += expense.amount;
         return current;
      }, {});

      let payment_method_chart_data = Object.keys(payment_method_data).map(
         (property) => ({
            x: property,
            value: payment_method_data[property],
            id: property,
         }),
      );

      const setCategory = (category) => {
         this.setState({category_selected: category});
      };

      // Subcategory data
      const isCategorySelected = category_selected != null;
      let sub_category_chart_data;
      if (isCategorySelected) {
         

         const expensesOfCategory = category_selected
            ? expenses.filter((e) => e.category === category_selected)
            : [];

         //  Get category totals.
         let data = expensesOfCategory.reduce((current, expense) => {
            let category = expense.hasOwnProperty('sub_category')
               ? expense.sub_category
               : 'other';

            if (!current.hasOwnProperty(category)) {
               current[category] = 0;
            }
            current[category] += expense.amount;
            return current;
         }, {});

         sub_category_chart_data = Object.keys(data).map((property) => ({
            x: sub_categories[property] ? sub_categories[property].spanishDescription : 'Sin clasificación',
            category: property,
            value: data[property],
            id: property,
         }));
      }

      return (
         <div>
            <div className="page-header">
               <div className="content-container">
                  <h1 className="page-header__title">
                     {pageReportExpense.title}
                  </h1>
               </div>
            </div>
            <div className="content-container">
               <ExpenseListFilters />

               <div className="report-expense-page">
                  {this.props.expenses.length > 0 ? (
                     <div>
                        <Section
                           id="1"
                           title={pageReportExpense.categoryTitle}
                           data={chart_data}
                           onRowClick={setCategory}
                        />

                        {isCategorySelected && (
                           <Section
                              id="3"
                              title={`${pageReportExpense.subCategoryTitle} ${categories[category_selected]}`}
                              data={sub_category_chart_data}
                           />
                        )}

                        <Section
                           id="2"
                           title={pageReportExpense.paymentMethodTitle}
                           data={payment_method_chart_data}
                        />
                     </div>
                  ) : (
                     <div className="empty_list">
                        <span>{pageReportExpense.noExpenseMessage}</span>
                     </div>
                  )}
               </div>
            </div>
         </div>
      );
   }
}

const Section = ({id, title, data, onRowClick}) => {
   return (
      <div className="section">
         <div className="section_title">{title}</div>
         <div className="section_body">
            <div>
              <CTable
                columns={[{
                  name: 'x',
                  label: 'Categoría',
                },{
                  name: 'value',
                  label: 'Total',
                  format: 'currency',
                  textAlign: 'right',
                }]}
                rows={data}
                totalRow={['value']}
                onRowClick={(item) => onRowClick(item.category)}
              />
            </div>
            <div>
               <AnyChart
                  id={`chart-container${id}`}
                  type="pie"
                  data={data}
                  legend={false}
                  className="expense-chart"
                  width={500}
                  height={400}
               />
            </div>
         </div>
      </div>
   );
};

const mapDispatchToProps = (dispatch) => ({});

const mapStateToProps = (state) => ({
   dictionary: state.lang.dictionary,
   sub_categories: state.categories,
   expenses: selectExpenses(state.expenses.present, state.filters),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReportExpensePage);
