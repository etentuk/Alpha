import React, { FC, ReactElement } from 'react';
import { Layout, Menu } from 'antd';
import { MenuItemProps } from 'antd/lib/menu/MenuItem';
import {
    AppstoreOutlined,
    ProjectOutlined,
    ScheduleOutlined,
    UsergroupAddOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { view } from '@risingstack/react-easy-state';
import SideBarHeader from './SideBarHeader/SideBarHeader';
import styles from './SideBar.module.css';
import appState from '../../../store';

type Props = {
    collapsed: boolean;
};

const menuData: MenuItemProps[] = [
    {
        children: 'Dashboard',
        id: '/',
        icon: <AppstoreOutlined />,
    },
    {
        children: 'Projects',
        id: '/project',
        icon: <ProjectOutlined />,
    },
    {
        children: 'Tickets',
        id: '/ticket',
        icon: <ScheduleOutlined />,
    },
];

const SideBar: FC<Props> = ({ collapsed }) => {
    const { Sider } = Layout;
    const { user } = appState;

    const renderMenuData = (value: MenuItemProps): ReactElement => (
        <Menu.Item key={value.id} icon={value.icon}>
            <Link to={value.id!}>{value.children}</Link>
        </Menu.Item>
    );

    console.log(user);
    return (
        <Sider width={256} collapsed={collapsed} className={styles.container}>
            <SideBarHeader collapsed={collapsed} />
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={[window.location.pathname]}
            >
                {renderMenuData(menuData[0])}
                {user.user_permissions.includes('bugtracker.change_role')
                    ? renderMenuData({
                          children: 'Manage Users',
                          id: '/manageroles',
                          icon: <UsergroupAddOutlined />,
                      })
                    : null}
                {menuData.slice(1).map((value) => renderMenuData(value))}
            </Menu>
        </Sider>
    );
};

export default view(SideBar);
