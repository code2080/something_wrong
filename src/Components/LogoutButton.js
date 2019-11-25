import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import { deleteToken } from '../Utils/tokenHelpers';

const LogoutButton = (props) => {
    let history = useHistory();
    return props.authenticated ? (<Button size="small" onClick={
        async () => {
            window.tePrefsLibStore.dispatch({ type: 'LOGIN_FAILURE' });
            await deleteToken();
            history.push('/');
        }}>
        Log out
  </Button>) : null;
}

export default LogoutButton;