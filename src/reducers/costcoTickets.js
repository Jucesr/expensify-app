const costcoTicketsDefaultState = {
   items: [],
   loaded: false,
   loading: false,
};

export default (state = costcoTicketsDefaultState, action) => {
   switch (action.type) {
      case 'SET_COSTCO_TICKETS_LOADING':
         return Object.assign({}, state, {loading: true});

      case 'SET_COSTCO_TICKETS':
         return {
            items: action.tickets,
            loaded: true,
            loading: false,
         };

      case 'MERGE_COSTCO_TICKETS': {
         const byId = {};
         state.items.forEach((ticket) => {
            byId[ticket.id] = ticket;
         });
         action.tickets.forEach((ticket) => {
            byId[ticket.id] = ticket;
         });
         return {
            items: Object.keys(byId).map((id) => byId[id]),
            loaded: true,
            loading: false,
         };
      }

      case 'LOGOUT':
         return costcoTicketsDefaultState;

      default:
         return state;
   }
};
