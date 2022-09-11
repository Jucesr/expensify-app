import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Button, Card, Progress, Table} from 'semantic-ui-react';
import numeral from 'numeral';
import {formatValue} from '../../utils/index';
const formatNumber = (number) => numeral(number / 100).format('$0,0.00');

const CardItem = (props) => {
   const {
      card,
      setCardSelected,
      setModalItem,
      percentagesOfCards,
      cardSelected,
   } = props;

   const percentageValue = percentagesOfCards[card.id]
      ? percentagesOfCards[card.id].percentage
      : 0;

   const currentTotal = percentagesOfCards[card.id]
      ? percentagesOfCards[card.id].total
      : 0;

   return (
      <Card>
         <Card.Content>
            <Card.Header>{card.name}</Card.Header>
            <Card.Meta>Fecha de corte: {card.pay_date}</Card.Meta>
            <Card.Description>{card.number}</Card.Description>
         </Card.Content>
         <Card.Content extra>
            <Table basic="very" celled collapsing>
               <Table.Body>
                  <Table.Row>
                     <Table.Cell>Importe gastado</Table.Cell>
                     <Table.Cell> {formatNumber(currentTotal)}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                     <Table.Cell>Limite de crédito</Table.Cell>
                     <Table.Cell> {formatNumber(card.amount)}</Table.Cell>
                  </Table.Row>
               </Table.Body>
            </Table>
            <Progress
               success={percentageValue < 33 ? true : false}
               warning={
                  percentageValue < 80 && percentageValue >= 33 ? true : false
               }
               error={percentageValue >= 80 ? true : false}
               percent={percentageValue}
            >
               {formatValue('percentage', percentageValue)}
            </Progress>
         </Card.Content>
         <Card.Content extra>
            <div className="ui two buttons">
               <Button
                  basic={cardSelected ? cardSelected.id !== card.id : true}
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
   );
};

CardItem.propTypes = {};

export default CardItem;
