import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';

// PAGES
import LoginPage from '../Pages/Auth/Login';
import FormListPage from '../Pages/FormList';
import FormPage from '../Pages/Form';
import FormInstancePage from '../Pages/FormInstance';
import FormReservationTemplateMappingPage from '../Pages/FormReservationTemplateMapping';
import FormInstanceReservationOverviewPage from '../Pages/FormInstanceReservationOverview';

// COMPONENTS
import BreadcrumbsWrapper from './Breadcrumbs';
import AuthenticatedRoutes from './AuthenticatedRoutes/AuthenticatedRoutes';

const TEPrefsLibRouter = () => {
  return (
    <Router>
      <BreadcrumbsWrapper />
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <AuthenticatedRoutes>
          <Route exact path="/forms" component={FormListPage} />
          <Route exact path="/forms/:formId" component={FormPage} />
          <Route exact path="/forms/:formId/mapping" component={FormReservationTemplateMappingPage} />
          <Route exact path="/forms/:formId/form-instances/:formInstanceId" component={FormInstancePage} />
          <Route exact path="/forms/:formId/form-instances/:formInstanceId/activities" component={FormInstanceReservationOverviewPage} />
        </AuthenticatedRoutes>
      </Switch>
    </Router>
  );
};

export default TEPrefsLibRouter;
