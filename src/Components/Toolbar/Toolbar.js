import React, { useMemo, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';

// COMPONENTS
import ActionsButton from './ActionsButton';
import withTECoreAPI from '../TECoreAPI/withTECoreAPI';

// STYLES
import './Toolbar.scss';

// CONSTANTS
import { teCoreCallnames } from '../../Constants/teCoreActions.constants';

const mapStateToProps = state => ({
  breadcrumbs: state.globalUI.breadcrumbs
});

/**
 * Concept:
 * 1) render the toolbar to a memoized var
 * 2) Assert whether we can render it in TEC
 * 3a) If we can - render it in TEC by calling the TEC API
 * 3b) If we can't - render it in place
 */

const Toolbar = ({ breadcrumbs, teCoreAPI }) => {
  const renderedToolbar = useMemo(
    () => (
      <div className="top-toolbar--wrapper">
        <span className="top-toolbar--breadcrumbs__label">Navigate:</span>
        <Breadcrumb>
          {breadcrumbs &&
            breadcrumbs.map((el, idx) => (
              <Breadcrumb.Item key={idx}>
                <Link to={el.path}>{el.label}</Link>
              </Breadcrumb.Item>
            ))}
        </Breadcrumb>
        <ActionsButton />
      </div>
    ),
    [breadcrumbs]
  );

  useEffect(() => {
    if (teCoreAPI.apiSupportsFunc(teCoreCallnames.SET_TOOLBAR_CONTENT))
      teCoreAPI[teCoreCallnames.SET_TOOLBAR_CONTENT](renderedToolbar);
  }, [breadcrumbs]);
  const shouldShowToolbar = useMemo(
    () => !teCoreAPI.apiSupportsFunc(teCoreCallnames.SET_TOOLBAR_CONTENT),
    [teCoreAPI]
  );

  if (!shouldShowToolbar) return null;

  return renderedToolbar;
};

Toolbar.propTypes = {
  breadcrumbs: PropTypes.array,
  teCoreAPI: PropTypes.object.isRequired
};

Toolbar.defaultProps = {
  breadcrumbs: []
};

export default connect(mapStateToProps, null)(withTECoreAPI(Toolbar));
