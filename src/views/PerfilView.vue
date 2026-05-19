<script setup lang="ts">
import { computed, onMounted, ref, h } from 'vue';
import Navbar from '@/components/Navbar.vue';
import IconStar from '@/components/icons/IconStar.vue';
import IconEditList from '@/components/icons/IconList.vue';
import type { ListaFilters, ListaPaginada } from '@/types/Listas';
import { useListaStore } from '@/stores/lista';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useReviewStore } from '@/stores/review';
import type { ReviewPaginada, ReviewSummary } from '@/types/Review';
import ReviewDetalhe from '@/components/ReviewDetalhe.vue';
import { onClickOutside } from '@vueuse/core';
import IconNoMovies from '@/components/icons/IconNoMovies.vue';
import MoviePoster from '@/components/MoviePoster.vue';
import { getImageUrl } from '@/utils/imageHelper';
import IconNavHam from '@/components/icons/IconNavHam.vue'
import { useToast } from "vue-toastification";
import {  useRouter } from 'vue-router';

const toast = useToast();
const authStore = useAuthStore();
const { isAuthenticated, user } = storeToRefs(authStore);
const listaStore = useListaStore();
const reviewStore = useReviewStore();
const isSearching = ref(false);
const listas = ref<ListaPaginada>();
const reviews = ref<ReviewPaginada>();
const reviewSelecionada = ref<ReviewSummary>();
const target = ref(null);
const menuAberto = ref(false);
const router = useRouter();

const toggleMenu = (event: Event) => {
    event.preventDefault();
    menuAberto.value = !menuAberto.value;
};
onClickOutside(target, () => {
    menuAberto.value = false;
});

const filterListas = ref<ListaFilters>({
  page: 1
})
const filterReviews = ref({
  page: 1
});
// Dados fictícios para o exemplo
const stats = ref({ watched: 128, reviews: 42 });


// Controle do Modal de Edição
const isEditModalVisible = ref(false);

const abrirDetalheReview = (review: any) => {
  reviewSelecionada.value = { ...review };
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
  //if (isSearching.value) return;

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
async function deletarConta() {
  toast.warning({
    component: {
      render() {
        return h('div', { class: 'flex flex-col gap-2' }, [
          h('p', 'Tem certeza? Sua conta e todas as informações serão permanentemente deletadas.'),
          h('button', {
            class: 'mt-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1.5 px-3 rounded transition-colors align-self-start cursor-pointer',
            onClick: async () => {
              // 1. Fecha todos os toasts para limpar a tela
              toast.clear();
              
              // 2. Executa a ação de deletar
              try {
                isSearching.value = true;
                await authStore.deleteAccount();
                toast.success("Conta deletada com sucesso.");
              } catch (error) {
                toast.error("Erro ao deletar conta.");
              } finally {
                isSearching.value = false;
                router.push('/');
              }
            }
          }, 'Sim, deletar minha conta')
        ]);
      }
    }
  }, {
    timeout: 8000, // (8 segundos)
    closeOnClick: false, // Impede que o toast feche se o usuário clicar sem querer fora do botão
  });
}
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
const changeReviewPage = (page: number) => {
  filterReviews.value.page = page;
};

const handleLike = async (reviewId: number) => {
  isSearching.value = true;
  try {
    const likeResponse = await reviewStore.likeReview(reviewId);

    // 1. Encontra a review específica dentro do array data
    const review = reviews.value?.data.find(r => r.id === reviewId);

    // 2. Se encontrar, atualiza os campos reativamente
    if (review) {
      review.is_liked = likeResponse.is_liked;
      review.likes_count = likeResponse.likes_count;
    }

    // Se você também tiver o estado do modal (reviewSelecionada), atualize-o
    if (reviewSelecionada.value && reviewSelecionada.value.id === reviewId) {
      reviewSelecionada.value.is_liked = likeResponse.is_liked;
      reviewSelecionada.value.likes_count = likeResponse.likes_count;
    }

  } catch (error) {
    console.error("Erro na operação:", error);
  } finally {
    isSearching.value = false;
  }
};

const handleExcluir = async (reviewId: number) => {
  isSearching.value = true;
  try {

    const response = await reviewStore.deleteReview(reviewId);

    if (response.status == 200 && reviews.value) {
      reviews.value.data = reviews.value?.data.filter(reviews => reviews.id !== reviewId);
      isEditModalVisible.value = false;
    }
  } catch (error) {
    console.error("Erro na operação:", error);
  } finally {
    isSearching.value = false;
  }
};

// Conta filmes na lista padrão "watched"
const watchedCount = computed(() => {
  // Busca a lista que tem o slug 'watched' e is_default true
  if (!listas.value) {
    return 0;
  }
  const watchedList = listas.value.data.find(
    lista => lista.slug === 'watched' && lista.is_default
  );

  // Retorna a contagem de filmes dentro dessa lista (ajuste 'movies' para o nome da sua relação)
  return watchedList?.movies?.length || 0;
});

// Conta o total de reviews do usuário
const reviewsCount = computed(() => {
  return reviews.value?.data.length || 0;
});
</script>

<template>
  <Navbar />
  <div class="bg-hero min-h-screen pt-24 pb-10">
    <div class="lg:max-w-3xl max-w-[95%] mx-auto relative z-30">
      <div class="flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl">
        <div class="w-20 h-20 rounded-full border-2 border-[#00FCFF] overflow-hidden">
          <img src="/image.png" class="object-cover w-full h-full">
        </div>
        <div class="flex justify-between items-start w-full">
        <div class="flex-1 flex flex-col gap-2">
          <h2 class="text-xl font-black text-white uppercase tracking-tighter">{{ user?.name }}</h2>
          <div class="flex gap-4">
            <div class="text-center">
              <p class="text-[#00FCFF] font-black text-lg">
                {{ isSearching && !listas?.data.length ? '...' : watchedCount }}
              </p>
              <p class="text-zinc-500 text-[10px] uppercase font-bold">Assistidos</p>
            </div>
            <div class="text-center border-l border-white/10 pl-4">
              <p class="text-[#00FCFF] font-black text-lg">
                {{ isSearching && !reviews?.data.length ? '...' : reviewsCount }}
              </p>
              <p class="text-zinc-500 text-[10px] uppercase font-bold">Reviews</p>
            </div>
          </div>
         
        </div>
         <div v-if="isAuthenticated" class="relative flex-none">
                    <button @click="toggleMenu"
                        class="cursor-pointer block p-2.5 text-white no-underline ml-2.5 hover:text-[#00FCFF] transition-colors focus:outline-none">
                        <IconNavHam class="rotate-90 w-7 text-zinc-100" />
                    </button>

                    <Transition enter-active-class="transition duration-100 ease-out"
                        enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition duration-75 ease-in"
                        leave-from-class="transform scale-100 opacity-100"
                        leave-to-class="transform scale-95 opacity-0">
                        <div v-if="menuAberto" ref="target"
                            class="absolute right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl py-2 z-[200]">

                            <button @click="deletarConta"
                                class="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                                Deletar Conta
                            </button>
                <div v-if="user?.roles.includes('admin')">
                    <RouterLink to="/administrador"
                        class="block cursor-pointer p-2.5 text-white no-underline ml-2.5 hover:text-teal-400">
                        <a class="font-bold text-zinc-100">Administrador</a>
                    </RouterLink>
                  </div>
                </div>
                </Transition>
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
          <div v-for="lista in listas?.data" :key="lista.id">
            <RouterLink :to="{
              name: 'ListView',
              params: { id: lista.id, slug: lista.slug }
            }">
              <div class="cursor-pointer hover:scale-105 transition-transform">
                <div>
                  <h4 class="text-white font-bold text-md p-2">{{ lista.titulo }}</h4>

                  <div class="flex items-center justify-center pl-1">
                    <!-- 1. Caso existam filmes -->
                    <template v-if="lista.movies && lista.movies.length > 0">
                      <template v-for="(style, index) in movieStyles" :key="index">
                        <div v-if="lista.movies[index]" class="relative w-28 sm:w-28 lg:w-32 transition-transform"
                          :class="[style.zIndex, style.ml, style.opacity, style.hover]">
                          <MoviePoster :path="getImageUrl(lista.movies[index].poster_thumb_br)"
                            class="w-full h-auto rounded-sm"
                            :class="[style.ring, index === 0 ? 'shadow-xl' : 'shadow-lg']" />
                        </div>
                      </template>
                    </template>

                    <!-- 2. Placeholder (Caso a lista esteja vazia) -->
                    <div v-else
                      class="flex flex-col items-center justify-center w-full min-h-[160px] bg-white/5 border-2 border-dashed border-white/10 rounded-xl">
                      <IconNoMovies />
                      <span class="text-white/30 text-xs font-medium">Lista vazia</span>

                    </div>

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

        <div v-for="review in reviews?.data" :key="review.id" class="flex flex-col gap-4">
          <ReviewDetalhe ref="target" :is-open="isEditModalVisible" :review="review" @close="isEditModalVisible = false"
            @like="handleLike" @excluir="handleExcluir" />
          <div @click="abrirDetalheReview(review.id)"
            class="flex gap-4 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-[#00FCFF]/30 cursor-pointer transition-all group">

            <MoviePoster v-if="review" :path="getImageUrl(review.movie.poster_thumb_br)"
              class="w-12 h-18 object-cover rounded-md shadow-lg" />

            <div class="flex-1 flex flex-col">
              <div class="flex justify-between items-start">
                <h4 class="text-white font-bold text-sm">{{ review.movie.titulo_br || review.movie.titulo_original }}
                </h4>
                <span class="text-[#00FCFF] text-xs font-black">★ {{ review.rating }}</span>
              </div>

              <p class="text-zinc-400 text-xs line-clamp-2 mt-1">{{ review.comentario }}</p>

              <div class="flex justify-end mt-auto">
                <p v-if="review.likes_count >= 1" class="text-zinc-500 text-[10px] uppercase">
                  <span class="font-black text-zinc-300">{{ review.likes_count }}</span> Likes
                </p>
              </div>

            </div>
          </div>
        </div>
        <!-- PAGINAÇÃO REVIEWS -->
        <div v-if="reviews" class="flex items-center justify-center gap-2 mt-10 mb-12">

          <!-- VOLTAR -->
          <button @click="changeListaPage(reviews.current_page - 1)" :disabled="reviews.current_page === 1"
            class="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-[#d919ff] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <IconChevronLeft class="w-4 h-4" />
          </button>

          <!-- PÁGINAS -->
          <div class="flex gap-1">
            <button v-for="page in reviews.last_page" :key="page" @click="changeListaPage(page)"
              class="w-8 h-8 rounded-lg text-[10px] font-bold transition-all border" :class="reviews.current_page === page
                ? 'bg-[#d919ff]/20 border-[#d919ff] text-[#d919ff]'
                : 'bg-white/5 border-white/10 text-zinc-500 hover:bg-white/10'">
              {{ page }}
            </button>
          </div>

          <!-- PRÓXIMO -->
          <button @click="changeListaPage(reviews.current_page + 1)"
            :disabled="reviews.current_page === reviews.last_page"
            class="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-[#d919ff] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <IconChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>

</template>