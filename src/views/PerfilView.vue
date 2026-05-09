<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Navbar from '@/components/Navbar.vue';
import IconStar from '@/components/icons/IconStar.vue';
import IconEditList from '@/components/icons/IconList.vue';
import type { ListaPaginada } from '@/types/Listas';
import { useListaStore } from '@/stores/lista';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { isAuthenticated, user } = storeToRefs(authStore);
const listaStore = useListaStore();
const isSearching = ref(false);
const listas = ref<ListaPaginada>();

const getImageUrl = (path: string) => {
  if (!path) return '/placeholder.png';

  // Verifica se o path já é uma URL absoluta (começa com http:// ou https://)
  if (path.startsWith('http')) {
    return path;
  }

  // Se for caminho relativo, remove uma possível barra extra no início para evitar //
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;

  return `${import.meta.env.VITE_IMAGE_BASE_URL}${cleanPath}`;
};

// Dados fictícios para o exemplo
const stats = ref({ watched: 128, reviews: 42 });


const reviews = ref([
  { id: 101, movie: 'Blade Runner 2049', rating: 5, date: '2026-04-01', text: 'Visual estonteante...', poster: '/w500_49b7CTeJqugnpBboT6D5xGy3h4H.jpg' },
  { id: 102, movie: 'Máquina de Guerra', rating: 3, date: '2026-02-21', text: 'legal, contudo...', poster: '/w500_48h40o6Q97hZaqH0g7bOiXOrImX.jpg' },
]);

// Controle do Modal de Edição
const isEditModalVisible = ref(false);
const selectedReview = ref(null);

const abrirDetalheReview = (review: any) => {
  selectedReview.value = { ...review }; // Clonagem para não editar direto na lista antes de salvar
  isEditModalVisible.value = true;
};


async function loadListas() {
  if (isSearching.value) return;

  isSearching.value = true;
  try {

    const response = await listaStore.listListas({ user_only: true });

    const listaData = response;

    listas.value = listaData;

  } catch (error) {
    console.error("Erro na comunicação com a API:", error);
  } finally {
    isSearching.value = false;
  }
};

onMounted(() => {
  try {
    loadListas();
  } catch (error) {
    console.error("Erro ao carregar:", error);
  }
});

const movieStyles = [
  { zIndex: 'z-40', ml: '', opacity: 'opacity-100', hover: 'group-hover:-translate-y-2', ring: 'ring-2 ring-[#7075AB]' },
  { zIndex: 'z-30', ml: '-ml-2 sm:-ml-14 lg:-ml-16', opacity: 'opacity-90', hover: 'group-hover:-translate-y-1', ring: 'ring-1 ring-white/20' },
  { zIndex: 'z-20', ml: '-ml-4 sm:-ml-14 lg:-ml-16', opacity: 'opacity-80', hover: '', ring: 'ring-1 ring-white/10' },
  { zIndex: 'z-10', ml: '-ml-5 sm:-ml-14 lg:-ml-16', opacity: 'opacity-70', hover: '', ring: 'ring-1 ring-white/5' },
];
</script>

<template>
  <Navbar />
  <div class="bg-hero min-h-screen pt-24 pb-10">
    <div class="lg:max-w-3xl max-w-[95%] mx-auto relative z-30">
      <div class="flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl">
        <div class="w-20 h-20 rounded-full border-2 border-[#00FCFF] overflow-hidden">
          <img src="/image.png" class="object-cover w-full h-full">
        </div>

        <div class="flex flex-col gap-2">
          <h2 class="text-xl font-black text-white uppercase tracking-tighter">{{ user?.name }}</h2>
          <div class="flex gap-4">
            <div class="text-center">
              <p class="text-[#00FCFF] font-black text-lg">128</p>
              <p class="text-zinc-500 text-[10px] uppercase font-bold">Assistidos</p>
            </div>
            <div class="text-center border-l border-white/10 pl-4">
              <p class="text-[#00FCFF] font-black text-lg">42</p>
              <p class="text-zinc-500 text-[10px] uppercase font-bold">Reviews</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-10">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-zinc-100 font-bold uppercase text-sm tracking-widest">Minhas Listas</h3>
          <RouterLink to="/criar-lista"
            class="text-[#00FCFF] text-[10px] font-black uppercase border border-[#00FCFF]/30 px-3 py-1 rounded-full hover:bg-[#00FCFF]/10 transition-all">
            + Nova Lista
          </RouterLink>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="lista in listas?.data">
            <RouterLink :to="{
              name: 'ListView',
              params: {
                id: lista.id,
                slug: lista.slug
              }
            }">
              <div class="cursor-pointer hover:scale-105 transition-transform">
                <div>
                  <h4 class="text-white font-bold text-md p-2">{{ lista.titulo }}</h4>
                  <div class="flex items-center justify-center pl-1">
                    <template v-for="(style, index) in movieStyles" :key="index">
                      <!-- Só renderiza se o filme existir na lista -->
                      <div v-if="lista.movies[index]" class="relative w-28 sm:w-28 lg:w-32 transition-transform"
                        :class="[style.zIndex, style.ml, style.opacity, style.hover]">
                        <img :src="getImageUrl(lista.movies[index].poster_thumb_br)" class="w-full h-auto rounded-sm"
                          :class="[style.ring, index === 0 ? 'shadow-xl' : 'shadow-lg']">
                      </div>
                    </template>

                  </div>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="mt-10">
        <h3 class="text-zinc-100 font-bold uppercase text-sm tracking-widest mb-6 border-b border-white/10 pb-2">Minhas
          Reviews</h3>

        <div class="flex flex-col gap-4">
          <div @click="abrirDetalheReview(reviews[0])"
            class="flex gap-4 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-[#00FCFF]/30 cursor-pointer transition-all group">
            <img v-if="reviews[0]?.poster" :src="getImageUrl(reviews[0].poster)"
              class="w-12 h-18 object-cover rounded-md shadow-lg">
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <h4 class="text-white font-bold text-sm">{{ reviews[0]?.movie }}</h4>
                <span class="text-[#00FCFF] text-xs font-black">★ {{ reviews[0]?.rating }}</span>
              </div>
              <p class="text-zinc-400 text-xs line-clamp-2 mt-1">{{ reviews[0]?.text }}</p>
            </div>
          </div>
          <div @click="abrirDetalheReview(reviews[1])"
            class="flex gap-4 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-[#00FCFF]/30 cursor-pointer transition-all group">
            <img v-if="reviews[0]?.poster" :src="getImageUrl(reviews[0].poster)"
              class="w-12 h-18 object-cover rounded-md shadow-lg">
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <h4 class="text-white font-bold text-sm">{{ reviews[1]?.movie }}</h4>
                <span class="text-[#00FCFF] text-xs font-black">★ {{ reviews[1]?.rating }}</span>
              </div>
              <p class="text-zinc-400 text-xs line-clamp-2 mt-1">{{ reviews[1]?.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>