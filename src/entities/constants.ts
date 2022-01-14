export const ticketStatus = [
    'New',
    'Open',
    'In Progress',
    'Review',
    'Resolved',
    'Additional Info Required',
];

export const ticketType = [
    'Bugs/Errors',
    'Feature Request',
    'Other Comments',
    'Training/Document Requests',
];

export const ticketPriority = ['Low', 'Medium', 'High'];

export const userRoles = ['ADMIN', 'PROJECT_MANAGER', 'DEVELOPER', 'SUBMITTER'];

export const demoUsers = userRoles.map((r) => 'demo_' + r.toLowerCase());

let DB_HOST: string;

if (process.env.NODE_ENV === 'development')
    DB_HOST = process.env.REACT_APP_DB_HOST!;
else {
    DB_HOST = 'https://buggington.herokuapp.com/';
}
export const DB_AUTH = `${DB_HOST}dj-rest-auth/`;

export const DB_API = `${DB_HOST}api/`;
