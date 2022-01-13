import React, { FC, useEffect, useState } from 'react';
import { Button, Input, Space, Table, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { view } from '@risingstack/react-easy-state';
import { SearchOutlined } from '@ant-design/icons';
import appState from '../../store';
import { Project } from '../../entities/types';
import styles from './project.module.css';
import { ColumnsType } from 'antd/es/table';

const ProjectList: FC = () => {
    const navigate = useNavigate();
    const { projects, user, users } = appState;
    const { Title } = Typography;

    const tableData = Object.values(projects);

    const [search, setSearch] = useState('');

    const [filteredTableData, setFilteredTableData] = useState<Project[]>([]);

    useEffect(() => {
        if (search.length > 0) {
            setFilteredTableData(
                tableData.filter((p) => p.name.includes(search)),
            );
        } else {
            setFilteredTableData(tableData);
        }
    }, [search]);

    const creatorFilters = new Set(
        filteredTableData.map((p) => users[p.creator].username),
    );

    const columns: ColumnsType<Project> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: Project, b: Project) => (a.name > b.name ? 1 : -1),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            responsive: ['md'],
        },
        {
            title: 'Manager',
            dataIndex: 'creator',
            key: 'creator',
            render: (text: string, record: Project) =>
                users[record.creator].username,
            filters: [
                ...Array.from(creatorFilters).map((createdBy) => ({
                    text: createdBy,
                    value: createdBy,
                })),
            ],
            ellipsis: true,
            responsive: ['lg'],
            onFilter: (value: any, record: Project) =>
                users[record.creator].username === value,
        },
        {
            title: 'Date Created',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (text: string, record: Project) => {
                const date = new Date(record.timestamp);
                return date.toUTCString();
            },
            sorter: (a: Project, b: Project) => {
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
            render: (text: string, record: Project) => (
                <Space
                    size="middle"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                    }}
                >
                    <Button>
                        <Link to={`${record.id}`}>Details</Link>
                    </Button>
                    {user.user_permissions.includes(
                        'bugtracker.change_project',
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
                <div>
                    <Title>Projects</Title>

                    <Input
                        onChange={(e) => setSearch(e.target.value)}
                        suffix={<SearchOutlined />}
                        placeholder="Search Project Titles"
                    />
                </div>
                <div>
                    {user.user_permissions.includes(
                        'bugtracker.add_project',
                    ) ? (
                        <Button onClick={() => navigate('create')}>
                            Create New Project
                        </Button>
                    ) : null}
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={filteredTableData}
                pagination={{
                    total: filteredTableData.length,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} Projects`,
                    defaultPageSize: 10,
                    showSizeChanger: true,
                }}
                rowKey="id"
            />
        </div>
    );
};

export default view(ProjectList);
