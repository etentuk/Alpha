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

export const DB_HOST_DEV = 'http://127.0.0.1:8000';
export const DB_HOST_PROD = 'https://alpha-bugtracker.herokuapp.com';

export const DB_AUTH = `${DB_HOST_DEV}/dj-rest-auth/`;
export const DB_API = `${DB_HOST_DEV}/api/`;
