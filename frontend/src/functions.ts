import { getDataList } from './api/dataReqs';
import appState from './store';
import { loggedInUser, logoutUser } from './api/Authentication';

const { updateModel, setToken, setUser } = appState;

const getModels = async (): Promise<boolean> => {
    const [projects, tickets, users, user] = await Promise.all([
        getDataList('project'),
        getDataList('ticket'),
        getDataList('user'),
        loggedInUser(),
    ]);
    updateModel(projects, 'projects');
    updateModel(tickets, 'tickets');
    updateModel(users, 'users');
    setUser(user);
    return true;
};

export const checkAuthTimeout = (expirationTime: number) => {
    setTimeout(async () => {
        await logoutUser();
    }, expirationTime * 1000);
};

const checkAuth = async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    if (!token) {
        await logoutUser;
        appState.isLoaded = true;
        return false;
    }
    const localExpirationDate = JSON.parse(
        localStorage.getItem('expirationDate') as string,
    );
    if (localExpirationDate) {
        const expirationDate = new Date(localExpirationDate);
        if (expirationDate !== undefined && expirationDate <= new Date()) {
            await logoutUser();
        } else {
            setToken(token);
            checkAuthTimeout(
                (expirationDate.getTime() - new Date().getTime()) / 1000,
            );
            return true;
        }
    } else {
        appState.isLoaded = true;
        await logoutUser();
        return false;
    }
    return false;
};

export { getModels, checkAuth };
