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
export const DB_AUTH = `${process.env.REACT_APP_DB_HOST}/dj-rest-auth/`;
export const DB_API = `${process.env.REACT_APP_DB_HOST}/api/`;
