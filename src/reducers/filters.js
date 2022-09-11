import moment from 'moment'

const filterReducerDefaultState = {
  text: '',
  sortBy: 'date',
  startDate: moment().startOf('month'),
  endDate: moment().endOf('month'),
  category: 'disabled',
  sub_category: 'disabled',
  payment_method: 'disabled',
  card_id: 'disabled',
};

export default (state = filterReducerDefaultState, action) => {
  switch (action.type) {

    case 'SET_TEXT_FILTER':
      return {
        ...state,
        text: action.text
      }
    break;

    case 'SORT_BY_DATE':
      return {
        ...state,
        sortBy: 'date'
      }
    break;

    case 'SORT_BY_AMOUNT':
      return {
        ...state,
        sortBy: 'amount'
      }
    break;

    case 'SET_START_DATE':
      return {
        ...state,
        startDate: action.startDate
      }
    break;

    case 'SET_END_DATE':
      return {
        ...state,
        endDate: action.endDate
      }
    break;
    
    case 'SET_CATEGORY':
      return {
        ...state,
        category: action.category,
        sub_category: 'disabled'
      }
    break;
    case 'SET_SUB_CATEGORY':
      return {
        ...state,
        sub_category: action.category
      }
    break;
    
    case 'SET_PAYMENT_METHOD':
      return {
        ...state,
        payment_method: action.payment_method,
        card_id: 'disabled'
      }
    case 'SET_CARD_ID':
      return {
        ...state,
        card_id: action.card_id
      }
    break;

    default:
      return state;
  }
};
