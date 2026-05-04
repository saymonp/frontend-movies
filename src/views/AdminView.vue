<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import Navbar from '@/components/Navbar.vue';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

// Estado para controlar qual aba está ativa
const activeTab = ref('Filmes');

// Definição das abas
const tabs = ['Filmes', 'Listas', 'Reviews', 'Usuários'];
</script>

<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
    <Navbar :loggedIn="true" />

    <main class="max-w-6xl mx-auto mt-10 p-6">
      <header class="mb-8">
        <h1 class="text-3xl font-black uppercase tracking-tighter text-[#00FCFF]">
          Painel Administrativo
        </h1>
        <p class="text-zinc-500 text-sm">Olá, {{ user?.name }}. Gerencie o conteúdo da plataforma.</p>
      </header>

      <!-- Menu de Abas (Tabs) -->
      <div class="flex border-b border-white/10 mb-8 overflow-x-auto">
        <button 
          v-for="tab in tabs" 
          :key="tab"
          @click="activeTab = tab"
          class="px-6 py-3 text-xs font-black uppercase tracking-widest transition-all relative"
          :class="activeTab === tab ? 'text-[#00FCFF]' : 'text-zinc-500 hover:text-zinc-300'"
        >
          {{ tab }}
          <!-- Linha indicadora ativa -->
          <div 
            v-if="activeTab === tab" 
            class="absolute bottom-0 left-0 w-full h-0.5 bg-[#00FCFF] shadow-[0_0_10px_#00FCFF]"
          ></div>
        </button>
      </div>

      <!-- Área de Conteúdo Dinâmico -->
      <section class="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        
        <div v-if="activeTab === 'Filmes'">
          <h2 class="text-xl font-bold mb-4">Gerenciamento de Filmes</h2>
          <p class="text-zinc-400">Aqui você poderá adicionar, editar ou remover filmes do catálogo.</p>
          <!-- Futuro Componente: <AdminMoviesTable /> -->
        </div>

        <div v-if="activeTab === 'Listas'">
          <h2 class="text-xl font-bold mb-4">Curadoria de Listas</h2>
          <p class="text-zinc-400">Monitore as listas criadas pelos usuários e destaque as melhores.</p>
        </div>

        <div v-if="activeTab === 'Reviews'">
          <h2 class="text-xl font-bold mb-4">Moderação de Reviews</h2>
          <p class="text-zinc-400">Analise denúncias e gerencie os comentários da comunidade.</p>
        </div>

        <div v-if="activeTab === 'Usuários'">
          <h2 class="text-xl font-bold mb-4">Controle de Usuários</h2>
          <p class="text-zinc-400">Gerencie permissões, banimentos e dados dos usuários.</p>
        </div>

      </section>
    </main>
  </div>
</template>

<style scoped>
/* Estilização opcional para scrollbar das abas em mobile */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 252, 255, 0.2);
  border-radius: 10px;
}
</style>