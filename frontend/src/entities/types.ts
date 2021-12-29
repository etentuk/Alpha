export type UserRole = 'ADMIN' | 'PROJECT_MANAGER' | 'DEVELOPER' | 'SUBMITTER';

export type User = {
    email: string;
    username: string;
    id: number;
    role: UserRole;
    user_permissions: string[];
    first_name: string;
    last_name: string;
};

export type Model = 'users' | 'projects' | 'tickets';

export type Project = {
    name: string;
    description: string;
    creator: number;
    assignees: number[];
    timestamp: string;
    id: number;
};

type History = {
    change: string;
    timestamp: string;
};

export type TicketComment = {
    commenter: number;
    ticket: number;
    message: string;
    timestamp: string;
    id: number;
};

export type Ticket = {
    title: string;
    description: string;
    assignee: number;
    type:
        | 'Bugs/Errors'
        | 'Feature Request'
        | 'Other Comments'
        | 'Training/Document Requests';
    status:
        | 'New'
        | 'Open'
        | 'In Progress'
        | 'Review'
        | 'Resolved'
        | 'Additional Info Required';
    priority: 'Low' | 'Medium' | 'High';
    project: number;
    timestamp: string;
    creator: number;
    id: number;
    ticket_history: History[];
    ticket_comments: TicketComment[];
};

export type AppState = {
    token: string;
    setToken: (token: string) => void;
    resetUser: () => void;
    setUser: (userDetails: User) => void;
    getProjectTickets: (id: number) => Ticket[];
    isLoaded: boolean;
    user: User;
    users: Record<number, User>;
    projects: Record<number, Project>;
    tickets: Record<number, Ticket>;
    delObject: (model: Model, id: number) => void;
    addTicketComment: (ticketId: number, comment: TicketComment) => void;
    editTicketComment: (ticketId: number, comment: TicketComment) => void;
    deleteTicketComment: (ticketId: number, commentId: number) => void;
    updateModel: (
        values: Partial<User | Project | TicketComment | Ticket>[],
        model: Model,
    ) => void;
    getUsersArray: () => User[];
};
