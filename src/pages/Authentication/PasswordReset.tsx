import React, { FC, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Title from 'antd/es/typography/Title';
import { Alert, Button, Form, Input, message, Result } from 'antd';
import { passwordResetConfirm } from '../../api/Authentication';
import AuthContainer from './AuthContainer';

const PasswordReset: FC = () => {
    const { uid, token } = useParams();

    const [saving, setSaving] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [passwordError, setPasswordError] = useState({
        message: '',
        visible: false,
    });

    const saveUser = async (values: {
        new_password1: string;
        new_password2: string;
    }) => {
        setSaving(true);
        const res = await passwordResetConfirm({
            ...values,
            uid: uid!,
            token: token!,
        });
        if (res === 'success') {
            setRedirect(true);
            message.success('Successfully Changed Password!');
        } else {
            setPasswordError({
                message: Object.values(res).join(' '),
                visible: true,
            });
        }
        setSaving(false);
    };

    return (
        <AuthContainer>
            {!redirect ? (
                <>
                    <Title>Reset Account Password</Title>
                    <Form name="editUser" onFinish={saveUser}>
                        {passwordError.visible && (
                            <Alert
                                message={passwordError.message}
                                type="error"
                                closable
                                onClick={() =>
                                    setPasswordError({
                                        message: '',
                                        visible: false,
                                    })
                                }
                                style={{ marginBottom: '10px' }}
                            />
                        )}
                        <Form.Item
                            name="new_password1"
                            label="New Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Password!',
                                },
                            ]}
                        >
                            <Input.Password placeholder="New Password" />
                        </Form.Item>

                        <Form.Item
                            name="new_password2"
                            label="Confirm Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Password!',
                                },
                            ]}
                        >
                            <Input.Password placeholder="Confirm Password" />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                disabled={saving}
                                htmlType="submit"
                            >
                                Save Password
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            ) : (
                <Result
                    status="success"
                    title="Successfully Reset Password!"
                    subTitle="Your password has been successfully reset! Click on the link below to Login!"
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

export default PasswordReset;
