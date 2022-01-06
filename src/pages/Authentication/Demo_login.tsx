import React, { FC, useState } from 'react';
import Title from 'antd/es/typography/Title';
import { Button, Form, Select, Space } from 'antd';
import { userRoles } from '../../entities/constants';
import { UserRole } from '../../entities/types';
import { authPostKeyReturn } from '../../api/Authentication';
import { useNavigate } from 'react-router-dom';

const Demo_login: FC = () => {
    const navigate = useNavigate();
    const { Option } = Select;
    const [demoUser, setDemoUser] = useState<UserRole>('SUBMITTER');
    const children = userRoles.map((role) => (
        <Option value={role} key={role}>
            {role}
        </Option>
    ));

    const submitDemo = async (): Promise<any> => {
        const loginSuccess = await authPostKeyReturn(
            {
                username: `demo_${demoUser.toLowerCase()}`,
                password: 'demo_password2',
            },
            'login/',
        );
        if (loginSuccess === 'success') {
            return navigate('/');
        }
    };

    return (
        <div>
            <Title> Sign In as a Demo User</Title>
            <Form>
                <Space style={{ display: 'flex', flexDirection: 'column' }}>
                    <Select
                        placeholder="Select a role to use in the site"
                        onChange={(value: UserRole) => setDemoUser(value)}
                        value={demoUser}
                    >
                        {children}
                    </Select>
                    <Button onClick={submitDemo}>Sign In</Button>
                </Space>
            </Form>
        </div>
    );
};

export default Demo_login;
