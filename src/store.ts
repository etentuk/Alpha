import { store } from '@risingstack/react-easy-state';
import { AppState, User } from './entities/types';

const initialUser: User = {
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    id: 0,
    role: 'SUBMITTER',
    user_permissions: [],
};

const appState: AppState = store({
    token: '',
    isLoaded: false,
    user: initialUser,
    users: {},
    projects: {},
    tickets: {},
    resetUser: () => {
        appState.user = initialUser;
    },
    setToken: (token) => (appState.token = token),
    setUser: (userDetails) => {
        appState.user = userDetails;
    },
    getProjectTickets: (id) =>
        Object.values(appState.tickets).filter((t) => t.project === id),
    updateModel: (values, collection) => {
        const reducer = (previousValue: any, currentValue: any) => ({
            ...previousValue,
            [currentValue.id]: {
                ...currentValue,
            },
        });
        appState[collection] = values.reduce(reducer, {});
    },
    addTicketComment: (ticketId, comment) => {
        appState.tickets[ticketId].ticket_comments.push(comment);
    },
    editTicketComment: (ticketId, comment) => {
        const index = appState.tickets[ticketId].ticket_comments.findIndex(
            (c) => c.id === comment.id,
        );
        appState.tickets[ticketId].ticket_comments.splice(index, 1, comment);
    },
    deleteTicketComment: (ticketId, commentId) => {
        const index = appState.tickets[ticketId].ticket_comments.findIndex(
            (c) => c.id === commentId,
        );
        appState.tickets[ticketId].ticket_comments.splice(index, 1);
    },
    delObject: (model, id) => {
        delete appState[model][id];
    },
    getUsersArray: () => Object.values(appState.users),
});

export default appState;
