import React, { FC } from 'react';
import Title from 'antd/es/typography/Title';
import { Button, Form, Select } from 'antd';
import { demoUsers } from '../../entities/constants';

interface DemoLoginProps {
    onSubmit: (values: { username: string; password: string }) => void;
}

const DemoLogin: FC<DemoLoginProps> = ({ onSubmit }) => {
    const { Option } = Select;
    const children = demoUsers.map((dUser) => (
        <Option value={dUser} key={dUser}>
            {dUser.toUpperCase()}
        </Option>
    ));

    const submitDemo = (values: { username: string }) => {
        onSubmit({ username: values.username, password: 'demo_password2' });
    };

    return (
        <div>
            <Title> Sign In as a Demo User</Title>
            <Form onFinish={submitDemo} layout="vertical">
                <Form.Item
                    name="username"
                    label="Select a Demo User"
                    rules={[
                        {
                            required: true,
                            message: 'Please select a Demo User!',
                        },
                    ]}
                >
                    <Select placeholder="Select a role to use in the site">
                        {children}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Sign In
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default DemoLogin;
