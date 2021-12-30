import React, { FC } from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
import appState from '../store';

const NotFound: FC = () => {
    const { token } = appState;

    return (
        <Result
            status={token ? '404' : '403'}
            title={token ? '404' : '403'}
            subTitle={
                token
                    ? 'Sorry, the page you visited does not exist.'
                    : 'Please login or create an account to access this site!'
            }
            extra={
                <Button>
                    {token ? (
                        <Link to="/">Return Home</Link>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </Button>
            }
        />
    );
};

export default NotFound;
