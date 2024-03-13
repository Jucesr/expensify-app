import React, { useReducer, useEffect, useMemo } from 'react';
import { Button, Icon, Table, Modal } from 'semantic-ui-react';
import sortBy from 'lodash.sortby';
import numeral from 'numeral';
import { formatValue } from '../utils/index';

import PropTypes from 'prop-types';

const formatNumber = (number) => numeral(number / 100).format('$0,0.00');

function exampleReducer(state, action) {
   switch (action.type) {
      case 'INIT_ROWS': {
         return {
            column: null,
            data: action.payload,
            direction: null,
         };
      }
      case 'CHANGE_SORT':
         if (state.column === action.column) {
            return {
               ...state,
               data: state.data.slice().reverse(),
               direction:
                  state.direction === 'ascending' ? 'descending' : 'ascending',
            };
         }

         return {
            column: action.column,
            data: sortBy(state.data, [action.column]),
            direction: 'ascending',
         };
      default:
         throw new Error();
   }
}

const formatColumnValue = (format, value) => {
   let formattedValue = value;
   switch (format) {
      case 'currency':
         formattedValue = formatNumber(value);
         break;

      default:
         formattedValue = formatValue(format, value);
         break;
   }
   return formattedValue;
};

const CustomTable = ({
   title,
   titleClass,
   rows,
   totalRow = [],
   totalRowPosition = 'bottom',
   granTotal = null,
   columns = [],
   filters = [],
   onRowClick,
   totalForCurrencyColumns = false
}) => {
   const [state, dispatch] = useReducer(exampleReducer, {
      column: null,
      data: rows,
      direction: null,
   });

   useEffect(() => {
      dispatch({ type: 'INIT_ROWS', payload: rows });
   }, [rows]);

   const { column, data, direction } = state;

   const totals = useMemo(() => {
      // remove rows that don't match the filters
      const filteredRows = data.filter((row) => {
         return !filters.includes(row.key);
      });

      let _totalRow;

      if (totalForCurrencyColumns) {
         _totalRow = columns.filter(c => c.format == 'currency').map(c => c.name)

      } else {
         _totalRow = totalRow
      }

      const totalsKeys = _totalRow.reduce((acc, key) => {
         acc[key] = 0;
         return acc;
      }, {});


      return filteredRows.reduce((acum, row) => {
         return _totalRow.reduce((acc, key) => {
            const value = row[key] ? row[key] : 0;
            acc[key] += value;
            return acc;
         }, acum);
      }, totalsKeys);
   }, [filters, data, totalRow]);

   return (
      <Table celled structured compact sortable>
         <Table.Header>
            {title && (
               <Table.Row textAlign="center" className={titleClass}>
                  <Table.HeaderCell colSpan={columns.length}>
                     {title}
                  </Table.HeaderCell>
               </Table.Row>
            )}
            <Table.Row
               textAlign="center"
               className="IncomeStatementTableHeaderRow"
            >
               {columns.map((col) => (
                  <Table.HeaderCell
                     key={col.name}
                     width={col.width}
                     sorted={column === col.name ? direction : null}
                     onClick={() =>
                        dispatch({ type: 'CHANGE_SORT', column: col.name })
                     }
                  >
                     {col.label}
                  </Table.HeaderCell>
               ))}
            </Table.Row>
         </Table.Header>

         <Table.Body>
            {totalRowPosition === 'up' && (
               <Table.Row>
                  {columns.map((col) => (
                     <Table.HeaderCell key={col.name} textAlign="right">
                        {totals[col.name] != null
                           ? formatNumber(totals[col.name])
                           : ''}
                     </Table.HeaderCell>
                  ))}
               </Table.Row>
            )}
            {data.map((row) => {
               const is_disabled = filters.includes(row.key);
               return (
                  <Table.Row
                     key={row.id}
                     className={`IncomeStatementTableHeaderRow ${is_disabled ? 'disable' : ''
                        }`}
                  >
                     {columns.map((col) => (
                        <Table.Cell
                           key={`${col.name}-${row.id}`}
                           textAlign={col.textAlign}
                           error={
                              col.color
                                 ? is_disabled
                                    ? false
                                    : row[col.name] < 0
                                 : false
                           }
                           positive={
                              col.color
                                 ? is_disabled
                                    ? false
                                    : row[col.name] > 0
                                 : false
                           }
                           className={
                              col.onClick != null
                                 ? `IncomeStatementTableCellMain`
                                 : ''
                           }
                           onClick={
                              col.onClick
                                 ? () => col.onClick(row)
                                 : onRowClick
                                    ? () => onRowClick(row)
                                    : null
                           }
                        >
                           {col.format
                              ? formatColumnValue(col.format, row[col.name])
                              : row[col.name]}
                        </Table.Cell>
                     ))}
                  </Table.Row>
               );
            })}
         </Table.Body>

         {/* render a table footer with the total of each row */}
         <Table.Footer>
            {totalRowPosition === 'bottom' && (
               <Table.Row>
                  {columns.map((col) => (
                     <Table.HeaderCell key={col.name} textAlign="right">
                        {totals[col.name] != null
                           ? formatNumber(totals[col.name])
                           : ''}
                     </Table.HeaderCell>
                  ))}
               </Table.Row>
            )}
            {/* render a table footer with the net income */}
            {granTotal && (
               <Table.Row className="NetIncomeRow">
                  <Table.HeaderCell colSpan={columns.length - 1}>Net Income</Table.HeaderCell>
                  <Table.HeaderCell textAlign="right">
                     {formatNumber(granTotal)}
                  </Table.HeaderCell>
               </Table.Row>
            )}
         </Table.Footer>
      </Table>
   );
};

export default CustomTable;
