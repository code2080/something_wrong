import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button, Form, Input } from 'antd';

const SignIn = ({ onSignIn, form }) => {
  const handleSubmit = useCallback(e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        onSignIn({ account: values.account, password: values.password });
      }
    });
  }, [form]);

  return (
    <Form
      hideRequiredMark
      onSubmit={handleSubmit}
    >
      <Form.Item label="Email:">
        {form.getFieldDecorator('account', {
          rules: [{ required: true, message: 'Please input a username or email!' }],
        })(
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Email"
          />,
        )}
      </Form.Item>
      <Form.Item label="Password:">
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
          Sign in
        </Button>
      </Form.Item>
    </Form>
  );
};

SignIn.propTypes = {
  form: PropTypes.object.isRequired,
  onSignIn: PropTypes.func.isRequired,
};

export default Form.create({ name: 'te-prefs-lib-login' })(SignIn);
