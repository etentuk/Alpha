import React, { FC, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Dropdown, Button, Typography, Space } from 'antd';
import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { view } from '@risingstack/react-easy-state';
import { logoutUser } from '../../../../api/Authentication';
import appState from '../../../../store';

const DropdownMenu: FC = () => {
    const navigate = useNavigate();
    const { Text } = Typography;

    const {
        user: { username, role },
    } = appState;

    const logout = async (): Promise<void> => {
        appState.isLoaded = false;
        navigate('login');
        await logoutUser();
        appState.isLoaded = true;
    };

    const menu = (): ReactElement => (
        <Menu>
            <Menu.Item
                key="profile"
                icon={<UserOutlined />}
                onClick={() => navigate('profile')}
            >
                User Profile
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu} trigger={['click']}>
            <Button>
                {role}_{username}
                <DownOutlined />
            </Button>
        </Dropdown>
    );
};

export default view(DropdownMenu);
