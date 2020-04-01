import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';

// COMPONENTS
import LogoutButton from './LogoutButton/LogoutButton';

// STYLES
import './Breadcrumbs.scss';

// CONSTANTS
const mapStateToProps = state => ({
  fragments: state.globalUI.breadcrumbs,
});

const BreadcrumbsWrapper = ({ fragments }) => (
  <div className="breadcrumbs--wrapper">
    <span className="breadcrumbs--label">You are here:</span>
    <Breadcrumb>
      {fragments && fragments.map((el, idx) => (
        <Breadcrumb.Item key={idx}>
          <Link to={el.path}>{el.label}</Link>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
    <LogoutButton />
  </div>
);

BreadcrumbsWrapper.propTypes = {
  fragments: PropTypes.array,
};

BreadcrumbsWrapper.defaultProps = {
  fragments: [],
};

export default connect(
  mapStateToProps,
  null
)(BreadcrumbsWrapper);
