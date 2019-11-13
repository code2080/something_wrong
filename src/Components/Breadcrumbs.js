import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';

// CONSTANTS
const mapStateToProps = state => ({
  fragments: state.globalUI.breadcrumbs,
});

const BreadcrumbsWrapper = ({ fragments }) => (
  <Breadcrumb style={{ marginBottom: '1.2rem' }}>
    {fragments && fragments.map((el, idx) => (
      <Breadcrumb.Item key={idx}>
        <Link to={el.path}>{el.label}</Link>
      </Breadcrumb.Item>
    ))}
  </Breadcrumb>
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
