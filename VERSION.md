# Release notes.

### V7.2.0
Date: March 13th, 2024

* [NEW] 
   * Multiple month view in income statement
   * Filter out categories in ExpenseTimeLinePage

### V7.1
Date: December 6th, 2022

* [FIX] 
   *  Filter bug in income's list
   *  Filter bug in card's expenses list
* [NEW] 
   *  Add year in IncomeStatement report

### V7.0
Date: September 5th, 2022

* [NEW] 
   *  Allow to manage sub categories as catalog items
   *  Allow to manage credit cards as catalog items
   *  Expenses list will be shown when clicking on the category row in IncomeStatement
   *  Custom Table component
   *  Button to bulk update expenses, modal form with selector for category, subcategory, payment and credit card id 

### V6.0
Date: Agu 29th, 2022

* [FIX] 
   *  Allow to find by note 'description'.
   *  Upload dist folder to deploy on github.

### V5.1
Date: May 11th, 2022

* [FIX] 
   *  Fixed a bug in income statement.
   
### V5.0
Date: May 11th, 2022

* [NEW] 
   *  Add feature to add incomes.
   *  Add Income statement report page.

### V4.2
Date: Jul 12th, 2021

* [NEW] 
   *  Add new category 'Kids'

### V4.1
Date: May 24th, 2021

* [NEW] 
   *  Add button to set filters of expenses made by credit card

### V4.0
Date: December 27th, 2020

* [NEW] 
   *  Add semantic ui
   *  New google chart 
   *  User can click in a month and see the expenses by month

### V3.2
Date: March 03th, 2020

* [ADD] New category travel expenses.
* [FIX] Filter is re-set when ExpenseList is loaded. 

### V3.1
Date: February 16th, 2020

* [ADD] time line expenses by month.
* [FIX] virtualization for list of expenses. 

### V3.0
Date: January 26th, 2020

* [ADD] support for payment methods.
* [ADD] filters for category and payment methods
* [ADD] pie chart for both category and payment method expenses in report page
* [FIX] Locale for date did not change when use ES.
* [FIX] User avatar bigget than 50px
* [FIX] Upgrade node-sass for node 12.x

### V2.0
Date: October 15th, 2018

* Add support for categories.
* Add /detail route. It shows a chart with all the expenses categorized by category.
* Add a few more variables to local/*
* Add README.md and Version.md file
* Modify ExpenseItemList: add category below description.
* Modify ExpenseSumary component: add button to see details.