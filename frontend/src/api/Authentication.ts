import axios from 'axios';
import { message } from 'antd';
import appState from '../store';

const { resetUser, setToken } = appState;

const authSuccess = (key: string) => {
    setToken(key);
    const expirationDate = new Date(new Date().getTime() + 604800 * 1000); // 7 days
    localStorage.setItem('token', key);
    localStorage.setItem('expirationDate', JSON.stringify(expirationDate));
};

export const resetPassword = async (email: string) => {
    try {
        await axios.post('http://127.0.0.1:8000/dj-rest-auth/password/reset/', {
            email,
        });
        return 'success';
    } catch (e: any) {
        return e.response.data;
    }
};

export const passwordResetConfirm = async (formData: {
    new_password1: string;
    new_password2: string;
    uid: string;
    token: string;
}) => {
    try {
        await axios.post(
            'http://127.0.0.1:8000/dj-rest-auth/password/reset/confirm/',
            {
                ...formData,
            },
        );
        return 'success';
    } catch (e: any) {
        return e.response.data;
    }
};

export const loginUser = async (username: string, password: string) => {
    try {
        const {
            data: { key },
        } = await axios.post('http://127.0.0.1:8000/dj-rest-auth/login/', {
            username,
            password,
        });
        authSuccess(key);
        return true;
    } catch (e) {
        console.log('loginUser Error', e);
        return false;
    }
};

export const logoutUser = async () => {
    try {
        resetUser();
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
        setToken('');
        await axios.post('http://127.0.0.1:8000/dj-rest-auth/logout/');
    } catch (e) {
        console.log('logoutUser Error', e);
    }
};

export const registerUser = async (formData: any) => {
    try {
        const {
            data: { key },
        } = await axios.post(
            'http://127.0.0.1:8000/dj-rest-auth/registration/',
            {
                ...formData,
            },
        );
        authSuccess(key);
        return 'successful';
    } catch (e: any) {
        console.log('Register User Error', e);
        return e.response.data;
    }
};

export const loggedInUser = async (): Promise<any> => {
    try {
        const { data } = await axios.get(
            'http://127.0.0.1:8000/api/logged_in_user',
        );
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
        await axios.post(
            'http://127.0.0.1:8000/dj-rest-auth/password/change/',
            { ...formData },
        );
        return 'success';
    } catch (e: any) {
        console.log('Change Password Error', e);
        return Error(e.response.data.new_password2.join());
    }
};
