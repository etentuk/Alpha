import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, message, Space, Timeline, Typography } from 'antd';
import { view } from '@risingstack/react-easy-state';
import appState from '../../store';
import { deleteObject } from '../../api/dataReqs';
import styles from './ticket.module.css';
import TicketCommentComponent from './TicketComments';

const TicketDetails = () => {
    const navigate = useNavigate();
    const { tickets, delObject, users, isLoaded } = appState;
    const { Title, Text } = Typography;
    const { id } = useParams();

    const tId = parseInt(id!, 10);

    if (!tickets[tId] && isLoaded) {
        location.href = '/error';
    }

    const ticket = tickets[tId];

    const del = async (ticketId: number) => {
        try {
            await deleteObject('ticket', ticketId);
            delObject('tickets', ticketId);
            navigate('../');
        } catch (e) {
            message.error(
                'An Error Occurred While Deleting, Please Refresh and Try again',
            );
            console.log(e);
        }
    };

    const assignee = users[ticket.assignee]
        ? users[ticket.assignee].username
        : 'Unassigned';

    return (
        <div>
            <div className={styles.header}>
                <Title>
                    {ticket.title[0].toUpperCase() + ticket.title.slice(1)}
                </Title>
                <Space size="middle">
                    <Button>
                        <Link to={`../edit/${ticket.id}`}>Edit</Link>
                    </Button>
                    <Button danger onClick={() => del(ticket.id!)}>
                        Delete
                    </Button>
                </Space>
            </div>

            <div className={styles.ticketDetailsBody}>
                <div>
                    <div className={styles.ticketDetailsRow}>
                        <div className={styles.ticketDetailsTextLeft}>
                            <Title level={3}>Ticket Description</Title>
                            <Text>{ticket.description}</Text>
                        </div>
                        <div className={styles.ticketDetailsTextRight}>
                            <Title level={3}>Ticket Type</Title>
                            <Text>{ticket.type}</Text>
                        </div>
                    </div>
                    <div className={styles.ticketDetailsRow}>
                        <div className={styles.ticketDetailsTextLeft}>
                            <Title level={3}>Assigned To</Title>
                            <Text>{assignee}</Text>
                        </div>
                        <div className={styles.ticketDetailsTextRight}>
                            <Title level={3}>Ticket Priority</Title>
                            <Text>{ticket.priority}</Text>
                        </div>
                    </div>
                    <div className={styles.ticketDetailsRow}>
                        <div className={styles.ticketDetailsTextLeft}>
                            <Title level={3}>Ticket Status</Title>
                            <Text>{ticket.status}</Text>
                        </div>
                        <div className={styles.ticketDetailsTextRight}>
                            <Title level={3}>Date Created</Title>
                            <Text>
                                {new Date(ticket.timestamp).toUTCString()}
                            </Text>
                        </div>
                    </div>
                    <div className={styles.ticketExtras}>
                        <div style={{ width: '45%' }}>
                            <TicketCommentComponent ticketID={ticket.id} />
                        </div>
                        <div style={{ width: '45%', overflow: 'auto' }}>
                            <Card
                                style={{ minHeight: '100%', overflow: 'auto' }}
                            >
                                <Title level={3}>Ticket History</Title>
                                <Timeline mode="left">
                                    {ticket.ticket_history.map((h) => (
                                        <Timeline.Item
                                            className={styles.bottomRow}
                                            key={(
                                                Math.random() * 1000
                                            ).toString()}
                                            label={new Date(
                                                h.timestamp,
                                            ).toUTCString()}
                                        >
                                            {h.change}
                                        </Timeline.Item>
                                    ))}
                                </Timeline>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default view(TicketDetails);
