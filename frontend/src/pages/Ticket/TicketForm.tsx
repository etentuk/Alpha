import React, { FC } from 'react';
import Title from 'antd/es/typography/Title';
import { Button, Form, Input, message, Select } from 'antd';
import { view } from '@risingstack/react-easy-state';
import { useNavigate, useParams } from 'react-router-dom';
import appState from '../../store';
import { createObject, editObject } from '../../api/dataReqs';
import { Ticket } from '../../entities/types';
import {
    ticketPriority,
    ticketStatus,
    ticketType,
} from '../../entities/constants';

interface TicketFormProps {
    page: 'Create' | 'Edit';
}

const TicketForm: FC<TicketFormProps> = ({ page }) => {
    const { getUsersArray, tickets } = appState;
    const navigate = useNavigate();

    const { projectId, id } = useParams();

    const tId = parseInt(id!, 10);
    if (!tickets[tId] && page === 'Edit') {
        location.href = '/error';
    }

    let ticket: Partial<Ticket> = {
        type: 'Bugs/Errors',
        status: 'New',
        priority: 'Low',
    };

    if (tickets[tId]) ticket = tickets[tId];

    const { TextArea } = Input;

    const selectInputs = [
        { name: 'type', values: ticketType },
        { name: 'status', values: ticketStatus },
        { name: 'priority', values: ticketPriority },
    ];

    const { Option } = Select;

    const renderSelectInputs = () =>
        selectInputs.map((select) => (
            <Form.Item
                name={select.name}
                label={select.name[0].toUpperCase() + select.name.slice(1)}
                key={select.name}
            >
                <Select
                    placeholder={`Ticket ${
                        select.name[0].toUpperCase() + select.name.slice(1)
                    }`}
                >
                    {select.values.map((val) => (
                        <Option value={val} key={val}>
                            {val}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
        ));

    const children = getUsersArray().map((user) => (
        <Option value={user.id} key={user.username}>
            {user.username}
        </Option>
    ));

    const saveTicket = (values: any) => {
        // eslint-disable-next-line default-case
        if (page === 'Create') {
            createObject('ticket', { ...values, project: projectId })
                .then((res) => {
                    appState.tickets[res.id] = res;
                    return navigate(`../${res.id}`);
                })
                .catch((e) => {
                    console.log(e);
                    message.error('Error Saving Ticket!').then(null);
                });
        } else if (page === 'Edit') {
            editObject('ticket', { ...ticket, ...values }, ticket.id as number)
                .then((res) => {
                    appState.tickets[res.id] = res;
                    return navigate(`../${res.id}`);
                })
                .catch((e) => {
                    console.log(e);
                    message.error('Error Saving Ticket!').then(null);
                });
        }
    };

    return (
        <div>
            <Title>{page} Ticket</Title>

            <Form
                name="ticket"
                onFinish={saveTicket}
                initialValues={ticket}
                layout="vertical"
            >
                <Form.Item
                    name="title"
                    label="Ticket Title"
                    rules={[
                        {
                            required: true,
                            message: 'Please provide a ticket Title!',
                        },
                    ]}
                >
                    <Input placeholder="Name of Ticket" />
                </Form.Item>
                <Form.Item name="description" label="Ticket Description">
                    <TextArea placeholder="Describe your Ticket" />
                </Form.Item>
                <Form.Item name="assignee" label="Assignee">
                    <Select
                        placeholder="Who's working?"
                        optionFilterProp="children"
                    >
                        {children}
                    </Select>
                </Form.Item>
                {renderSelectInputs()}
                <Button type="primary" htmlType="submit">
                    Save Ticket
                </Button>
            </Form>
        </div>
    );
};

export default view(TicketForm);
