import React, {useMemo} from 'react';
import {Modal, Table} from 'semantic-ui-react';
import {formatPesos, formatTicketDate, isCoupon} from '../../utils/costcoTickets';

const TicketList = ({tickets, locale, dictionary, selectedTicket, onSelect, onClose}) => {
   const dict = dictionary.pageCostco;

   const selectedProductos = useMemo(() => {
      if (!selectedTicket || !selectedTicket.productos) {
         return [];
      }
      return selectedTicket.productos;
   }, [selectedTicket]);

   if (!tickets.length) {
      return <div className="list-item-message">{dict.emptyTickets}</div>;
   }

   return (
      <div className="list-body">
         <div className="list-header">
            <div>{dict.ticketColumn}</div>
            <div>{dict.totalColumn}</div>
         </div>
         {tickets.map((ticket) => (
            <div
               key={ticket.id}
               className="list-item costco-list-item"
               onClick={() => onSelect(ticket)}
            >
               <div>
                  <h3>
                     {formatTicketDate(ticket.fecha, locale)} · {ticket.sucursal}
                  </h3>
                  <span>
                     {ticket.hora} · {ticket.metodo_pago}
                  </span>
                  <h5 className="list-item-category">
                     {ticket.articulos_totales} {dict.itemsLabel}
                  </h5>
               </div>
               <div>
                  <h3>{formatPesos(ticket.total)}</h3>
               </div>
            </div>
         ))}

         <Modal open={!!selectedTicket} onClose={onClose} size="small">
            {selectedTicket && (
               <React.Fragment>
                  <Modal.Header>
                     {formatTicketDate(selectedTicket.fecha, locale)} · {selectedTicket.sucursal}
                  </Modal.Header>
                  <Modal.Content>
                     <p>
                        {selectedTicket.hora} · {selectedTicket.metodo_pago}
                        {selectedTicket.folio ? ` · ${dict.folioLabel} ${selectedTicket.folio}` : ''}
                     </p>
                     <Table celled compact>
                        <Table.Header>
                           <Table.Row>
                              <Table.HeaderCell>{dict.productColumn}</Table.HeaderCell>
                              <Table.HeaderCell>{dict.skuColumn}</Table.HeaderCell>
                              <Table.HeaderCell textAlign="right">
                                 {dict.priceColumn}
                              </Table.HeaderCell>
                           </Table.Row>
                        </Table.Header>
                        <Table.Body>
                           {selectedProductos.map((producto, index) => (
                              <Table.Row key={`${producto.articulo}-${index}`}>
                                 <Table.Cell>
                                    {producto.descripcion}
                                    {isCoupon(producto) ? ` (${dict.couponLabel})` : ''}
                                 </Table.Cell>
                                 <Table.Cell>{producto.articulo}</Table.Cell>
                                 <Table.Cell textAlign="right">
                                    {formatPesos(producto.precio)}
                                 </Table.Cell>
                              </Table.Row>
                           ))}
                        </Table.Body>
                        <Table.Footer>
                           <Table.Row>
                              <Table.HeaderCell colSpan="2">{dict.totalColumn}</Table.HeaderCell>
                              <Table.HeaderCell textAlign="right">
                                 {formatPesos(selectedTicket.total)}
                              </Table.HeaderCell>
                           </Table.Row>
                        </Table.Footer>
                     </Table>
                  </Modal.Content>
               </React.Fragment>
            )}
         </Modal>
      </div>
   );
};

export default TicketList;
