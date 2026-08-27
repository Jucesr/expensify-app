import database from '../firebase/firebase';
import {
   getTicketId,
   normalizeTicket,
   ticketPayloadForFirebase,
} from '../utils/costcoTickets';

export const setCostcoTickets = () => {
   return (dispatch, getState) => {
      const current = getState().costcoTickets;
      if (current.loaded || current.loading) {
         return Promise.resolve();
      }

      dispatch({type: 'SET_COSTCO_TICKETS_LOADING'});
      const uid = getState().auth.uid;
      return database
         .ref(`users/${uid}/costcoTickets`)
         .once('value')
         .then((snapshot) => {
            const tickets = [];
            snapshot.forEach((childSnapshot) => {
               tickets.push(normalizeTicket(childSnapshot.val(), childSnapshot.key));
            });
            dispatch({
               type: 'SET_COSTCO_TICKETS',
               tickets,
            });
         })
         .catch((error) => {
            dispatch({
               type: 'SET_COSTCO_TICKETS',
               tickets: [],
            });
            console.error('Costco tickets load failed', error);
         });
   };
};

export const importCostcoTickets = (rawTickets = []) => {
   return (dispatch, getState) => {
      const uid = getState().auth.uid;
      const existing = getState().costcoTickets.items || [];
      const existingIds = {};
      existing.forEach((ticket) => {
         existingIds[ticket.id] = true;
      });

      const ticketUpdates = {};
      const merged = [];
      let added = 0;
      let updated = 0;

      if (!rawTickets.length) {
         return Promise.resolve({added: 0, updated: 0});
      }

      rawTickets.forEach((raw) => {
         const id = getTicketId(raw);
         const ticket = normalizeTicket(raw, id);
         ticketUpdates[id] = ticketPayloadForFirebase(ticket);
         if (existingIds[id]) {
            updated += 1;
         } else {
            added += 1;
         }
         merged.push(ticket);
      });

      return database
         .ref(`users/${uid}/costcoTickets`)
         .update(ticketUpdates)
         .then(() => {
            dispatch({
               type: 'MERGE_COSTCO_TICKETS',
               tickets: merged,
            });
            return {added, updated};
         });
   };
};
