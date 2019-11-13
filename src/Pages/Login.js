import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon, Button, Form, Input } from 'antd';
import { withRouter } from 'react-router-dom';

// ACTIONS
import { login } from '../Redux/Auth/auth.actions';
import { setBreadcrumbs } from '../Redux/GlobalUI/globalUI.actions';

// CONSTANTS
const mapStateToProps = state => ({
  authenticated: state.auth.isLoggedIn,
});

const mapActionsToProps = {
  login,
  setBreadcrumbs,
};

const LoginPage = ({
  form,
  login,
  authenticated,
  history,
  setBreadcrumbs
}) => {
  useEffect(() => {
    if (authenticated) history.push('/forms');
  }, [authenticated]);

  useEffect(() => {
    setBreadcrumbs([
      { path: '/', label: 'Login' }
    ]);
  }, [])

  const handleSubmit = useCallback(e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        login({ account: values.account, password: values.password });
      }
    });
  }, [form]);

  return (
    <div className="login--wrapper">
      <Form onSubmit={handleSubmit}>
        <Form.Item label="Username or email">
          {form.getFieldDecorator('account', {
            rules: [{ required: true, message: 'Please input a username or email!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username or email"
            />,
          )}
        </Form.Item>
        <Form.Item label="Password">
          {form.getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

LoginPage.propTypes = {
  form: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  setBreadcrumbs: PropTypes.func.isRequired,
  authenticated: PropTypes.bool,
  history: PropTypes.object.isRequired,
};

LoginPage.defaultProps = {
  authenticated: false,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapActionsToProps
  )(Form.create({ name: 'te-prefs-lib-login' })(LoginPage))
);
