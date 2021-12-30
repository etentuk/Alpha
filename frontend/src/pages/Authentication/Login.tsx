import React, { FC, useState } from 'react';
import { Alert, Button, Form, Input, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { view } from '@risingstack/react-easy-state';
import AuthContainer from './AuthContainer';
import { authPostKeyReturn } from '../../api/Authentication';

const Login: FC = () => {
    const [alert, setAlert] = useState(false);
    const navigate = useNavigate();
    const onSubmit = async (values: {
        username: string;
        password: string;
    }): Promise<any> => {
        const loginSuccess = await authPostKeyReturn(
            { username: values.username, password: values.password },
            'login/',
        );
        if (loginSuccess === 'success') {
            return navigate('/');
        }
        setAlert(true);
    };
    const { Title, Text } = Typography;
    return (
        <AuthContainer>
            <>
                <Form name="login" onFinish={onSubmit}>
                    <Title>Login</Title>
                    {alert && (
                        <Alert
                            message="Incorrect UserName or Password! Please try again! "
                            type="error"
                            closable
                            onClick={() => setAlert(false)}
                            style={{ marginBottom: '10px' }}
                        />
                    )}
                    <Form.Item
                        label="Username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                        name="username"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
                <Text>
                    If you don&apos;t have an Account you can also
                    <Link to="../register"> Register</Link> a new one
                    <Link to="../register"> here. </Link>
                </Text>
                <Text>
                    Forgot Password?
                    <Link to="../request-password-reset">
                        Reset your Password
                    </Link>
                </Text>
            </>
        </AuthContainer>
    );
};

export default view(Login);
