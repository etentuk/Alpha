import React, { FC } from 'react';
import { Button, message, Popconfirm, Space, Table, Typography } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { view } from '@risingstack/react-easy-state';
import appState from '../../store';
import { Ticket } from '../../entities/types';
import { deleteObject } from '../../api/dataReqs';
import styles from './project.module.css';

const ProjectDetails: FC = () => {
    const navigate = useNavigate();
    const {
        getUsersArray,
        projects,
        delObject,
        getProjectTickets,
        users,
        user,
    } = appState;

    const { id } = useParams();

    const pId = parseInt(id!, 10);

    if (!projects[pId]) {
        location.href = '/error';
    }

    const { Title, Text } = Typography;

    const project = projects[pId];

    const projectUsers = getUsersArray().filter((u) =>
        project.assignees.includes(u.id),
    );

    const deleteProject = async (projectId: number) => {
        try {
            await deleteObject('project', projectId).then(() => {
                delObject('projects', projectId);
                message.success('Successfully Deleted Project!');
                navigate('../');
            });
        } catch (e) {
            console.log(e);
            message.error('An Error Occured, Please try again!');
        }
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
    ];

    const ticketColumns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Assignee',
            dataIndex: 'assignee',
            key: 'assignee',
            render: (text: string, record: Ticket) =>
                record.assignee
                    ? users[record.assignee].username
                    : 'Unassigned',
        },

        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text: string, record: Ticket) => (
                <Space size="middle">
                    <Button>
                        <Link to={`../../ticket/${record.id}`}>Details</Link>
                    </Button>
                    {user.user_permissions.includes('change_ticket') ? (
                        <Button>
                            <Link to={`../../ticket/edit/${record.id}`}>
                                Edit Ticket
                            </Link>
                        </Button>
                    ) : null}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className={styles.header}>
                <Title>
                    {project.name[0].toUpperCase() + project.name.slice(1)}
                </Title>
                <Space size="middle">
                    <Button>
                        <Link to={`../../ticket/${project.id}/create`}>
                            Add Ticket
                        </Link>
                    </Button>
                    {user.user_permissions.includes(
                        'bugtracker.change_project',
                    ) ? (
                        <Button>
                            <Link to={`../edit/${project.id}`}>Edit</Link>
                        </Button>
                    ) : null}
                    {user.user_permissions.includes(
                        'bugtracker.delete_project',
                    ) ? (
                        <Popconfirm
                            placement="topRight"
                            onConfirm={() => deleteProject(project.id)}
                            title="Deleting This Project Will Also Delete All Tickets related to it. Are you sure you want to Continue?"
                        >
                            <Button danger>Delete</Button>
                        </Popconfirm>
                    ) : null}
                </Space>
            </div>

            <Title level={3}>Project Description</Title>
            <Text>{project.description}</Text>

            <Title level={3}>Project Manager</Title>
            <Text>{users[project.creator].username}</Text>

            <Title level={3}>Date Created</Title>
            <Text>{new Date(project.timestamp).toUTCString()}</Text>
            <div className={styles.detailsTables}>
                <Table
                    columns={columns}
                    dataSource={projectUsers}
                    bordered
                    title={() => 'Assignees'}
                    style={{ width: '100%', marginRight: '10px' }}
                    pagination={{
                        total: projectUsers.length,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} Assignees`,
                        defaultPageSize: 4,
                    }}
                    rowKey="id"
                />
                <Table
                    columns={ticketColumns}
                    dataSource={getProjectTickets(pId)}
                    bordered
                    title={() => 'Project Tickets'}
                    style={{ width: '100%', marginLeft: '10px' }}
                    pagination={{
                        total: getProjectTickets(pId).length,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} Tickets`,
                        defaultPageSize: 4,
                    }}
                    rowKey="id"
                />
            </div>
        </div>
    );
};

export default view(ProjectDetails);
