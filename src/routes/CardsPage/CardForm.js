import React, {useState, useReducer} from 'react';
import PropTypes from 'prop-types';

function exampleReducer(state, action) {
   switch (action.type) {
      case 'INIT_FORM': {
         return {
            ...action.card,
         };
      }
      case 'UPDATE_VALUE':
         return {
            ...state,
            [action.field]: action.value,
         };
      default:
         throw new Error();
   }
}

const CardForm = (props) => {
   const {card} = props;
   const [error, setError] = useState(null);
   const [stateFilter, dispatch] = useReducer(exampleReducer, {
      name: '',
      number: '',
      pay_date: '',
      amount: 0,
   });

   const {name, number, pay_date, amount} = stateFilter;

   const handleChange = (e) => {
      const {name, value} = e.target;
      dispatch({type: 'UPDATE_VALUE', field: name, value});
   };

   const onAmountChange = (e) => {
      const amount = e.target.value;

      if (amount.match(/^\d*(\.\d{0,2})?$/)) {
         dispatch({type: 'UPDATE_VALUE', field: 'amount', value: amount});
      }
   };

   const onSubmit = (e) => {
      e.preventDefault();

      if (!name || !amount) {
         setError('Todos los campos son obligatorios');
      } else {
         //Clear error
         setError(null);
         props.onSubmit({
            ...stateFilter,
            amount: parseFloat(stateFilter.amount, 10) * 100,
         });
      }
   };

   return (
      <form className="form" onSubmit={onSubmit}>
         {error != null > 0 && <p className="form__error">{error}</p>}

         <input
            className="text-input"
            type="text"
            placeholder={'Nombre de la tarjeta'}
            autoFocus
            value={name}
            name="name"
            onChange={handleChange}
         />
         <input
            className="text-input"
            type="text"
            placeholder={'Numero de la tarjeta'}
            value={number}
            name="number"
            onChange={handleChange}
         />
         <input
            className="text-input"
            type="text"
            placeholder={'Fecha de corte'}
            value={pay_date}
            name="pay_date"
            onChange={handleChange}
         />
         <input
            className="text-input"
            type="text"
            placeholder={'Linea de crédito'}
            value={amount}
            name="amount"
            onChange={onAmountChange}
         />

         <div>
            <button className="button">Guardar</button>
         </div>
      </form>
   );
};

CardForm.propTypes = {};

export default CardForm;
