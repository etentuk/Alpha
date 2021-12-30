import React, { FC } from 'react';
import { Button, Form, message, Select, Table, Typography } from 'antd';
import { view } from '@risingstack/react-easy-state';
import appState from '../../store';
import { manageRole } from '../../api/dataReqs';

const ManageUserRoles: FC = () => {
    const { Title } = Typography;
    const { Option } = Select;

    const { getUsersArray } = appState;

    const [form] = Form.useForm();

    const children = getUsersArray().map((user) => (
        <Option value={user.id} key={user.username}>
            {user.username}
        </Option>
    ));

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
            key: 'id',
        },
    ];

    const saveRole = async (values: any) => {
        try {
            const res = await manageRole(values);
            appState.updateModel(res, 'users');
            form.resetFields();
            message.success('Successfully Changed User Roles!');
        } catch (e) {
            console.log(e);
            message.error('Save Unsuccessful, Refresh and try again!');
        }
    };

    const roles = ['ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'SUBMITTER'];

    const roleOptions = roles.map((r) => (
        <Option value={r} key={r}>
            {r}
        </Option>
    ));

    return (
        <div>
            <Title>Manage User Roles</Title>
            <Form
                name="manageUsers"
                onFinish={saveRole}
                layout="vertical"
                form={form}
            >
                <Form.Item
                    name="users"
                    label="Users"
                    rules={[
                        {
                            required: true,
                            message: 'Please select One or more Users',
                        },
                    ]}
                >
                    <Select
                        placeholder="Users"
                        mode="multiple"
                        optionFilterProp="children"
                    >
                        {children}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="role"
                    label="User Role"
                    rules={[
                        { required: true, message: 'Please select a Role' },
                    ]}
                >
                    <Select placeholder="User Roles">{roleOptions}</Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save User Role
                    </Button>
                </Form.Item>
            </Form>

            <Table
                style={{ marginTop: '20px' }}
                columns={columns}
                dataSource={getUsersArray()}
                bordered
                title={() => 'Assignees'}
                rowKey="id"
            />
        </div>
    );
};

export default view(ManageUserRoles);
