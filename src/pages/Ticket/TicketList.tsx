import React, { FC, useEffect, useState } from 'react';
import { Button, Input, Space, Table, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { view } from '@risingstack/react-easy-state';
import cloneDeep from 'lodash/cloneDeep';
import { SearchOutlined } from '@ant-design/icons';
import appState from '../../store';
import { Ticket } from '../../entities/types';
import {
    ticketPriority,
    ticketStatus,
    ticketType,
} from '../../entities/constants';
import styles from './ticket.module.css';
import { ColumnsType } from 'antd/lib/table';

const TicketList: FC = () => {
    const { Title } = Typography;

    const { tickets, users, projects, user } = appState;

    const tableData = Object.values(tickets);

    const [search, setSearch] = useState('');

    const [filteredTableData, setFilteredTableData] = useState<Ticket[]>([]);

    useEffect(() => {
        if (search.length > 0) {
            setFilteredTableData(
                tableData.filter((t) => t.title.includes(search)),
            );
        } else {
            setFilteredTableData(tableData);
        }
    }, [search]);

    const assigneeFilters = new Set(
        filteredTableData.map((t) =>
            t.assignee ? users[t.assignee].username : 'Unassigned',
        ),
    );

    const projectFilters = new Set(
        filteredTableData.map((t) => projects[t.project].name),
    );

    const columns: ColumnsType<Ticket> = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'name',
            sorter: (a: Ticket, b: Ticket) => (a.title > b.title ? 1 : -1),
        },

        {
            title: 'Project Name',
            dataIndex: 'project',
            key: 'project',
            filters: [
                ...Array.from(projectFilters).map((pName) => ({
                    text: pName,
                    value: pName,
                })),
            ],
            responsive: ['md'],
            render: (text: string, record: Ticket) =>
                projects[record.project].name,
            onFilter: (value: any, record: Ticket) =>
                projects[record.project].name === value,
        },
        {
            title: 'Developer Assigned',
            dataIndex: 'assignee',
            key: 'assignee',
            filters: [
                ...Array.from(assigneeFilters).map((assignedTo) => ({
                    text: assignedTo,
                    value: assignedTo,
                })),
            ],
            ellipsis: true,
            responsive: ['lg'],
            render: (text: string, record: Ticket) =>
                record.assignee
                    ? users[record.assignee].username
                    : 'Unassigned',

            onFilter: (value: any, record: Ticket) =>
                record.assignee
                    ? users[record.assignee].username === value
                    : value === 'Unassigned',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                ...ticketStatus.map((stat) => ({ text: stat, value: stat })),
            ],
            ellipsis: true,
            responsive: ['lg'],
            onFilter: (value: any, record: Ticket) =>
                record.status.indexOf(value) === 0,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            ellipsis: true,
            responsive: ['md'],
            filters: [...ticketType.map((typ) => ({ text: typ, value: typ }))],
            onFilter: (value: any, record: Ticket) =>
                record.type.indexOf(value) === 0,
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            filters: [
                ...ticketPriority.map((prior) => ({
                    text: prior,
                    value: prior,
                })),
            ],
            ellipsis: true,
            responsive: ['lg'],
            onFilter: (value: any, record: Ticket) =>
                record.priority.indexOf(value) === 0,
        },
        {
            title: 'Date Created',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (text: string, record: Ticket) =>
                new Date(record.timestamp).toUTCString(),
            sorter: (a: Ticket, b: Ticket) => {
                const aDate = new Date(a.timestamp);
                const bDate = new Date(b.timestamp);
                return aDate.getTime() - bDate.getTime();
            },
            ellipsis: true,
            responsive: ['lg'],
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text: string, record: Ticket) => (
                <Space size="middle" className={styles.detailEditButton}>
                    <Button>
                        <Link to={`${record.id}`}>Details</Link>
                    </Button>
                    {user.user_permissions.includes(
                        'bugtracker.change_ticket',
                    ) ? (
                        <Button>
                            <Link to={`edit/${record.id}`}>Edit</Link>
                        </Button>
                    ) : null}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className={styles.header}>
                <Title level={2}>Tickets</Title>
                <div style={{ maxWidth: '30%', marginBottom: '1rem' }}>
                    <Input
                        onChange={(e) => setSearch(e.target.value)}
                        suffix={<SearchOutlined />}
                        placeholder="Search Ticket Titles"
                    />
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={cloneDeep(filteredTableData)}
                pagination={{
                    total: filteredTableData.length,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} Tickets`,
                    defaultPageSize: 10,
                    showSizeChanger: true,
                }}
                rowKey="id"
            />
        </div>
    );
};

export default view(TicketList);
