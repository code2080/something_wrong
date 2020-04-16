import React from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';

// PAGES
import LoginPage from '../Pages/Auth/Login';
// ALL FORMS
import FormOverviewPage from '../Pages/FormOverview/FormOverview';

// FORM DETAIL
import FormDetailPage from '../Pages/FormDetail/FormDetail';
import FormReservationTemplateMappingPage from '../Pages/FormReservationTemplateMapping/FormReservationTemplateMapping';

// FORM INSTANCE
import FormInstanceDetailPage from '../Pages/FormInstanceDetail/FormInstanceDetail';
import FormInstanceActivitiesOverview from '../Pages/FormInstanceActivitiesOverview/FormInstanceActivitiesOverview';

// COMPONENTS
import BreadcrumbsWrapper from './Breadcrumbs/Breadcrumbs';
import AuthenticatedRoutes from './AuthenticatedRoutes/AuthenticatedRoutes';

const TEPrefsLibRouter = () => {
  return (
    <Router>
      <BreadcrumbsWrapper />
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <AuthenticatedRoutes>
          <Route exact path="/forms" component={FormOverviewPage} />
          <Route exact path="/forms/:formId" component={FormDetailPage} />
          <Route exact path="/forms/:formId/mapping" component={FormReservationTemplateMappingPage} />
          <Route exact path="/forms/:formId/form-instances/:formInstanceId" component={FormInstanceDetailPage} />
          <Route exact path="/forms/:formId/form-instances/:formInstanceId/activities" component={FormInstanceActivitiesOverview} />
        </AuthenticatedRoutes>
      </Switch>
    </Router>
  );
};

export default TEPrefsLibRouter;
