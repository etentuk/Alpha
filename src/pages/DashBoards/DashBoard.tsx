import React from 'react';
import './Dashboard.styles.css';
import { Column, ColumnConfig, Pie, PieConfig } from '@ant-design/charts';
import { Col } from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import { view } from '@risingstack/react-easy-state';
import appState from '../../store';

const Dashboard = () => {
    const { tickets, projects } = appState;
    const status: Record<string, any> = {
        New: {
            status: 'New',
            number: 0,
        },
        Open: {
            status: 'Open',
            number: 0,
        },
        'In Progress': {
            status: 'In Progress',
            number: 0,
        },
        Review: {
            status: 'Review',
            number: 0,
        },
        Resolved: {
            status: 'Resolved',
            number: 0,
        },
        'Additional Info Required': {
            status: 'Additional Info Required',
            number: 0,
        },
    };
    const type: Record<string, any> = {
        'Bugs/Errors': {
            type: 'Bugs/Errors',
            number: 0,
        },
        'Feature Request': {
            type: 'Feature Request',
            number: 0,
        },
        'Other Comments': {
            type: 'Other Comments',
            number: 0,
        },
        'Training/Document Requests': {
            type: 'Training/Document Requests',
            number: 0,
        },
    };
    const priority: Record<string, any> = {
        Low: {
            priority: 'Low',
            number: 0,
        },
        Medium: {
            priority: 'Medium',
            number: 0,
        },
        High: {
            priority: 'High',
            number: 0,
        },
    };

    const project: Record<any, any> = {};
    Object.values(cloneDeep(tickets)).forEach((t) => {
        if (Object.values(projects).length) {
            project[projects[t.project].name] = {
                project: projects[t.project].name,
                number:
                    project[projects[t.project].name] !== undefined
                        ? project[projects[t.project].name].number + 1
                        : 1,
            };
        }

        status[t.status].number += 1;
        type[t.type].number += 1;
        priority[t.priority].number += 1;
    });

    const getBarConfig = (
        xAxis: string,
        yAxis: string,
        data: any,
        content: string,
    ): ColumnConfig => ({
        data,
        xField: xAxis,
        yField: yAxis,
        seriesField: '',
        legend: false,

        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
            title: { text: `Tickets by ${content}` },
        },
    });

    const getDonutConfig = (
        angle: string,
        color: string,
        data: any,
        title: string,
    ): PieConfig => ({
        appendPadding: 10,
        data,
        angleField: angle,
        colorField: color,
        radius: 1,
        innerRadius: 0.6,
        label: {
            type: 'inner',
            offset: '-50%',
            content: '{value}',
            style: {
                textAlign: 'center',
                fontSize: 14,
            },
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
        statistic: {
            title: false,
            content: {
                style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '60%',
                },
                content: title,
            },
        },
    });

    return (
        <div
        className='charts'
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-evenly',
            }}
        >

            <Col className='column'>
                <Column
                    {...getBarConfig(
                        'priority',
                        'number',
                        Object.values(priority),
                        'Priority',
                    )}
                />

                <Pie
                    {...getDonutConfig(
                        'number',
                        'type',
                        Object.values(type),
                        'Tickets by Type',
                    )}
                />
            </Col>
            <Col className='column'>
                <Column
                    {...getBarConfig(
                        'status',
                        'number',
                        Object.values(status),
                        'Status',
                    )}
                />
                <Pie
                    {...getDonutConfig(
                        'number',
                        'project',
                        Object.values(project),
                        'Tickets by Project',
                    )}
                />
            </Col>
        </div>
    );
};

export default view(Dashboard);
