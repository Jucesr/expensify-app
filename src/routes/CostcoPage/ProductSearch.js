import React, {useState} from 'react';
import {formatPesos, formatTicketDate} from '../../utils/costcoTickets';

const ProductSearch = ({query, onQueryChange, results, locale, dictionary}) => {
   const dict = dictionary.pageCostco;
   const [expandedSku, setExpandedSku] = useState(null);

   return (
      <div>
         <div className="input-group">
            <div className="input-group__item input-group__fluid">
               <input
                  className="text-input"
                  type="text"
                  value={query}
                  placeholder={dict.searchPlaceholder}
                  onChange={(event) => onQueryChange(event.target.value)}
               />
            </div>
         </div>

         {!query.trim() && <div className="list-item-message">{dict.searchHint}</div>}

         {!!query.trim() && !results.length && (
            <div className="list-item-message">{dict.searchEmpty}</div>
         )}

         {!!results.length && (
            <div className="list-body">
               {results.map((product) => {
                  const isExpanded = expandedSku === product.articulo;
                  return (
                     <div key={product.articulo}>
                        <div
                           className="list-item costco-list-item"
                           onClick={() =>
                              setExpandedSku(isExpanded ? null : product.articulo)
                           }
                        >
                           <div>
                              <h3>
                                 {product.descripcion}{' '}
                                 <span className="costco-sku">#{product.articulo}</span>
                              </h3>
                              <span>
                                 {dict.lastPurchase}:{' '}
                                 {product.lastPurchaseDate
                                    ? product.lastPurchaseDate
                                         .clone()
                                         .locale(locale || 'es')
                                         .format('DD MMM YYYY')
                                    : ''}{' '}
                                 · {formatPesos(product.lastPrice)}
                              </span>
                              <h5 className="list-item-category">
                                 {dict.appearsIn} {product.ticketsLabel} {dict.ticketsWord} ·{' '}
                                 {dict.spentLabel} {formatPesos(product.totalSpent)}
                              </h5>
                           </div>
                        </div>
                        {isExpanded &&
                           product.purchases.map((purchase, index) => (
                              <div
                                 key={`${purchase.ticketId}-${index}`}
                                 className="list-body-item costco-purchase-row"
                              >
                                 <span>
                                    {formatTicketDate(purchase.fecha, locale)}
                                    {purchase.sucursal ? ` · ${purchase.sucursal}` : ''}
                                 </span>
                                 <span>{formatPesos(purchase.precio)}</span>
                              </div>
                           ))}
                     </div>
                  );
               })}
            </div>
         )}
      </div>
   );
};

export default ProductSearch;
