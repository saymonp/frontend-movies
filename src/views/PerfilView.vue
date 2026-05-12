<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Navbar from '@/components/Navbar.vue';
import IconStar from '@/components/icons/IconStar.vue';
import IconEditList from '@/components/icons/IconList.vue';
import type { ListaFilters, ListaPaginada } from '@/types/Listas';
import { useListaStore } from '@/stores/lista';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useReviewStore } from '@/stores/review';
import type { ReviewPaginada } from '@/types/Review';

const authStore = useAuthStore();
const { isAuthenticated, user } = storeToRefs(authStore);
const listaStore = useListaStore();
const reviewStore = useReviewStore();
const isSearching = ref(false);
const listas = ref<ListaPaginada>();
const reviews = ref<ReviewPaginada>();

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

const filterListas = ref<ListaFilters>({
  search: '',
  tags: [],
  orderBy: 'likes',
  user_only: false,
  top_listas: false,
  curadorias: false,
  mais_ativas: false,
  filterValue: 0
})
// Dados fictícios para o exemplo
const stats = ref({ watched: 128, reviews: 42 });


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

async function loadReviews() {
  // if (isSearching.value) return;

  isSearching.value = true;
  try {

    const response = await reviewStore.listReviews({ user_only: true });

    reviews.value = response;

  } catch (error) {
    console.error("Erro na comunicação com a API:", error);
  } finally {
    isSearching.value = false;
  }
};

onMounted(() => {
  try {
    loadListas();
    loadReviews();
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

const changeListaPage = (page: number) => {
  filterListas.value.page = page;
};

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
          <RouterLink to="/lista/criar"
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
        <!-- PAGINAÇÃO LISTAS -->
        <div v-if="listas" class="flex items-center justify-center gap-2 mt-10 mb-12">

          <!-- VOLTAR -->
          <button @click="changeListaPage(listas.current_page - 1)" :disabled="listas.current_page === 1"
            class="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-[#d919ff] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <IconChevronLeft class="w-4 h-4" />
          </button>

          <!-- PÁGINAS -->
          <div class="flex gap-1">
            <button v-for="page in listas.last_page" :key="page" @click="changeListaPage(page)"
              class="w-8 h-8 rounded-lg text-[10px] font-bold transition-all border" :class="listas.current_page === page
                ? 'bg-[#d919ff]/20 border-[#d919ff] text-[#d919ff]'
                : 'bg-white/5 border-white/10 text-zinc-500 hover:bg-white/10'">
              {{ page }}
            </button>
          </div>

          <!-- PRÓXIMO -->
          <button @click="changeListaPage(listas.current_page + 1)" :disabled="listas.current_page === listas.last_page"
            class="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-[#d919ff] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <IconChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="mt-10">
        <h3 class="text-zinc-100 font-bold uppercase text-sm tracking-widest mb-6 border-b border-white/10 pb-2">Minhas
          Reviews</h3>

        <div v-for="review in reviews?.data" class="flex flex-col gap-4">
          <div @click="abrirDetalheReview(review.id)"
            class="flex gap-4 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-[#00FCFF]/30 cursor-pointer transition-all group">
            <img v-if="review" :src="getImageUrl(review.movie.poster_thumb_br)"
              class="w-12 h-18 object-cover rounded-md shadow-lg">
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <h4 class="text-white font-bold text-sm">{{ review.titulo_br || review.titulo_original }}</h4>
                <span class="text-[#00FCFF] text-xs font-black">★ {{ review.rating }}</span>
              </div>
              <p class="text-zinc-400 text-xs line-clamp-2 mt-1">{{ review.comentario }}</p>
            </div>
          </div>


        </div>
      </div>
    </div>
  </div>

</template>