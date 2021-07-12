import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import ExpenseDashBoardPage from '../components/ExpenseDashBoardPage';
import ExpenseTimeLinePage from '../components/ExpenseTimeLinePage';
import AddExpensePage from '../components/AddExpensePage';
import EditExpensePage from '../components/EditExpensePage';
import ReportExpensePage from '../components/ReportExpensePage';
import NotFoundPage from '../components/NotFoundPage';
import LoginPage from '../components/LoginPage';
import CategoriesPage from '../components/CategoriesPage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

export const history = createHistory();

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <PublicRoute path="/" component={LoginPage} exact={true} />
        <PrivateRoute path="/dashboard" component={ExpenseDashBoardPage} />
        <PrivateRoute path="/timeline" component={ExpenseTimeLinePage} />
        <PrivateRoute path="/create" component={AddExpensePage} />
        <PrivateRoute path="/details" component={ReportExpensePage} />
        <PrivateRoute path="/edit/:id" component={EditExpensePage} />
        <PrivateRoute path="/categories" component={CategoriesPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>

  </Router>
)

export default AppRouter;
