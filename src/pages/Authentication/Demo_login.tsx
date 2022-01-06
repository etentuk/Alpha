import React, { FC, useState } from 'react';
import Title from 'antd/es/typography/Title';
import { Button, Select, Space } from 'antd';
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

    const onSubmit = async (): Promise<any> => {
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
            <Space style={{ display: 'flex', flexDirection: 'column' }}>
                <Select
                    placeholder="Select a role to use in the site"
                    onChange={(value: UserRole) => setDemoUser(value)}
                >
                    {children}
                </Select>
                <Button onClick={onSubmit}>Sign In</Button>
            </Space>
        </div>
    );
};

export default Demo_login;
