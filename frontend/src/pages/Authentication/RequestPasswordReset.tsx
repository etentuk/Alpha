import { Button, Form, Input, Result } from 'antd';
import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContainer from './AuthContainer';
import { resetPassword } from '../../api/Authentication';

const RequestPasswordReset: FC = () => {
    const [submitted, setSubmitted] = useState(false);

    const submitEmail = async (values: { email: string }) => {
        const res = await resetPassword(values.email);
        console.log(res);
        setSubmitted(true);
    };

    return (
        <AuthContainer>
            {!submitted ? (
                <Form onFinish={submitEmail} name="passwordReset">
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                        label="Email Address"
                    >
                        <Input type="email" placeholder="Email Address" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Reset Password
                        </Button>
                    </Form.Item>
                </Form>
            ) : (
                <Result
                    status="success"
                    title="Successfully Reset Password!"
                    subTitle="PLease check your email and follow the link to reset your password."
                    extra={[
                        <Button type="primary" key="console">
                            <Link to="/login">Login</Link>
                        </Button>,
                    ]}
                />
            )}
        </AuthContainer>
    );
};

export default RequestPasswordReset;
