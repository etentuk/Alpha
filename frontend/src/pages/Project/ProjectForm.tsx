import React, { FC } from 'react';
import { Button, Form, Input, message, Select, Typography } from 'antd';
import { view } from '@risingstack/react-easy-state';
import { useNavigate, useParams } from 'react-router-dom';
import appState from '../../store';
import { createObject, editObject } from '../../api/dataReqs';
import { Project } from '../../entities/types';

interface ProjectFormProps {
    page: 'Create' | 'Edit';
}

const ProjectForm: FC<ProjectFormProps> = ({ page }) => {
    const { getUsersArray, projects } = appState;
    const navigate = useNavigate();

    const { id } = useParams();
    const pId = parseInt(id!, 10);

    if (!projects[pId] && page === 'Edit') {
        location.href = '/error/404';
    }

    const { TextArea } = Input;
    const { Option } = Select;
    const { Title } = Typography;

    const users = getUsersArray();

    let project: Partial<Project> = {
        name: '',
        description: '',
        assignees: [],
    };

    project = { ...project, ...projects[pId] };

    const children = users.map((user) => (
        <Option value={user.id} key={user.username}>
            {user.username}
        </Option>
    ));

    const saveProject = (values: Partial<Project>) => {
        // eslint-disable-next-line default-case
        if (page === 'Create') {
            createObject('project', values)
                .then((res) => {
                    appState.projects[res.id] = res;
                    navigate(`../${res.id}`);
                })
                .catch((e) => {
                    console.log(e);
                    message
                        .error(
                            'Error Saving Project, Please refresh and Try again',
                        )
                        .then(null);
                });
        } else if (page === 'Edit') {
            editObject('project', values, project.id as number)
                .then((res) => {
                    appState.projects[res.id] = res;
                    navigate(`../${res.id}`);
                })
                .catch((e) => {
                    console.log(e);
                    message
                        .error(
                            'Error Saving Project, Please refresh and Try again',
                        )
                        .then(null);
                });
        }
    };

    return (
        <Form
            name="project"
            onFinish={saveProject}
            initialValues={{
                name: project.name ? project.name : '',
                description: project.description ? project.name : '',
                assignees: project.assignees ? project.assignees : [],
            }}
            layout="vertical"
        >
            <Title>{page} Project</Title>
            <Form.Item name="name" label="Project Name">
                <Input placeholder="What are you working on?" />
            </Form.Item>
            <Form.Item name="description" label="Project Description">
                <TextArea placeholder="Describe your project" />
            </Form.Item>
            <Form.Item name="assignees" label="Assignees">
                <Select
                    placeholder="Who's working on this project?"
                    mode="multiple"
                    optionFilterProp="children"
                >
                    {children}
                </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit">
                Save Project
            </Button>
        </Form>
    );
};

export default view(ProjectForm);
