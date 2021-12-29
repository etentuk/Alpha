import React, { FC } from 'react';
import { Layout } from 'antd';
import { view } from '@risingstack/react-easy-state';
import DropdownMenu from './DropDownMenu/DropDownMenu';
import styles from './Header.module.css';
import ToggleIcon from './ToggleIcon/ToggleIcon';

const { Header: AntHeader } = Layout;

type Props = {
    collapsed: boolean;
    toggleCollapsed: () => void;
};

const Header: FC<Props> = ({ collapsed, toggleCollapsed }) => (
    <AntHeader className={styles.container}>
        <button
            type="button"
            onClick={toggleCollapsed}
            className={styles.collapsedIconContainer}
        >
            <ToggleIcon collapsed={collapsed} />
        </button>
        <div className={styles.dropDown}>
            <DropdownMenu />
        </div>
    </AntHeader>
);

export default view(Header);
