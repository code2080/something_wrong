import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const SignIn = ({ onSignIn }) => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSignIn({ account, password });
  };

  return (
    <Form hideRequiredMark onSubmit={handleSubmit}>
      <Form.Item label='Email:'>
        <Input
          prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder='Email'
          value={account}
          onChange={(e) => setAccount(e.target.value)}
        />
      </Form.Item>
      <Form.Item label='Password:'>
        <Input
          prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <Button type='primary' onClick={handleSubmit}>
          Sign in
        </Button>
      </Form.Item>
    </Form>
  );
};

SignIn.propTypes = {
  onSignIn: PropTypes.func.isRequired,
};

export default SignIn;
