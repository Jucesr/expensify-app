import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import ExpenseDashBoardPage from '../components/ExpenseDashBoardPage';
import ExpenseTimeLinePage from '../components/ExpenseTimeLinePage';
import AddExpensePage from '../components/AddExpensePage';
import EditExpensePage from '../components/EditExpensePage';
import ReportExpensePage from '../components/ReportExpensePage';
import NotFoundPage from '../components/NotFoundPage';
import LoginPage from '../components/LoginPage';
import IncomePage from '../components/IncomePage/index';
import AddIncomePage from '../components/IncomePage/AddIncomePage';
import EditIncomePage from '../components/IncomePage/EditIncomePage';
import IncomeStatementReportPage from '../components/IncomeStatementReportPage/index';
import CategoriesPage from '../components/CategoriesPage';
import CardsPage from '../routes/CardsPage';
import AddCardPage from '../routes/CardsPage/AddCardPage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

export const history = createHistory();

const AppRouter = () => (
  <HashRouter history={history}>
    <div>
      <Switch>
        <PublicRoute path="/" component={LoginPage} exact={true} />
        <PrivateRoute path="/dashboard" component={ExpenseDashBoardPage} />
        <PrivateRoute path="/timeline" component={ExpenseTimeLinePage} />
        <PrivateRoute path="/create" component={AddExpensePage} />
        <PrivateRoute path="/details" component={ReportExpensePage} />
        <PrivateRoute path="/edit/:id" component={EditExpensePage} />
        <PrivateRoute path="/income" component={IncomePage} />
        <PrivateRoute path="/add_income" component={AddIncomePage} />
        <PrivateRoute path="/edit_income/:id" component={EditIncomePage} />
        <PrivateRoute path="/income_statement" component={IncomeStatementReportPage} />
        <PrivateRoute path="/categories" component={CategoriesPage} />
        <PrivateRoute path="/cards" component={CardsPage} />
        <PrivateRoute path="/add_card" component={AddCardPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>

  </HashRouter>
)

export default AppRouter;
