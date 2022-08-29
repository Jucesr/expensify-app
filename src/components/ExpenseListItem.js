import React from 'react';
import {Link} from 'react-router-dom';
import moment from 'moment';
import numeral from 'numeral';

const ExpenseListItem = ({
   dictonary,
   id,
   category,
   payment_method,
   description,
   note,
   amount,
   createdAt,
   locale,
}) => (
   <Link className="list-item" to={`/edit/${id}`}>
      <div>
         <h3>{description}</h3>
         <h6>{note}</h6>
         <h5 className="list-item-category">
            {dictonary.categories[category]}
         </h5>
         <span>
            {moment(createdAt).locale(locale).format('MMMM Do , YYYY')}
         </span>
      </div>
      <div>
         <h3 style={{textAlign: 'right'}}>
            {numeral(amount / 100).format('$0,0.00')}
         </h3>
         <h5 style={{textAlign: 'right'}} className="list-item-category">
            {dictonary.payment_methods[payment_method]}
         </h5>
      </div>
   </Link>
);
//
export default ExpenseListItem;
