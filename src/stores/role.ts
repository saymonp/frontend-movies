// src/stores/auth.js
import { defineStore } from 'pinia';
import api from '@/services/api';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    slug: string;
    is_admin: boolean;
    roles: string[];
    permissions: string[];
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

interface AssignRoleResponse {
    message: string;
    user: string[];
}

export const useRoleStore = defineStore('role', {
    actions: {
        async assignRole(userId: number, roles: string[]): Promise<AssignRoleResponse> {
            // Enviamos como um objeto que contém a chave 'roles'
            const response = await api.post<AssignRoleResponse>(`admin/users/${userId}/roles`, {
                roles: roles
            });
            return response.data;
        },
        async listRoles(): Promise<Role[]> {
            const response = await api.get<Role[]>('admin/roles');
            return response.data;
        },
        async listUsers(): Promise<User[]> {
            const response = await api.get<User[]>('admin/users');
            return response.data;
        },
        async deleteUser(userId: number): Promise<any> {
            const response = await api.delete<any>(`admin/users/${userId}`);
            return response.data;
        },
        async listPermissions(): Promise<Role[]> { // Reutilizando a interface Role pois a estrutura é id/name
            const response = await api.get<Role[]>('admin/permissions');
            return response.data;
        },

        async assignPermissions(userId: number, permissions: string[]): Promise<any> {
            const response = await api.post(`admin/users/${userId}/permissions`, {
                permissions: permissions   
            });
            return response.data;
        },
    }
});