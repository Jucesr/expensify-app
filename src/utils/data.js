// function to generate a rendom number of expenses
const generateData = (numberOfElements) => {
   const incomes = [];
   for (let i = 0; i < numberOfElements; i++) {
      incomes.push({
         id: i,
         description: `Gasto ${i}`,
         amount: randomInt(10000, 100000),
         createdAt: moment()
            .subtract(randomInt(0, 12), 'months')
            .subtract(randomInt(0, 15), 'days')
            .toDate(),
         category: 'food',
         paymentMethod: 'credit_card',
         card_id: ['-NAhTYj7o-pdgg0UCBC3', '-NB9-UiGx21WDJfHbMoH'][
            randomInt(0, 1)
         ],
      });
   }

   return incomes;
};
// const _incomes = generateIncomes(3, categories_income);
// const _expenses = generateIncomes(10000, categories_expense);