import numeral from 'numeral';
import moment from 'moment';

export const getTicketId = (ticket = {}) => {
   if (ticket.folio) {
      return String(ticket.folio);
   }
   const fecha = String(ticket.fecha || '').replace(/\//g, '-');
   const hora = String(ticket.hora || '')
      .replace(/:/g, '-')
      .replace(/\s+/g, '-');
   return `${fecha}_${hora}`;
};

export const parseTicketDate = (fecha, hora) => {
   if (!fecha) {
      return null;
   }
   const parts = String(fecha).split('/');
   if (parts.length !== 3) {
      return null;
   }

   const day = parseInt(parts[0], 10);
   const month = parseInt(parts[1], 10) - 1;
   const year = parseInt(parts[2], 10);
   if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return null;
   }

   const parsed = moment({year, month, day});
   if (!parsed.isValid()) {
      return null;
   }

   if (hora) {
      const timeMatch = String(hora).match(/(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)/i);
      if (timeMatch) {
         let hours = parseInt(timeMatch[1], 10);
         const minutes = parseInt(timeMatch[2], 10);
         const seconds = parseInt(timeMatch[3], 10);
         const ampm = timeMatch[4].toUpperCase();
         if (ampm === 'PM' && hours !== 12) {
            hours += 12;
         }
         if (ampm === 'AM' && hours === 12) {
            hours = 0;
         }
         parsed.hour(hours).minute(minutes).second(seconds);
      }
   }

   return parsed;
};

export const formatTicketDate = (fecha, locale) => {
   const parsed = parseTicketDate(fecha);
   if (!parsed) {
      return fecha || '';
   }
   return parsed.locale(locale || 'es').format('DD MMM YYYY');
};

export const isCoupon = (producto) => {
   if (!producto) {
      return true;
   }
   if (String(producto.articulo) === '999') {
      return true;
   }
   if (Number(producto.precio) < 0) {
      return true;
   }
   const descripcion = producto.descripcion || '';
   return /cup[oó]n/i.test(descripcion);
};

export const normalizeProductos = (productos) => {
   if (!productos) {
      return [];
   }
   if (Array.isArray(productos)) {
      return productos;
   }
   return Object.keys(productos).map((key) => productos[key]);
};

export const normalizeTicket = (raw = {}, id) => {
   const ticketId = id || getTicketId(raw);
   return {
      id: ticketId,
      tienda: raw.tienda || '',
      sucursal: raw.sucursal || '',
      rfc: raw.rfc || '',
      fecha: raw.fecha || '',
      hora: raw.hora || '',
      folio: raw.folio || '',
      membresia: raw.membresia || '',
      cajero: raw.cajero || '',
      tarjeta: raw.tarjeta || '',
      metodo_pago: raw.metodo_pago || '',
      articulos_totales: raw.articulos_totales || 0,
      sub_total: raw.sub_total || 0,
      descuento: raw.descuento || 0,
      iva_8: raw.iva_8 || 0,
      total: raw.total || 0,
      productos: normalizeProductos(raw.productos),
   };
};

export const ticketPayloadForFirebase = (ticket) => {
   const payload = Object.assign({}, ticket);
   delete payload.id;
   return payload;
};

export const formatPesos = (amount) => numeral(Number(amount) || 0).format('$0,0.00');
