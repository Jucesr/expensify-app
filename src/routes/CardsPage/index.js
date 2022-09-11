import React, {useState, useMemo} from 'react';
import PropTypes from 'prop-types';
import {Button, Card, Progress} from 'semantic-ui-react';
import {connect} from 'react-redux';

import moment from 'moment';

import CTable from '../../components/Table';
import ModalForm from '../../components/ModalForm';
import CardItem from './CardItem';

import {addCard, editCard} from '../../actions/cards';

import {sortByDate} from '../../utils/index';

const CardsPage = (props) => {
   const {expenses, cards} = props;
   const [modalItem, setModalItem] = useState(null);
   const [cardSelected, setCardSelected] = useState(null);
   const [activeMonth, setActiveMonth] = useState(moment());

   const last12Months = Array(12)
      .fill()
      .map((_, i) => {
         return moment().subtract(i - 1, 'months');
      })
      .reverse();

   const expensesOfRange = useMemo(() => {
      if (!cardSelected) return [];
      const startRange = moment(activeMonth)
         .subtract(1, 'month')
         .set('date', cardSelected.pay_date)
         .add(1, 'day')
         .startOf('day');

      const endRange = moment(activeMonth)
         .set('date', cardSelected.pay_date)
         .endOf('day');

      const filteredExpenses = expenses.filter((expense) => {
         const createdAtMoment = moment(expense.createdAt);
         const startDateMatch = startRange.isSameOrBefore(
            createdAtMoment,
            'day',
         );
         const endDateMatch = endRange.isSameOrAfter(createdAtMoment, 'day');

         return startDateMatch && endDateMatch;
      });

      return filteredExpenses;
   }, [cardSelected, activeMonth, expenses]);

   const expensesOfCard = useMemo(() => {
      if (!cardSelected) return [];

      const filteredExpenses = expensesOfRange.filter((expense) => {
         const expenseBelongsToCard = expense.card_id === cardSelected.id;

         return expenseBelongsToCard;
      });

      // Get the total of the filtered expenses
      const total = filteredExpenses.reduce((acc, expense) => {
         return acc + expense.amount;
      }, 0);

      // Add the percentage that corresponds to each expense
      const expensesWithPercentage = filteredExpenses.map((expense) => {
         return {
            ...expense,
            percentage: ((expense.amount / total) * 100).toFixed(2),
         };
      });

      // Finnaly sort them by date
      return expensesWithPercentage.sort(sortByDate('createdAt'));
   }, [cardSelected, expensesOfRange]);

   const percentagesOfCards = useMemo(() => {
      // Get the percentage of used based on card limit amount against the total of expenses of the card
      const percentages = cards.reduce((acum, card) => {
         const startRange = moment(activeMonth)
            .subtract(1, 'month')
            .set('date', card.pay_date)
            .add(1, 'day')
            .startOf('day');

         const endRange = moment(activeMonth)
            .set('date', card.pay_date)
            .endOf('day');

         const filteredExpenses = expenses.filter((expense) => {
            const createdAtMoment = moment(expense.createdAt);
            const startDateMatch = startRange.isSameOrBefore(
               createdAtMoment,
               'day',
            );
            const endDateMatch = endRange.isSameOrAfter(createdAtMoment, 'day');

            return startDateMatch && endDateMatch;
         });

         const expensesOfCard = filteredExpenses.filter((expense) => {
            const expenseBelongsToCard = expense.card_id === card.id;

            return expenseBelongsToCard;
         });

         const total = expensesOfCard.reduce((acc, expense) => {
            return acc + expense.amount;
         }, 0);

         return {
            ...acum,
            [card.id]: {
               percentage: parseFloat(((total / card.amount) * 100).toFixed(2)),
               total: total,
            },
         };
      }, {});

      return percentages;
   }, [activeMonth, cards, expenses]);

   return (
      <div>
         <div className="page-header">
            <div className="content-container page-header__actions">
               <h1 className="page-header__title">Gastos con tarjeta</h1>

               <Button
                  color="green"
                  onClick={() => {
                     setModalItem({});
                  }}
               >
                  Agregar tarjeta
               </Button>
            </div>
         </div>
         <div className="content-container">
            <Card.Group>
               {props.cards.map((card) => (
                  <CardItem
                     key={card.id}
                     card={card}
                     setCardSelected={setCardSelected}
                     setModalItem={setModalItem}
                     percentagesOfCards={percentagesOfCards}
                     cardSelected={cardSelected}
                  />
               ))}
            </Card.Group>
         </div>

         {cardSelected && (
            <div className="content-container">
               <div>
                  <h2>Gastos de tarjeta: {cardSelected.name}</h2>
               </div>

               {/* render an array of buttons that represents the last 12 months of the year */}

               <div style={{display: 'flex'}}>
                  <React.Fragment>
                     {last12Months.map((month) => {
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
                  columns={[
                     {
                        name: 'createdAt',
                        label: 'Fecha',
                        format: 'date',
                        width: 3,
                     },
                     {
                        name: 'category',
                        label: 'Categoria',
                        width: 2,
                     },
                     {
                        name: 'description',
                        label: 'Descripción',
                        width: 8,
                     },
                     {
                        name: 'amount',
                        label: 'Importe',
                        format: 'currency',
                        textAlign: 'right',
                        width: 2,
                     },
                     {
                        name: 'percentage',
                        label: '%',
                        textAlign: 'right',
                        width: 1,
                     },
                  ]}
                  totalRow={['amount']}
                  totalRowPosition="up"
                  rows={expensesOfCard}
               />
            </div>
         )}

         <ModalForm
            title="Agregar tarjeta"
            open={modalItem != null}
            initialValues={modalItem}
            onClose={() => {
               setModalItem(null);
            }}
            onSubmit={(values, setSubmitting) => {
               const parsedValues = {
                  ...values,
                  amount: parseFloat(values.amount, 10) * 100,
               };
               if (Object.keys(modalItem).length === 0) {
                  props.addCard(parsedValues);
               } else {
                  props.editCard(modalItem.id, parsedValues);
               }
               setSubmitting(false);
               setModalItem(null);
            }}
            fields={[
               {
                  name: 'name',
                  label: 'Nombre',
                  type: 'text',
                  placeholder: 'Nombre de la tarjeta',
                  required: true,
               },
               {
                  name: 'number',
                  label: 'Número',
                  type: 'text',
                  placeholder: 'Número de la tarjeta',
                  required: true,
               },
               {
                  name: 'pay_date',
                  label: 'Fecha de corte',
                  placeholder: 'Fecha de corte',
                  required: true,
               },
               {
                  name: 'amount',
                  label: 'Monto',
                  type: 'number',
                  placeholder: 'Monto de la tarjeta',
                  required: true,
               },
            ]}
         />
      </div>
   );
};

CardsPage.propTypes = {};

const mapStateToProps = (state) => ({
   cards: state.cards,
   expenses: state.expenses.present,
});

const mapDispatchToProps = (dispatch) => ({
   addCard: (income) => dispatch(addCard(income)),
   editCard: (id, values) => dispatch(editCard(id, values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CardsPage);
