//INCOMEs Reducer

const incomesReducerDefaultState = [];

export default (state = incomesReducerDefaultState, action) => {
  switch (action.type) {
    case 'ADD_INCOME':
      return [
        ...state,
        action.income
      ]
    break;

    case 'REMOVE_INCOME':
      return state.filter( (income) => action.id != income.id);
    break;

    case 'EDIT_INCOME':
      return state.map( (income) => {
        if(income.id === action.id){
          return {
            ...income,
            ...action.updates
          };
        }else{
          return income;
        }
      });
    break;

    case 'SET_INCOMES':
      return action.incomes;
    break;

    default:
      return state;
  }
};
