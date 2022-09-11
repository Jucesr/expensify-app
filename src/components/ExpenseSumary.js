import React, {useState, useMemo} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Button} from 'semantic-ui-react';
import moment from 'moment';
import ModalForm from './/ModalForm';

import numeral from 'numeral';
import selectExpenses from '../selectors/expenses';
import getExpensesTotal from '../selectors/expenses-total';
import {
   setStartDate,
   setEndDate,
   setPaymentMethodFilter,
} from '../actions/filters';
import {editExpense} from '../actions/expenses';

import replaceAll from '../utils/replaceAll';

export const ExpenseSumary = ({
   expensesTotal,
   expenseCount,
   hideExpenses,
   dictionary,
   ...props
}) => {
   const [modalOpen, setModalOpen] = useState(false);

   const categoriesOptions = useMemo(() => {
      if (dictionary == null) return [];
      const categories = Object.keys(dictionary.categories);
      return [
         {
            value: '',
            label: 'Sin actualizar',
         },
         ...categories.map((c) => ({
            value: c,
            label: dictionary.categories[c],
         })),
      ];
   }, [dictionary]);

   const subCategoriesOptions = useMemo(() => {
      return [
         {
            value: '',
            label: 'Sin actualizar',
         },
         ...props.sub_categories.map((c) => ({
            value: c.code,
            label: c.spanishDescription,
         })),
      ];
   }, [props.sub_categories]);

   const paymentMethodsOptions = useMemo(() => {
      if (dictionary == null) return [];
      const paymentMethods = Object.keys(dictionary.payment_methods);
      return [
         {
            value: '',
            label: 'Sin actualizar',
         },
         ...paymentMethods.map((c) => ({
            value: c,
            label: dictionary.payment_methods[c],
         })),
      ];
   }, [dictionary]);

   const cardsOptions = useMemo(() => {
      return [
         {
            value: '',
            label: 'Sin actualizar',
         },
         ...props.cards.map((c) => ({
            value: c.id,
            label: `${c.name} (${c.number})`,
         })),
      ];
   }, [props.cards]);

   return (
      <div className="page-header">
         <div className="content-container">
            <h1
               className="page-header__title"
               dangerouslySetInnerHTML={{
                  __html: replaceAll(dictionary.summaryMessageTitle, {
                     '{p1}': `<span>${expenseCount}</span>`,
                     '{p2}': expenseCount != 1 ? 's' : '',
                     '{p3}': `<span>${numeral(expensesTotal / 100).format(
                        '$0,0.00',
                     )}</span>`,
                  }),
               }}
            ></h1>
            {hideExpenses > 1 && (
               <h4
                  className="page-header__subtitle"
                  dangerouslySetInnerHTML={{
                     __html: replaceAll(dictionary.summaryMessageSubitle, {
                        '{p1}': `<span>${hideExpenses}</span>`,
                        '{p2}': hideExpenses != 1 ? 's' : '',
                     }),
                  }}
               ></h4>
            )}
            <div className="page-header__actions">
               <div>
                  <Link className="button button-gray" to="/income">
                     {dictionary.pageReportExpense.buttonIncome}
                  </Link>
                  <Link className="button" to="/details">
                     {dictionary.pageReportExpense.button}
                  </Link>
                  <Link className="button button-red" to="/timeline">
                     {dictionary.pageReportExpense.buttonTimeLine}
                  </Link>
                  <Link className="button button-green" to="/cards">
                     {dictionary.pageReportExpense.buttonCreditCard}
                  </Link>
                  <Link className="button button-purple" to="/categories">
                     {dictionary.pageReportExpense.buttonCategories}
                  </Link>
                  <Button
                     color="green"
                     className="button button-red"
                     onClick={() => {
                        setModalOpen(true);
                     }}
                  >
                     Actualizar gastos
                  </Button>
               </div>

               <Link className="button button-green" to="/create">
                  {dictionary.addExpenseButton}
               </Link>
            </div>
         </div>
         <ModalForm
            title="Actualizar gastos"
            open={modalOpen}
            onClose={() => {
               setModalOpen(false);
            }}
            onSubmit={async (values, setSubmitting) => {

               const updatedObjects = props.expenses.map((e) => {
                  const newValues = {
                     id: e.id,
                     ...values,
                  };
                  if (newValues.category === '') {
                     delete newValues.category;
                  }
                  if (newValues.sub_category === '') {
                     delete newValues.sub_category;
                  }
                  if (newValues.payment_method === '') {
                     delete newValues.payment_method;
                  }
                  return newValues;
               })

               const proms = updatedObjects.map((e) => {
                  const {id, ...values} = e;
                  return props.editExpense(id, values);
               });

               await Promise.all(proms);

               setSubmitting(false);
               setModalOpen(false);
            }}
            shouldConfirm={true}
            fields={[
               {
                  name: 'category',
                  label: 'Categoria',
                  type: 'select',
                  options: categoriesOptions,
                  placeholder: 'Selecciona una categoria',
               },
               {
                  name: 'sub_category',
                  label: 'Sub-categoria',
                  type: 'select',
                  options: subCategoriesOptions,
                  placeholder: 'Selecciona una sub-categoria',
               },
               {
                  name: 'payment_method',
                  label: 'Método de pago',
                  type: 'select',
                  options: paymentMethodsOptions,
                  placeholder: 'Selecciona una método de pago',
               },
               {
                  name: 'card_id',
                  label: 'Tarjeta',
                  type: 'select',
                  options: cardsOptions,
                  placeholder: 'Selecciona una método de pago',
               },
            ]}
            renderBody={(values) => (
               <div>
                  <div>
                     Se actualizarán {props.expenses.length} gastos por un total
                     de {numeral(expensesTotal / 100).format('$0,0.00')}
                  </div>
               </div>
            )}
         />
      </div>
   );
};

const mapStateToProps = (state) => {
   const expenses = selectExpenses(state.expenses.present, state.filters);
   return {
      sub_categories: state.categories,
      cards: state.cards,
      expenses: expenses,
      expensesTotal: getExpensesTotal(expenses),
      expenseCount: expenses.length,
      hideExpenses: state.expenses.present.length - expenses.length,
      dictionary: state.lang.dictionary,
   };
};

const mapDispatchToProps = (dispatch) => {
   return {
      setStartDate: (date) => dispatch(setStartDate(date)),
      setEndDate: (date) => dispatch(setEndDate(date)),
      editExpense: (id, values) => dispatch(editExpense(id, values)),
      setPaymentMethodFilter: (endDate) =>
         dispatch(setPaymentMethodFilter(endDate)),
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseSumary);
