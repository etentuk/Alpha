import React, { FC, useState } from 'react';
import Title from 'antd/es/typography/Title';
import { Button, Card, Form, message, Modal, Space, Table } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { view } from '@risingstack/react-easy-state';
import { useForm } from 'antd/es/form/Form';
import cloneDeep from 'lodash/cloneDeep';
import appState from '../../store';
import { TicketComment } from '../../entities/types';
import { createObject, deleteObject, editObject } from '../../api/dataReqs';

interface TicketCommentViewProps {
    ticketID: number;
}

const TicketCommentComponent: FC<TicketCommentViewProps> = ({ ticketID }) => {
    const {
        users,
        deleteTicketComment,
        addTicketComment,
        editTicketComment,
        tickets,
        user,
    } = appState;
    const [comment, setComment] = useState('');
    const [commentEditId, setCommentEditId] = useState(0);
    const [visible, setVisible] = useState(false);
    const [form] = useForm();
    const deleteComment = async (id: number) => {
        try {
            await deleteObject('comment', id);
            deleteTicketComment(ticketID, id);
            message.success('Successfully Deleted Comment');
        } catch (e) {
            console.log(e);
            message.error('Deleting Failed, Try Again');
        }
    };

    const setEditModal = (m: string, id: number) => {
        setVisible(true);
        setComment(m);
        setCommentEditId(id);
    };

    const cancelModal = () => {
        setComment('');
        setVisible(false);
        setCommentEditId(0);
    };

    const EditComment = async () => {
        try {
            const res = await editObject(
                'comment',
                {
                    message: comment,
                    ticket: ticketID,
                    commenter: user.id,
                },
                commentEditId,
            );
            editTicketComment(ticketID, res);
            cancelModal();
            message.success('Successfully Edited Comment');
        } catch (e) {
            console.log(e);
            message.error('Unable to Edit Comment, Refresh and try again.');
        }
    };

    const columns = [
        {
            title: 'Commenter',
            dataIndex: 'commenter',
            key: 'commenter',
            render: (text: string, record: TicketComment) =>
                users[record.commenter].username,
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
        },
        {
            title: 'Date Created',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (text: string, record: TicketComment) =>
                new Date(record.timestamp).toUTCString(),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text: string, record: TicketComment) => (
                <Space>
                    {user.role === 'ADMIN' || user.id === record.commenter ? (
                        <>
                            <Button
                                onClick={() =>
                                    setEditModal(record.message, record.id)
                                }
                            >
                                Edit
                            </Button>
                            <Button
                                danger
                                onClick={() => deleteComment(record.id)}
                            >
                                Delete
                            </Button>
                        </>
                    ) : null}
                </Space>
            ),
        },
    ];

    const saveComment = async (value: any) => {
        try {
            const res = await createObject('comment', {
                ...value,
                ticket: ticketID,
            });
            addTicketComment(ticketID, res);
            form.resetFields();
            message.success('Added New Comment');
        } catch (e) {
            console.log(e);
            message.error('Unable to Save Comment, Refresh and try again.');
        }
    };

    return (
        <Card>
            <Title level={3}>Comments</Title>
            <Form
                name="commentForm"
                layout="vertical"
                onFinish={saveComment}
                form={form}
            >
                <Form.Item
                    label="Leave A Comment?"
                    name="message"
                    rules={[
                        {
                            required: true,
                            message: 'Please select a Role',
                        },
                    ]}
                >
                    <TextArea />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Post
                    </Button>
                </Form.Item>
            </Form>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={cloneDeep(tickets[ticketID].ticket_comments)}
                pagination={{
                    total: cloneDeep(tickets[ticketID].ticket_comments).length,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} Comments`,
                    defaultPageSize: 5,
                }}
            />
            <Modal
                title="Edit Comment"
                visible={visible}
                onCancel={cancelModal}
                onOk={EditComment}
            >
                <TextArea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </Modal>
        </Card>
    );
};

export default view(TicketCommentComponent);
