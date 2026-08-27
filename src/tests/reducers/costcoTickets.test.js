import costcoTicketsReducer from '../../reducers/costcoTickets';
import tickets from '../fixtures/costcoTickets';

test('should set default state', () => {
   const state = costcoTicketsReducer(undefined, {type: '@@INIT'});
   expect(state).toEqual({
      items: [],
      loaded: false,
      loading: false,
   });
});

test('should set loading', () => {
   const state = costcoTicketsReducer(undefined, {type: 'SET_COSTCO_TICKETS_LOADING'});
   expect(state.loading).toBe(true);
   expect(state.loaded).toBe(false);
});

test('should set tickets and mark loaded', () => {
   const state = costcoTicketsReducer(
      {items: [], loaded: false, loading: true},
      {type: 'SET_COSTCO_TICKETS', tickets},
   );
   expect(state.items).toEqual(tickets);
   expect(state.loaded).toBe(true);
   expect(state.loading).toBe(false);
});

test('should upsert tickets on merge without removing existing ones', () => {
   const current = {
      items: [tickets[0], tickets[1]],
      loaded: true,
      loading: false,
   };
   const updatedFirst = Object.assign({}, tickets[0], {total: 500});
   const state = costcoTicketsReducer(current, {
      type: 'MERGE_COSTCO_TICKETS',
      tickets: [updatedFirst, tickets[2]],
   });

   expect(state.items).toHaveLength(3);
   expect(state.items.find((ticket) => ticket.id === 't1').total).toBe(500);
   expect(state.items.find((ticket) => ticket.id === 't2')).toEqual(tickets[1]);
   expect(state.items.find((ticket) => ticket.id === 't3')).toEqual(tickets[2]);
});

test('should reset on logout', () => {
   const state = costcoTicketsReducer(
      {items: tickets, loaded: true, loading: false},
      {type: 'LOGOUT'},
   );
   expect(state).toEqual({
      items: [],
      loaded: false,
      loading: false,
   });
});
