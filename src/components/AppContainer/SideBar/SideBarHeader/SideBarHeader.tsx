import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './SideBarHeader.module.css';

const SideBarHeader: FC<{ collapsed: boolean }> = ({ collapsed }) => {
    const visibility = collapsed ? 'hidden' : 'visible';
    return (
        <div id="logo" className={styles.container}>
            <Link className={styles.linkContainer} to="/">
                <img
                    src="/quinta_logo.jpg"
                    alt="Logo"
                    style={{
                        display: 'inline-block',
                        height: '32px',
                        width: '32px',
                    }}
                />
                <h1 style={{ visibility }}>Quinta</h1>
            </Link>
        </div>
    );
};

export default SideBarHeader;
