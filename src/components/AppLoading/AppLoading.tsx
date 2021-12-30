import React, { FC } from 'react';
import { Spin } from 'antd';
import styles from './AppLoading.module.css';

const AppLoading: FC = () => (
    <div className={styles.container}>
        <div className={styles.content}>
            <Spin size="large" />
        </div>
    </div>
);

export default AppLoading;
