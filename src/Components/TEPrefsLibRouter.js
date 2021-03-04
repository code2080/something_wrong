import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';

// PAGES
import LoginPage from '../Pages/Auth/Login';

// ALL FORMS
import FormOverviewPage from '../Pages/FormOverview/FormOverview';

// FORM DETAIL
import FormDetailPage from '../Pages/FormDetail/FormDetail';

// COMPONENTS
import Toolbar from './Toolbar/Toolbar';
import AuthenticatedRoutes from './AuthenticatedRoutes/AuthenticatedRoutes';

const TEPrefsLibRouter = () => {
  return (
    <Router>
      <Toolbar />
      <Switch>
        <Route exact path='/' component={LoginPage} />
        <AuthenticatedRoutes>
          <Route exact path='/forms' component={FormOverviewPage} />
          <Route exact path='/forms/:formId' component={FormDetailPage} />
        </AuthenticatedRoutes>
      </Switch>
    </Router>
  );
};

export default TEPrefsLibRouter;
