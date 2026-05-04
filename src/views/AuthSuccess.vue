<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
    const token = route.query.token;
    if (token) {
        authStore.setToken(token as any); // Salva o token e configura o axios
        router.push('/'); // Vai para a home do app
    } else {
        router.push('/login');
    }
});
</script>
<template>
    <p>Autenticando...</p>
</template>