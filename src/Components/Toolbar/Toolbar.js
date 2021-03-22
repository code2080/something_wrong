import React, { useMemo, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Breadcrumb } from 'antd';

// COMPONENTS
import ActionsButton from './ActionsButton';
import withTECoreAPI from '../TECoreAPI/withTECoreAPI';

// ACTIONS
import { logout } from '../../Redux/Auth/auth.actions';

// STYLES
import './Toolbar.scss';

// CONSTANTS
import { teCoreCallnames } from '../../Constants/teCoreActions.constants';
import { authenticationStatuses } from '../../Constants/auth.constants';

const actionKeys = {
  LOGOUT: 'LOGOUT',
  ACTIVITY_DESIGNER: 'ACTIVITY_DESIGNER',
};

const getFormIdFromBreadcrumb = (breadcrumbs) => {
  try {
    const formBreadcrumb = breadcrumbs[1];
    const fragments = formBreadcrumb.path.split('/');
    return fragments[2];
  } catch (error) {
    return null;
  }
};

const mapStateToProps = (state) => {
  const breadcrumbs = state.globalUI.breadcrumbs;
  const formId = getFormIdFromBreadcrumb(breadcrumbs);
  return {
    breadcrumbs,
    form: formId ? state.forms[formId] : null,
    isAuthenticated:
      state.auth.authenticationStatus === authenticationStatuses.AUTHENTICATED,
  };
};

const mapActionsToProps = {
  logout,
};

/**
 * Concept:
 * 1) render the toolbar to a memoized var
 * 2) Assert whether we can render it in TEC
 * 3a) If we can - render it in TEC by calling the TEC API
 * 3b) If we can't - render it in place
 */

const Toolbar = ({
  breadcrumbs,
  form,
  isAuthenticated,
  teCoreAPI,
  history,
  logout,
}) => {
  const logOutCallback = async () => {
    await logout();
    history.push('/');
  };

  const onHandleActionClick = ({ key }) => {
    switch (key) {
      case actionKeys.LOGOUT:
        logOutCallback();
        break;
      case actionKeys.ACTIVITY_DESIGNER:
        history.push(`/forms/${form._id}/activity-designer`);
        break;
      default:
        break;
    }
  };
  const onHandleBreadrumbsClick = (path) => history.push(path);

  const renderedToolbar = (
    <div className='top-toolbar--wrapper'>
      <span className='top-toolbar--breadcrumbs__label'>Navigate:</span>
      <Breadcrumb>
        {breadcrumbs &&
          breadcrumbs.map((el, idx) => (
            <Breadcrumb.Item key={idx}>
              <span
                className='top-toolbar--breadcrumbs__item'
                onClick={() => onHandleBreadrumbsClick(el.path)}
              >
                {el.label}
              </span>
            </Breadcrumb.Item>
          ))}
      </Breadcrumb>
      <ActionsButton
        form={form}
        breadcrumbs={breadcrumbs}
        handleClick={onHandleActionClick}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );

  useEffect(() => {
    if (teCoreAPI.apiSupportsFunc(teCoreCallnames.SET_TOOLBAR_CONTENT)) {
      teCoreAPI[teCoreCallnames.SET_TOOLBAR_CONTENT](
        <div className='te-prefs-lib'>{renderedToolbar}</div>,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breadcrumbs]);
  const shouldShowToolbar = useMemo(
    () => !teCoreAPI.apiSupportsFunc(teCoreCallnames.SET_TOOLBAR_CONTENT),
    [teCoreAPI],
  );

  if (!shouldShowToolbar) return null;

  return renderedToolbar;
};

Toolbar.propTypes = {
  breadcrumbs: PropTypes.array,
  teCoreAPI: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

Toolbar.defaultProps = {
  breadcrumbs: [],
};

export default withRouter(
  connect(mapStateToProps, mapActionsToProps)(withTECoreAPI(Toolbar)),
);
