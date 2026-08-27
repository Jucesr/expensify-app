import {
   isCoupon,
   parseTicketDate,
} from '../utils/costcoTickets';

export const selectTicketsSorted = (tickets = []) => {
   return tickets.slice().sort((a, b) => {
      const dateA = parseTicketDate(a.fecha, a.hora);
      const dateB = parseTicketDate(b.fecha, b.hora);
      if (!dateA && !dateB) {
         return 0;
      }
      if (!dateA) {
         return 1;
      }
      if (!dateB) {
         return -1;
      }
      return dateB.valueOf() - dateA.valueOf();
   });
};

export const selectTicketsTotal = (tickets = []) => {
   return tickets.reduce((sum, ticket) => {
      return sum + (Number(ticket.total) || 0);
   }, 0);
};

export const groupProducts = (tickets = []) => {
   const totalTickets = tickets.length;
   const bySku = {};

   tickets.forEach((ticket) => {
      const parsedDate = parseTicketDate(ticket.fecha, ticket.hora);
      const productos = ticket.productos || [];

      productos.forEach((producto) => {
         if (isCoupon(producto)) {
            return;
         }

         const sku = String(producto.articulo || producto.descripcion || '');
         if (!sku) {
            return;
         }

         if (!bySku[sku]) {
            bySku[sku] = {
               articulo: sku,
               descripcion: producto.descripcion || '',
               timesBought: 0,
               ticketIds: {},
               totalSpent: 0,
               purchases: [],
               lastPurchaseDate: null,
               lastPrice: 0,
            };
         }

         const group = bySku[sku];
         const precio = Number(producto.precio) || 0;
         group.timesBought += 1;
         group.totalSpent += precio;
         group.ticketIds[ticket.id] = true;
         group.purchases.push({
            ticketId: ticket.id,
            fecha: ticket.fecha,
            hora: ticket.hora,
            parsedDate,
            precio,
            sucursal: ticket.sucursal,
         });

         const isNewer =
            !group.lastPurchaseDate ||
            (parsedDate && parsedDate.isAfter(group.lastPurchaseDate));
         if (isNewer) {
            group.lastPurchaseDate = parsedDate;
            group.lastPrice = precio;
            if (producto.descripcion) {
               group.descripcion = producto.descripcion;
            }
         }
      });
   });

   return Object.keys(bySku).map((sku) => {
      const group = bySku[sku];
      const ticketCount = Object.keys(group.ticketIds).length;
      const purchases = group.purchases.slice().sort((a, b) => {
         if (!a.parsedDate && !b.parsedDate) {
            return 0;
         }
         if (!a.parsedDate) {
            return 1;
         }
         if (!b.parsedDate) {
            return -1;
         }
         return b.parsedDate.valueOf() - a.parsedDate.valueOf();
      });

      return {
         id: sku,
         articulo: group.articulo,
         descripcion: group.descripcion,
         timesBought: group.timesBought,
         ticketCount,
         totalTickets,
         ticketsLabel: `${ticketCount}/${totalTickets}`,
         percent: totalTickets ? (ticketCount / totalTickets) * 100 : 0,
         totalSpent: group.totalSpent,
         avgPrice: group.timesBought ? group.totalSpent / group.timesBought : 0,
         lastPrice: group.lastPrice,
         lastPurchaseDate: group.lastPurchaseDate,
         purchases,
      };
   });
};

export const searchProducts = (tickets = [], query) => {
   const normalized = (query || '').trim().toLowerCase();
   if (!normalized) {
      return [];
   }

   return groupProducts(tickets)
      .filter((product) => {
         const descripcion = (product.descripcion || '').toLowerCase();
         const articulo = (product.articulo || '').toLowerCase();
         return (
            descripcion.indexOf(normalized) !== -1 ||
            articulo.indexOf(normalized) !== -1
         );
      })
      .sort((a, b) => {
         if (!a.lastPurchaseDate && !b.lastPurchaseDate) {
            return 0;
         }
         if (!a.lastPurchaseDate) {
            return 1;
         }
         if (!b.lastPurchaseDate) {
            return -1;
         }
         return b.lastPurchaseDate.valueOf() - a.lastPurchaseDate.valueOf();
      });
};

export const selectTopProductsByAppearance = (tickets = [], limit = 15) => {
   return groupProducts(tickets)
      .sort((a, b) => {
         if (b.ticketCount !== a.ticketCount) {
            return b.ticketCount - a.ticketCount;
         }
         return b.totalSpent - a.totalSpent;
      })
      .slice(0, limit);
};

export const selectTopProductsByCost = (tickets = [], limit = 15) => {
   return groupProducts(tickets)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
};
