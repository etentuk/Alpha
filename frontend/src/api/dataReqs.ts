import axios from 'axios';
import { UserRole } from '../entities/types';

type RouteModel = 'user' | 'project' | 'ticket' | 'comment';

export const getDataList = async (model: RouteModel): Promise<any[]> => {
    try {
        const { data } = await axios.get(`http://127.0.0.1:8000/api/${model}`);
        return data;
    } catch (e) {
        console.log(e);
        return [];
    }
};

export const deleteObject = async (
    model: RouteModel,
    id: number,
): Promise<boolean> => {
    try {
        await axios.delete(`http://127.0.0.1:8000/api/${model}/${id}/`);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};

export const createObject = async (
    model: RouteModel,
    formData: any,
): Promise<any> => {
    try {
        const { data } = await axios.post(
            `http://127.0.0.1:8000/api/${model}/`,
            {
                ...formData,
            },
        );
        return data;
    } catch (e) {
        console.log(e);
        return false;
    }
};

export const editObject = async (
    model: RouteModel,
    formData: any,
    id: number,
): Promise<any> => {
    try {
        const { data } = await axios.put(
            `http://127.0.0.1:8000/api/${model}/${id}/`,
            { ...formData },
        );
        return data;
    } catch (e) {
        console.log(e);
        return false;
    }
};

export const manageRole = async (formData: {
    role: UserRole;
    users: string[];
}) => {
    try {
        const { data } = await axios.put(
            'http://127.0.0.1:8000/api/change_roles',
            { ...formData },
        );
        return data;
    } catch (e) {
        console.log(e);
        return false;
    }
};
