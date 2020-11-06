import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Menu, Button, Dropdown } from 'antd';
import { sendReviewerLink } from '../../Redux/FormSubmissions/formSubmissions.actions';

const FormInstanceActionsDropdown = ({ formInstance }) => {
  const dispatch = useDispatch();
  const menu = useMemo(() => (
    <Menu>
      <Menu.Item>
        <a target="_blank" href={formInstance.reviewLink}>View schedule in TE Viewer</a>
      </Menu.Item>
      <Menu.Item onClick={() => dispatch(sendReviewerLink({ formInstanceId: formInstance._id }))}>
        Notify user with review link
      </Menu.Item>
    </Menu>
  ), [formInstance]);

  if (!formInstance || !formInstance.reviewLink) return null;

  return (
    <Dropdown overlay={menu} getPopupContainer={() => document.getElementById('te-prefs-lib')} trigger={['click']}>
      <a type="link" size="small">
        Review schedule...
      </a>
    </Dropdown>
  );
}

FormInstanceActionsDropdown.propTypes = {
  formInstance: PropTypes.object,
};
FormInstanceActionsDropdown.defaultProps = {
  formInstance: null,
};
export default FormInstanceActionsDropdown;
