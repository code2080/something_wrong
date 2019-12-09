import React from 'react';
import { connect } from 'react-redux';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';

// PAGES
import LoginPage from '../Pages/Login';
import FormListPage from '../Pages/FormList';
import FormPage from '../Pages/Form';
import FormInstancePage from '../Pages/FormInstance';

// COMPONENTS
import BreadcrumbsWrapper from './Breadcrumbs';

// CONSTANTS
const mapStateToProps = state => ({
  authenticated: state.auth.isLoggedIn,
});

const TEPrefsLibRouter = () => {
  return (
    <Router>
      <BreadcrumbsWrapper />
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/forms" component={FormListPage} />
        <Route exact path="/forms/:formId" component={FormPage} />
        <Route exact path="/forms/:formId/:formInstanceId" component={FormInstancePage} />
      </Switch>
    </Router>
  );
};

export default connect(mapStateToProps, null)(TEPrefsLibRouter);
