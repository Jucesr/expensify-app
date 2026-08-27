import tickets from '../fixtures/costcoTickets';
import {
   selectTicketsSorted,
   selectTicketsTotal,
   searchProducts,
   selectTopProductsByAppearance,
   selectTopProductsByCost,
   groupProducts,
} from '../../selectors/costcoTickets';
import {getTicketId, isCoupon} from '../../utils/costcoTickets';

test('should sort tickets newest first', () => {
   const result = selectTicketsSorted(tickets);
   expect(result.map((ticket) => ticket.id)).toEqual(['t1', 't2', 't3']);
});

test('should sum ticket totals in pesos', () => {
   expect(selectTicketsTotal(tickets)).toBe(1013);
});

test('should skip coupons when grouping products', () => {
   const grouped = groupProducts(tickets);
   const skus = grouped.map((product) => product.articulo).sort();
   expect(skus).toEqual(['597354', '638212', '782796']);
   grouped.forEach((product) => {
      expect(isCoupon(product)).toBe(false);
   });
});

test('should report appearance as ticket count over all tickets', () => {
   const huevo = groupProducts(tickets).find((product) => product.articulo === '638212');
   expect(huevo.ticketCount).toBe(2);
   expect(huevo.totalTickets).toBe(3);
   expect(huevo.ticketsLabel).toBe('2/3');
   expect(huevo.timesBought).toBe(2);
   expect(huevo.totalSpent).toBe(698);
});

test('should return last purchase from the newest ticket', () => {
   const huevo = groupProducts(tickets).find((product) => product.articulo === '638212');
   expect(huevo.lastPrice).toBe(349);
   expect(huevo.lastPurchaseDate.format('DD/MM/YYYY')).toBe('09/08/2026');
   expect(huevo.purchases[0].fecha).toBe('09/08/2026');
});

test('should search products by description substring', () => {
   const result = searchProducts(tickets, 'huevo');
   expect(result).toHaveLength(1);
   expect(result[0].descripcion).toBe('HUEVO GALLINA LIBR');
   expect(result[0].purchases).toHaveLength(2);
});

test('should search products by sku', () => {
   const result = searchProducts(tickets, '782796');
   expect(result).toHaveLength(1);
   expect(result[0].descripcion).toBe('KS AGUA 40/500ML');
});

test('should return no products when search is empty', () => {
   expect(searchProducts(tickets, '')).toEqual([]);
   expect(searchProducts(tickets, '   ')).toEqual([]);
});

test('should rank top products by appearance', () => {
   const result = selectTopProductsByAppearance(tickets, 2);
   expect(result).toHaveLength(2);
   expect(result[0].articulo).toBe('638212');
   expect(result[0].ticketsLabel).toBe('2/3');
   expect(result[1].articulo).toBe('782796');
});

test('should rank top products by cost', () => {
   const result = selectTopProductsByCost(tickets, 2);
   expect(result[0].articulo).toBe('638212');
   expect(result[0].totalSpent).toBe(698);
   expect(result[1].articulo).toBe('782796');
   expect(result[1].totalSpent).toBe(210);
});

test('should use folio as ticket id and fallback to fecha and hora', () => {
   expect(getTicketId({folio: '75000505020403261858'})).toBe('75000505020403261858');
   expect(
      getTicketId({
         fecha: '09/08/2026',
         hora: '08:12:00 PM',
      }),
   ).toBe('09-08-2026_08-12-00-PM');
});
