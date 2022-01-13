import axios from 'axios';
import { message } from 'antd';
import appState from '../store';
import { DB_API, DB_AUTH } from '../entities/constants';

const { resetUser, setToken } = appState;

const authSuccess = (key: string) => {
    setToken(key);
    const expirationDate = new Date(new Date().getTime() + 604800 * 1000); // 7 days
    localStorage.setItem('token', key);
    localStorage.setItem('expirationDate', JSON.stringify(expirationDate));
};

export const resetPassword = async (email: string) => {
    try {
        await axios.post(`${DB_AUTH}password/reset/`, {
            email,
        });
        return 'success';
    } catch (e: any) {
        return e.response.data;
    }
};

export const authPost = async (formData: any, url: string) => {
    try {
        await axios.post(`${DB_AUTH}${url}`, {
            ...formData,
        });
        return 'success';
    } catch (e: any) {
        return Error(e.response.data);
    }
};

export const authPostKeyReturn = async (formData: any, url: string) => {
    try {
        const {
            data: { key },
        } = await axios.post(`${DB_AUTH}${url}`, {
            ...formData,
        });
        authSuccess(key);
        return 'success';
    } catch (e: any) {
        console.log(e);
        return e;
    }
};

export const passwordResetConfirm = async (formData: {
    new_password1: string;
    new_password2: string;
    uid: string;
    token: string;
}) => {
    try {
        await axios.post(`${DB_AUTH}password/reset/confirm/`, {
            ...formData,
        });
        return 'success';
    } catch (e: any) {
        return e.response.data;
    }
};

export const logoutUser = async () => {
    try {
        appState.isLoaded = false;
        await axios.post(`${DB_AUTH}logout/`);
        setToken('');
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
        appState.isLoaded = true;
    } catch (e) {
        message.error('Error Logging Out, Refresh and try again');
        console.log('logoutUser Error', e);
    }
};

export const loggedInUser = async (): Promise<any> => {
    try {
        const { data } = await axios.get(`${DB_API}logged_in_user`);
        return data;
    } catch (e) {
        console.log(e);
        message.error('Error getting User, please log in again!');
        await logoutUser();
        return Error('Error getting User');
    }
};

export const setPassword = async (formData: {
    new_password1: string;
    new_password2: string;
    old_password: string;
}) => {
    try {
        await axios.post(`${DB_AUTH}password/change/`, { ...formData });
        return 'success';
    } catch (e: any) {
        console.log('Change Password Error', e);
        return Error(e.response.data.new_password2.join());
    }
};
