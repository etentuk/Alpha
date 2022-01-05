import React, { FC } from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
import appState from '../store';

const NotFound: FC = () => {
    const { token } = appState;

    return (
        <Result
            status={'404'}
            title={'404'}
            subTitle={'Sorry, the page you visited does not exist.'}
            extra={
                <Button>
                    <Link to="/">Return Home</Link>
                </Button>
            }
        />
    );
};

export default NotFound;
