import React, { FC, useState } from 'react';
import { Alert, Button, Form, Input, Space, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { view } from '@risingstack/react-easy-state';
import AuthContainer from './AuthContainer';
import { authPostKeyReturn } from '../../api/Authentication';
import DemoLogin from './DemoLogin';
import styles from './AuthContainer.module.css';



const Login: FC = () => {
    const [alert, setAlert] = useState(false);
    const [demo, setDemo] = useState(false);
    const navigate = useNavigate();
    const onSubmit = async (values: {
        username: string;
        password: string;
    }): Promise<any> => {
        const loginSuccess = await authPostKeyReturn(
            {
                username: values.username.toLowerCase(),
                password: values.password,
            },
            'login/',
        );
        if (loginSuccess === 'success') {
            navigate('/');
        } else {
            setAlert(true);
        }
    };
    const { Title, Text } = Typography;
    return (
        <div className={styles.loginContainer}>
            <AuthContainer>
            <>
                {!demo ? (
                    <>
                        <Form name="login" onFinish={onSubmit}>
                            <Title style={{color: '#fff' }}>Login</Title>
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
                                // style={{color: "#fff"}}
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

                            <Form.Item style={{ display: 'flex', alignItems: 'center' }}>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>

                        <Space
                            style={{ display: 'flex', flexDirection: 'column' }}
                        >
                            <Text style={{color: '#fff' }}>
                                If you don&apos;t have an Account you can also
                                <Link to="../register"> Register</Link> a new
                                one
                                <Link to="../register"> here. </Link>
                            </Text>
                            <Text style={{color: '#fff' }}>
                                Forgot Password?
                                <Link to="../request-password-reset">
                                    {' '}
                                    Reset your Password
                                </Link>
                            </Text>
                            <Text style={{color: '#fff' }}>
                                If you would like to test out the site, you can
                                sign in as a{' '}
                                <Button
                                    type="link"
                                    onClick={() => setDemo(true)}
                                >
                                    Demo User
                                </Button>
                            </Text>
                        </Space>
                    </>
                ) : (
                    <div>
                        <DemoLogin onSubmit={onSubmit} />
                        <Space>
                            <Text>
                                Got an Account?
                                <Button
                                    type="link"
                                    onClick={() => setDemo(false)}
                                >
                                    Sign In
                                </Button>
                            </Text>
                            <Text>
                                If you would like an Account you can also
                                <Link to="../register"> Register</Link> a new
                                one
                                <Link to="../register"> here. </Link>
                            </Text>
                            <Text>
                                Forgot Password?
                                <Link to="../request-password-reset">
                                    {' '}
                                    Reset your Password
                                </Link>
                            </Text>
                        </Space>
                    </div>
                )}
            </>
        </AuthContainer>
        </div>
        
    );
};

export default view(Login);
