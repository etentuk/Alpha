import React, { FC, ReactElement } from 'react';
import { Card } from 'antd';
import styles from './AuthContainer.module.css';

const AuthContainer: FC<{ children: ReactElement }> = ({ children }) => (
    <div className={styles.container}>
        <Card className={styles.content}>{children}</Card>
    </div>
);

export default AuthContainer;
