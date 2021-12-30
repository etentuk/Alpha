import React, { FC, useEffect, useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import styles from './AppContainer.module.css';
import SideBar from './SideBar/SideBar';
import Header from './Header/Header';
import {
    getSidebarCollapsedState,
    saveSidebarCollapsedState,
} from './AppContainer.functions';

export const AppContainer: FC = () => {
    const { Content } = Layout;

    const [collapsed, setCollapsed]: any = useState(getSidebarCollapsedState());

    const toggleCollapsed = (): void => {
        setCollapsed((prevState: boolean) => !prevState);
    };

    useEffect(() => {
        saveSidebarCollapsedState(collapsed);
    }, [collapsed]);

    return (
        <Layout style={{ height: '100vh' }}>
            <SideBar collapsed={collapsed} />
            <Layout className={styles.rightContainer}>
                <Header
                    toggleCollapsed={toggleCollapsed}
                    collapsed={collapsed}
                />
                <div className={styles.contentContainer}>
                    <Content>
                        <Outlet />
                    </Content>
                </div>
            </Layout>
        </Layout>
    );
};
