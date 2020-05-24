import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';

// PAGES
import LoginPage from '../Pages/Auth/Login';

// ALL FORMS
import FormOverviewPage from '../Pages/FormOverview/FormOverview';

// FORM DETAIL
import FormDetailPage from '../Pages/FormDetail/FormDetail';
import ActivityDesigner from '../Pages/ActivityDesigner/ActivityDesigner';

// FORM INSTANCE
import FormInstanceDetailPage from '../Pages/FormInstanceDetail/FormInstanceDetail';

// COMPONENTS
import Toolbar from './Toolbar/Toolbar';
import AuthenticatedRoutes from './AuthenticatedRoutes/AuthenticatedRoutes';

const TEPrefsLibRouter = () => {
  return (
    <Router>
      <Toolbar />
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <AuthenticatedRoutes>
          <Route exact path="/forms" component={FormOverviewPage} />
          <Route exact path="/forms/:formId" component={FormDetailPage} />
          <Route exact path="/forms/:formId/activity-designer" component={ActivityDesigner} />
          <Route exact path="/forms/:formId/form-instances/:formInstanceId" component={FormInstanceDetailPage} />
        </AuthenticatedRoutes>
      </Switch>
    </Router>
  );
};

export default TEPrefsLibRouter;
