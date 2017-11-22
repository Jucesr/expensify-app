
export default (expenses) => {
  if(expenses.length > 0){
    return Object.values(expenses).reduce( (sum, expense) => sum + expense.amount, 0);
  }else {
    return 0;
  }
}
