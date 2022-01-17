import React, { FC, useState } from 'react';
import { Alert, Button, Form, Input, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import AuthContainer from './AuthContainer';
import { authPostKeyReturn } from '../../api/Authentication';

const Register: FC = () => {
    const navigate = useNavigate();
    const { Title, Text } = Typography;
    const [errorAlert, setErrorAlert] = useState({
        visible: false,
        message: '',
    });

    const submit = async (values: any): Promise<any> => {
        values.username = values.username.toLowerCase();
        const res = await authPostKeyReturn(values, 'registration/');
        if (res === 'success') {
            return navigate('/');
        } else {
            const errors = res.response.data;
            setErrorAlert({
                visible: true,
                message: Object.values(errors).join(' '),
            });
        }
    };

    return (
        <AuthContainer>
            <Form name="register" onFinish={submit}>
                <Title>Create An Account</Title>
                {errorAlert.visible && (
                    <Alert
                        message={errorAlert.message}
                        type="error"
                        closable
                        onClick={() => {
                            setErrorAlert({ visible: false, message: '' });
                        }}
                        style={{ marginBottom: '10px' }}
                    />
                )}
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
                    <Link to="../login"> Sign in Here</Link>
                </Text>
            </Form>
        </AuthContainer>
    );
};

export default Register;
