import React, { FC, useState } from 'react';
import { Alert, Button, Form, Input, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import AuthContainer from './AuthContainer';
import { registerUser } from '../../api/Authentication';

type Registration = {
    username: string;
    email: string;
    password1: string;
    password2: string;
};

const Register: FC = () => {
    const navigate = useNavigate();
    const { Title, Text } = Typography;
    const [usernameAlert, setUsernameAlert] = useState({
        visible: false,
        message: '',
    });
    const [passwordAlert, setPasswordAlert] = useState({
        visible: false,
        message: '',
    });
    const [emailAlert, setEmailAlert] = useState({
        visible: false,
        message: '',
    });

    const submit = async (values: Registration) => {
        const res: any = await registerUser(values);
        if (res === 'successful') navigate('/');
        if (res.username) {
            setUsernameAlert({ visible: true, message: res.username });
        }
        if (res.password1) {
            setPasswordAlert({ visible: true, message: res.password1 });
        }
        if (res.email) {
            setEmailAlert({ visible: true, message: res.email });
        }
    };

    return (
        <AuthContainer>
            <Form name="register" onFinish={submit}>
                <Title>Create An Account</Title>
                <Form.Item
                    label="First Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your First Name!',
                        },
                    ]}
                    name="first_name"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Last Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Last Name!',
                        },
                    ]}
                    name="last_name"
                >
                    <Input />
                </Form.Item>
                {usernameAlert.visible && (
                    <Alert
                        message={usernameAlert.message}
                        type="error"
                        closable
                        onClick={() => {
                            setUsernameAlert({ visible: false, message: '' });
                        }}
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
                {emailAlert.visible && (
                    <Alert
                        message={emailAlert.message}
                        type="error"
                        closable
                        onClick={() => {
                            setEmailAlert({ visible: false, message: '' });
                        }}
                        style={{ marginBottom: '10px' }}
                    />
                )}
                <Form.Item
                    label="Email Address"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Email!',
                        },
                    ]}
                    name="email"
                >
                    <Input type="email" />
                </Form.Item>
                {passwordAlert.visible && (
                    <Alert
                        message={passwordAlert.message}
                        type="error"
                        closable
                        onClick={() => {
                            setPasswordAlert({ visible: false, message: '' });
                        }}
                        style={{ marginBottom: '10px' }}
                    />
                )}
                <Form.Item
                    label="Password"
                    name="password1"
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
                    label="Confirm Password"
                    name="password2"
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
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
                <Text>
                    Got an Account?
                    <Link to="../login">Login Here</Link>
                </Text>
            </Form>
        </AuthContainer>
    );
};

export default Register;
