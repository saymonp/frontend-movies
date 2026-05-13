<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoleStore } from '@/stores/role';
import type { User, Role } from '@/stores/role';

const roleStore = useRoleStore();
const users = ref<User[]>([]);
const availableRoles = ref<Role[]>([]);
const availablePermissions = ref<Role[]>([]); // Estrutura similar a Role
const isLoading = ref(false);

const loadData = async () => {
    isLoading.value = true;
    try {
        const [usersData, rolesData, permsData] = await Promise.all([
            roleStore.listUsers(),
            roleStore.listRoles(),
            roleStore.listPermissions()
        ]);
        users.value = usersData;
        availableRoles.value = rolesData;
        availablePermissions.value = permsData;
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    } finally {
        isLoading.value = false;
    }
};

const handleAssignRole = async (userId: number, currentRoles: string[]) => {
    try {
        await roleStore.assignRole(userId, currentRoles);
    } catch (error) {
        console.error("Erro ao atribuir papel:", error);
        await loadData();
    }
};

const handleAssignPermission = async (userId: number, currentPerms: string[]) => {
    try {
        await roleStore.assignPermissions(userId, currentPerms);
    } catch (error) {
        console.error("Erro ao atribuir permissão:", error);
        await loadData();
    }
};

const handleDeleteUser = async (userId: number) => {
    if (!confirm("Excluir usuário permanentemente?")) return;
    try {
        await roleStore.deleteUser(userId);
        users.value = users.value.filter(u => u.id !== userId);
    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
    }
};

onMounted(loadData);
</script>

<template>
    <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="border-b border-white/5 text-zinc-500 text-[10px] uppercase tracking-[0.2em]">
                    <th class="py-4 px-4 font-black">Usuário</th>
                    <th class="py-4 px-4 font-black">E-mail</th>
                    <th class="py-4 px-4 font-black">Configuração de Acessos</th>
                    <th class="py-4 px-4 font-black text-right">Ações</th>
                </tr>
            </thead>
            <tbody class="text-sm">
                <tr v-for="user in users" :key="user.id"
                    class="border-b border-white/5 hover:bg-white/[0.02] transition-colors">

                    <td class="py-4 px-4">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 shrink-0">
                                <span v-if="user.is_admin" class="text-[#00FCFF] font-black text-[10px]">A</span>
                                <span v-else class="text-zinc-600 font-black text-[10px]">U</span>
                            </div>
                            <div class="flex flex-col">
                                <span class="font-bold text-zinc-200">{{ user.name }}</span>
                                <span class="text-[9px] text-zinc-600 uppercase">ID: {{ user.id }}</span>
                            </div>
                        </div>
                    </td>

                    <td class="py-4 px-4 text-zinc-400">
                        {{ user.email }}
                    </td>

                    <td class="py-4 px-4">
                        <div class="flex flex-col gap-4 py-2">
                            <!-- SEÇÃO DE ROLES -->
                            <div>
                                <span class="text-[8px] text-zinc-500 uppercase font-black tracking-widest block mb-2">Papéis (Roles)</span>
                                <div class="flex flex-wrap gap-2">
                                    <label v-for="role in availableRoles" :key="role.id"
                                        class="flex items-center gap-1.5 bg-zinc-900/50 px-2 py-1 rounded border border-white/5 cursor-pointer hover:border-[#00FCFF]/30 transition-all">
                                        <input type="checkbox" :value="role.name" v-model="user.roles"
                                            @change="handleAssignRole(user.id, user.roles)"
                                            class="w-3 h-3 accent-[#00FCFF] bg-transparent">
                                        <span class="text-[9px] uppercase font-bold"
                                            :class="user.roles.includes(role.name) ? 'text-[#00FCFF]' : 'text-zinc-500'">
                                            {{ role.name }}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <!-- SEÇÃO DE PERMISSÕES DIRETAS -->
                            <div>
                                <span class="text-[8px] text-zinc-500 uppercase font-black tracking-widest block mb-2">Permissões Diretas</span>
                                <div class="flex flex-wrap gap-2">
                                    <label v-for="perm in availablePermissions" :key="perm.id"
                                        class="flex items-center gap-1.5 bg-zinc-900/50 px-2 py-1 rounded border border-white/5 cursor-pointer hover:border-emerald-500/30 transition-all">
                                        <input type="checkbox" :value="perm.name" v-model="user.permissions"
                                            @change="handleAssignPermission(user.id, user.permissions)"
                                            class="w-3 h-3 accent-emerald-500 bg-transparent">
                                        <span class="text-[9px] uppercase font-bold"
                                            :class="user.permissions.includes(perm.name) ? 'text-emerald-400' : 'text-zinc-600'">
                                            {{ perm.name }}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </td>

                    <td class="py-4 px-4 text-right">
                        <button @click="handleDeleteUser(user.id)"
                            class="px-3 py-1.5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all font-black text-[10px] uppercase">
                            [ X ]
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>