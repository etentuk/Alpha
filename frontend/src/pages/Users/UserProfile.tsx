import React, { FC, useState } from 'react';
import { view } from '@risingstack/react-easy-state';
import {
    Alert,
    Button,
    Descriptions,
    Form,
    Input,
    message,
    Modal,
    Spin,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import appState from '../../store';
import { setPassword } from '../../api/Authentication';

const UserProfile: FC = () => {
    const { user } = appState;

    const { Item } = Descriptions;

    const [passwordChange, setPasswordChange] = useState(false);
    const [saving, setSaving] = useState(false);
    const [passwordError, setPasswordError] = useState({
        message: '',
        visible: false,
    });

    const [editForm] = useForm();

    const saveUser = async (values: {
        new_password1: string;
        new_password2: string;
        old_password: string;
    }) => {
        setSaving(true);
        const res = await setPassword({ ...values });
        if (res === 'success') {
            message.success('Successfully Changed Password!');
            setPasswordChange(false);
        } else {
            setPasswordError({
                message: Object.values(res).join(' '),
                visible: true,
            });
        }
        editForm.resetFields();
        setSaving(false);
    };

    const cancelEdit = () => {
        setPasswordChange(false);
        editForm.resetFields();
    };

    return (
        <div>
            <Descriptions
                title="Account Details"
                bordered
                layout="vertical"
                extra={
                    <Button onClick={() => setPasswordChange(true)}>
                        Change Password
                    </Button>
                }
            >
                <Item label="Username">{user.username}</Item>
                <Item label="First Name">{user.first_name}</Item>
                <Item label="Last Name">{user.last_name}</Item>
                <Item label="Email Address">{user.email}</Item>
                <Item label="Role Assignment">{user.role}</Item>
            </Descriptions>

            <Modal
                title="Edit Account Details"
                visible={passwordChange}
                onOk={editForm.submit}
                onCancel={cancelEdit}
            >
                {saving ? (
                    <Spin />
                ) : (
                    <Form
                        name="editUser"
                        initialValues={user}
                        form={editForm}
                        onFinish={saveUser}
                    >
                        <Form.Item
                            name="old_password"
                            label="Old Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Password!',
                                },
                            ]}
                        >
                            <Input.Password placeholder="old_password" />
                        </Form.Item>
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
                    </Form>
                )}
            </Modal>
        </div>
    );
};
export default view(UserProfile);
