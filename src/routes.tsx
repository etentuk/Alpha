import React, { FC, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { view } from '@risingstack/react-easy-state';
import cloneDeep from 'lodash/cloneDeep';
import axios from 'axios';
import { AppContainer } from './components/AppContainer/AppContainer';
import Login from './pages/Authentication/Login';
import Register from './pages/Authentication/Register';
import ProjectForm from './pages/Project/ProjectForm';
import { checkAuth, getModels } from './functions';
import ProjectList from './pages/Project/ProjectList';
import ProjectDetails from './pages/Project/ProjectDetails';
import NotFound from './pages/NotFound';
import appState from './store';
import TicketForm from './pages/Ticket/TicketForm';
import TicketDetails from './pages/Ticket/TicketDetails';
import AppLoading from './components/AppLoading/AppLoading';
import TicketList from './pages/Ticket/TicketList';
import ManageUserRoles from './pages/Users/ManageUserRoles';
import Dashboard from './pages/DashBoards/DashBoard';
import UserProfile from './pages/Users/UserProfile';
import RequestPasswordReset from './pages/Authentication/RequestPasswordReset';
import PasswordReset from './pages/Authentication/PasswordReset';

const AppRoutes: FC = () => {
    const { user, token } = appState;

    useEffect(() => {
        (async () => {
            await checkAuth();
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (token) {
                axios.defaults.headers.common.Authorization = `Token ${token}`;
                appState.isLoaded = await getModels();
            } else {
                axios.defaults.headers.common.Authorization = '';
            }
        })();
    }, [token]);

    if (!appState.isLoaded) return <AppLoading />;

    return (
        <Routes>
            {token ? (
                <Route path="/" element={<AppContainer />}>
                    <Route path="" element={<Dashboard />} />
                    <Route path="project">
                        <Route path="" element={<ProjectList />} />
                        {cloneDeep(user.user_permissions).includes(
                            'bugtracker.add_project',
                        ) ? (
                            <>
                                <Route
                                    path="create"
                                    element={<ProjectForm page="Create" />}
                                />
                                <Route
                                    path="edit/:id"
                                    element={<ProjectForm page="Edit" />}
                                />
                            </>
                        ) : null}
                        <Route path=":id" element={<ProjectDetails />} />
                    </Route>
                    <Route path="ticket">
                        <Route path="" element={<TicketList />} />
                        <Route path=":id" element={<TicketDetails />} />

                        <Route
                            path=":projectId/create"
                            element={<TicketForm page="Create" />}
                        />
                        <Route
                            path="edit/:id"
                            element={<TicketForm page="Edit" />}
                        />
                    </Route>
                    {appState.user.user_permissions.includes(
                        'bugtracker.change_role',
                    ) ? (
                        <Route
                            path="manageroles"
                            element={<ManageUserRoles />}
                        />
                    ) : null}
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="/login" element={<Navigate to="/" />} />
                    <Route path="/register" element={<Navigate to="/" />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            ) : (
                <>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/request-password-reset"
                        element={<RequestPasswordReset />}
                    />
                    <Route
                        path="/password/reset/confirm/:uid/:token/"
                        element={<PasswordReset />}
                    />
                    <Route path="*" element={<Navigate to={'/login'} />} />
                </>
            )}
        </Routes>
    );
};

export default view(AppRoutes);
