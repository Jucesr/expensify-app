import React, {useState, useMemo} from 'react';
import PropTypes from 'prop-types';
import {Button, Card, Progress} from 'semantic-ui-react';
import {connect} from 'react-redux';
import numeral from 'numeral';
import moment from 'moment';

import CTable from '../../components/Table';
import ModalForm from '../../components/ModalForm';

import {addCard, editCard} from '../../actions/cards';

import {randomInt, sortByDate} from '../../utils/index';

const formatNumber = (number) => numeral(number / 100).format('$0,0.00');

// function to generate a rendom number of expenses
const generateData = (numberOfElements) => {
   const incomes = [];
   for (let i = 0; i < numberOfElements; i++) {
      incomes.push({
         id: i,
         description: `Gasto ${i}`,
         amount: randomInt(10000, 100000),
         createdAt: moment()
            .subtract(randomInt(0, 12), 'months')
            .subtract(randomInt(0, 15), 'days')
            .toDate(),
         category: 'food',
         paymentMethod: 'credit_card',
         card_id: ['-NAhTYj7o-pdgg0UCBC3', '-NB9-UiGx21WDJfHbMoH'][randomInt(0, 1)],
      });
   }

   return incomes;
};
// const _incomes = generateIncomes(3, categories_income);
// const _expenses = generateIncomes(10000, categories_expense);

const CardsPage = (props) => {
   const {expenses} = props;
   const [modalItem, setModalItem] = useState(null);
   const [cardSelected, setCardSelected] = useState(null);
   const [activeMonth, setActiveMonth] = useState(moment());

   const last12Months = Array(12)
      .fill()
      .map((_, i) => {
         return moment().subtract(i, 'months');
      })
      .reverse();

   const expensesOfCard = useMemo(() => {
      if(!cardSelected) return [];
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

         const expenseBelongsToCard = expense.card_id === cardSelected.id;

         return startDateMatch && endDateMatch && expenseBelongsToCard;
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
   }, [cardSelected, activeMonth, expenses]);

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
                  <Card key={card.id}>
                     <Card.Content>
                        <Card.Header>{card.name}</Card.Header>
                        <Card.Meta>Fecha de corte: {card.pay_date}</Card.Meta>
                        <Card.Description>{card.number}</Card.Description>
                     </Card.Content>
                     <Card.Content extra>
                        <Progress progress percent={55}>
                           {formatNumber(card.amount)}
                        </Progress>
                     </Card.Content>
                     <Card.Content extra>
                        <div className="ui two buttons">
                           <Button
                              basic={
                                 cardSelected
                                    ? cardSelected.id !== card.id
                                    : true
                              }
                              color="green"
                              onClick={() => {
                                 setCardSelected(card);
                              }}
                           >
                              Ver gastos
                           </Button>
                           <Button
                              basic
                              color="blue"
                              onClick={() => {
                                 setModalItem({
                                    ...card,
                                    amount: card.amount / 100,
                                 });
                              }}
                           >
                              Editar
                           </Button>
                        </div>
                     </Card.Content>
                  </Card>
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
   expenses: generateData(500),
});

const mapDispatchToProps = (dispatch) => ({
   addCard: (income) => dispatch(addCard(income)),
   editCard: (id, values) => dispatch(editCard(id, values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CardsPage);
