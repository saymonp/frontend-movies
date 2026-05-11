<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import IconAddToList from '@/components/icons/IconAddToList.vue'
import IconStar from '@/components/icons/IconStar.vue';
import IconReviewStar from '@/components/icons/IconReviewStar.vue';
import TheFooter from '@/components/TheFooter.vue';
import Navbar from '@/components/Navbar.vue';
import { onClickOutside } from '@vueuse/core'
import SearchBarHome from '@/components/SearchBarHome.vue';
import { useAuthStore } from '@/stores/auth';
import { useMovieStore } from '@/stores/movie';
import SearchBarListas from '@/components/SearchBarListas.vue';
import { storeToRefs } from 'pinia';
import type { DinamicMovieInsertionResponse, GeneroResponse, DiretorResponse, MovieIndex, MovieFilters, MovieIndexResponse } from '@/types/Movies';
import type { ListaFilters } from '@/types/Listas';
import i18n from '@/i18n';
import { useListaStore } from '@/stores/lista';


const authStore = useAuthStore();
const movieStore = useMovieStore();
const listaStore = useListaStore();
// transforma as propriedades em Refs, permitindo o uso de .value
const { isAuthenticated, user } = storeToRefs(authStore);

const isResettingFilters = ref(false);
const target = ref(null);

const isSearching = ref(false);
const listas = ref();
const generos = ref<GeneroResponse[]>([]);
const diretores = ref<DiretorResponse[]>([]);
const idiomasDisponiveis = ref<string[]>([]);
const hasLoadedListas = ref(false);
const searchMode = ref('movies')

const filterMovies = ref<MovieFilters>({
    destaque: true,
    lang: 'pt-BR',
    search: undefined,
    generos: [] as number[],
    ano: undefined,
    diretores: [] as number[],  // Array de IDs
    idioma: undefined,       // Sigla do idioma (ex: 'en', 'es')
    recentes: undefined,
    bilheteria: undefined,
    page: 1,
});
const filterListas = ref<ListaFilters>({
    search: '',
    tags: [],
    orderBy: 'likes',
    privacy: 'publicas',
    top_listas: false,
    curadorias: false,
    mais_ativas: false
})
// Função que observa mudanças e recarrega os filmes
watch(
    () => ({ ...filterMovies.value }),
    (newVal: any, oldVal) => {
        if (isSearching.value || isResettingFilters.value) return;

        // Verifica se o que mudou foi algo além da página
        const changedOtherThanPage = Object.keys(newVal).some(
            key => key !== 'page' && JSON.stringify(newVal[key]) !== JSON.stringify(oldVal[key])
        );

        if (changedOtherThanPage) {
            // Se mudou um filtro, resetamos a página
            filterMovies.value.page = 1;
            // IMPORTANTE: Não damos 'return' aqui. 
            // Chamamos o loadMovies com o objeto atualizado (já com page: 1)
        }

        console.log("Executando carga de filmes com:", filterMovies.value);
        loadMovies(filterMovies.value);
    },
    { deep: true }
);
// Função que observa mudanças e recarrega as Listas
watch(
    () => ({ ...filterListas.value }),
    (newVal, oldVal) => {

        if (isSearching.value || isResettingFilters.value) return;

        // Verifica se mudou algo além da página
        const changedOtherThanPage = Object.keys(newVal).some(
            key =>
                key !== 'page' &&
                JSON.stringify(newVal[key as keyof typeof newVal]) !==
                JSON.stringify(oldVal[key as keyof typeof oldVal])
        );

        // Se mudou filtro, reseta paginação
        if (changedOtherThanPage) {
            filterListas.value.page = 1;
        }

        console.log(
            "Executando carga de listas com:",
            filterListas.value
        );

        loadListas(filterListas.value);
    },
    { deep: true }
);

// Watch para carregar as listas, inicialmente
watch(searchMode, async (mode) => {

    if (mode === 'lists' && !hasLoadedListas.value) {

        hasLoadedListas.value = true;

        await loadListas(filterListas.value);
    }
});

const resetFilters = async () => {
    isResettingFilters.value = true;

    filterValue.value = 0;

    filterMovies.value = {
        destaque: false,
        lang: 'pt-BR',
        search: filterMovies.value.search, // mantém busca
        generos: [],
        ano: undefined,
        diretores: [],
        idioma: undefined,
        recentes: undefined,
        bilheteria: undefined,
        page: 1,
    };

    await nextTick();

    isResettingFilters.value = false;
};

// const movies = ref<MovieIndexResponse>();
// Se MovieIndexResponse for o objeto que contém { data: [...] }
const movies = ref<MovieIndexResponse | DinamicMovieInsertionResponse>();

async function loadMovies(filters: MovieFilters) {
    if (isSearching.value) return;

    isSearching.value = true;
    try {
        const response = await movieStore.listMovies(filters);

        // O TypeScript agora entende o que há dentro de 'response'
        if (isImportingResponse(response)) {
            await resetFilters();
            const tempMovie = {
                id: response.id,
                tmdb: response.tmdb_id,
                titulo_br: response.temp_result.title, // Mudado de title_br para titulo_br
                poster_thumb_br: "https://image.tmdb.org/t/p/w500" + response.temp_result.poster_path,
                rating: response.temp_result.vote_average,
                year: response.temp_result.release_date?.split('-')[0],
                is_importing: true,
                slug_pt: 'temp-movie',
                slug_en: 'temp-movie'
            };

            // @ts-ignore
            movies.value = { data: [tempMovie] };
            console.log(tempMovie);
        } else {
            // Aqui o TS sabe que é MovieIndexResponse
            movies.value = response;
        }
    } catch (error) {
        console.error("Erro na busca:", error);
    } finally {
        isSearching.value = false;
    }
};

async function loadListas(filters: ListaFilters) {
    if (isSearching.value) return;

    isSearching.value = true;
    try {
        let userListas = false;
        if (filters.privacy == 'minhas') {
            userListas = true;
        }
        if (filters.privacy == 'publicas') {
            userListas = false;
        }
        const response = await listaStore.listListas({ search: filters, user_only: userListas });

        listas.value = response;
    } catch (error) {
        console.error("Erro na busca:", error);
    } finally {
        isSearching.value = false;
    }
}
// Função para checar se a resposta é de importação
function isImportingResponse(res: any): res is DinamicMovieInsertionResponse {
    return res && res.status === 'processando';
}

async function loadGenres() {
    generos.value = await movieStore.listGenres();
}
async function loadDirectors() {
    diretores.value = await movieStore.listDirectors();
}
async function loadIdioms() {
    idiomasDisponiveis.value = await movieStore.listIdioms();
}

onMounted(() => {
    try {
        loadMovies(filterMovies.value);
        loadGenres();
        loadDirectors();
        loadIdioms();
    } catch (error) {
        console.error("Erro ao carregar:", error);
    }
});

const filterRating = ref(0)
const showFilter = ref(false)
onClickOutside(target, () => (showFilter.value = false))


const filterValue = ref(0);

const isCardReviewVisible = ref(false);
//const rating = ref(0);
const hoverRating = ref(0);
const selectedMovieTitle = ref(''); // Para mostrar o nome do filme no modal

const selectRating = (star: number) => {
    rating.value = star;
};

const activeReviewId = ref<number | null>(null);
const rating = ref(0);

const toggleQuickReview = (id: number) => {
    // Se clicar no mesmo, fecha. Se clicar em outro, abre o novo.
    activeReviewId.value = activeReviewId.value === id ? null : id;
    rating.value = 0; // Reseta a nota ao abrir
};
const changeListaPage = (page: number) => {
    filterListas.value.page = page;
};
const activeListId = ref<number | null>(null);
const minhasListas = ref([
    { id: 1, nome: 'Adrenalina Pura', selecionada: false },
    { id: 2, nome: 'Filmes de Conforto', selecionada: false },
    { id: 3, nome: 'Para ver depois', selecionada: true }
]);

const toggleAddToList = (id: number) => {
    // Fecha o de review se estiver aberto e abre o de listas
    activeReviewId.value = null;
    activeListId.value = activeListId.value === id ? null : id;
};

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

const movieListSection = ref<HTMLElement | null>(null);

const changePage = (newPage: number) => {
    // Correção: Para validar a última página, use last_page (número) e não last_page_url (string)
    // @ts-ignore
    if (newPage < 1 || newPage > (movies.value?.last_page || 1)) return;

    filterMovies.value.page = newPage;

    // Pequeno delay para garantir que o Vue iniciou a atualização do DOM
    nextTick(() => {
        if (movieListSection.value) {
            const yOffset = -150; // Ajuste este valor para controlar a altura (negativo sobe mais, positivo desce)
            const element = movieListSection.value;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    });
};

const getMovieParam = (movie: any) => {
    // Pega o slug de acordo com o idioma
    const slug = (i18n as any).locale === 'br' ? movie.slug_pt : movie.slug_en;

    // Se não houver slug (nulo ou vazio), retorna apenas o ID
    if (!slug || slug.trim() === '') {
        return String(movie.id);
    }

    // Retorna o formato 235-nome-do-filme
    return `${movie.id}-${slug}`;
};

const movieStyles = [
  { zIndex: 'z-40', ml: '', opacity: 'opacity-100', hover: 'group-hover:-translate-y-2', ring: 'ring-2 ring-[#7075AB]' },
  { zIndex: 'z-30', ml: '-ml-2 sm:-ml-14 lg:-ml-16', opacity: 'opacity-90', hover: 'group-hover:-translate-y-1', ring: 'ring-1 ring-white/20' },
  { zIndex: 'z-20', ml: '-ml-4 sm:-ml-14 lg:-ml-16', opacity: 'opacity-80', hover: '', ring: 'ring-1 ring-white/10' },
  { zIndex: 'z-10', ml: '-ml-5 sm:-ml-14 lg:-ml-16', opacity: 'opacity-70', hover: '', ring: 'ring-1 ring-white/5' },
];
</script>

<template>
    <div class="bg-zinc-50 dark:bg-zinc-900">
        <Navbar :loggedIn="isAuthenticated" />
        <div class="bg-hero">

            <div class="relative z-10 w-full h-auto">

                <div class="relative w-full h-auto overflow-hidden">

                    <div
                        class="relative w-full h-auto mx-auto sm:h-[450px] mask-[linear-gradient(to_bottom,black_55%,transparent_100%)] sm:mask-[linear-gradient(to_bottom,black_70%,transparent_100%)]">
                        <div class="absolute inset-0 bg-[#CC00CC] opacity-20"></div>
                        <div class="absolute inset-0 bg-[#CC00CC]"></div>

                        <img src="/Banner.jpg" class="relative w-full h-full object-cover opacity-73" />
                    </div>

                    <img src="/LogoFilmeiro.svg" alt="Logo"
                        class="sm:hidden absolute top-4/5 left-1/2 -translate-x-1/2 -translate-y-1/2 w-65 z-10" />

                    <div class="hidden sm:flex absolute bottom-10 left-0 w-full flex-col items-center z-20">
                        <p class="text-white text-3xl text-center font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                            Registre os filmes que você assistiu.
                        </p>
                        <p
                            class="text-[#00FCFF] text-xl text-center font-bold mt-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                            Crie listas para salvar seus filmes favoritos.
                        </p>
                        <RouterLink to="/perfil">
                            <button class="mt-6 bg-[#00FCFF] text-black font-bold py-3 px-10 rounded-md 
                transition-all duration-300
                shadow-[0_0_15px_rgba(0,252,255,0.8)]
                hover:shadow-[0_0_30px_rgba(0,252,255,1)]
                hover:scale-105 active:scale-95">
                                {{ isAuthenticated ? "Acesse suas Listas" : "Comece agora — É Grátis" }}
                            </button>
                        </RouterLink>
                    </div>
                </div>

                <div class="sm:hidden">
                    <div class="max-w-9/10 mx-auto">
                        <p class="text-white text-2xl text-center font-bold mt-1 mb-3">
                            Registre os filmes que você assistiu.
                        </p>
                        <p class="text-white text-2xl text-center font-bold">
                            Crie listas para salvar seus filmes favoritos
                        </p>
                    </div>

                    <div class="text-center max-w-9/10 mx-auto mt-5">
                        <RouterLink to="/perfil">
                            <button class="bg-[#00FCFF] text-black font-bold py-2 px-6 rounded-md 
                transition-all duration-300
                shadow-[0_0_15px_rgba(0,252,255,0.8)]
                hover:scale-105 active:scale-95">
                                {{ !!isAuthenticated === true ? "Acesse suas Listas" : "Comece agora — É Grátis" }}
                            </button>
                        </RouterLink>
                    </div>
                </div>
                <div class="lg:max-w-3xl max-w-13/14 mx-auto mt-10">
                    <div class="flex gap-4 mb-3 ml-2">
                        <button @click="searchMode = 'movies'"
                            :class="searchMode === 'movies' ? 'text-[#00FCFF] border-b-2 border-[#00FCFF]' : 'text-zinc-500 hover:text-zinc-300'"
                            class="text-[10px] font-black uppercase tracking-[0.2em] pb-1 transition-all cursor-pointer">
                            Filmes
                        </button>
                        <button @click="searchMode = 'lists'"
                            :class="searchMode === 'lists' ? 'text-[#d919ff] border-b-2 border-[#d919ff]' : 'text-zinc-500 hover:text-zinc-300'"
                            class="text-[10px] font-black uppercase tracking-[0.2em] pb-1 transition-all cursor-pointer">
                            Listas
                        </button>
                    </div>
                    <SearchBarHome v-if="searchMode == 'movies'" v-model:filterMovies="filterMovies" :generos="generos"
                        :diretores="diretores" :idiomas="idiomasDisponiveis" :isSearching="isSearching"
                        v-model:filterValue="filterValue" @search="loadMovies(filterMovies)" />
                    <SearchBarListas v-if="searchMode == 'lists'" v-model:filters="filterListas"
                        :isSearching="isSearching" v-model:filterValue="filterValue" />
                </div>
                <TransitionGroup v-if="searchMode == 'movies'" tag="section" name="list"
                    class="grid grid-cols-2 sm:grid-cols-4 max-w-3xl mt-3 gap-5 p-2.5 mx-auto">
                    <div v-if="movies && (movies as any).data"
                        v-for="movie in (movies as any)?.data?.filter((elemento: any) => elemento.rating >= filterValue)"
                        :key="movie.id" class="relative flex flex-col items-center w-full">


                        <RouterLink :to="{
                            name: 'MovieView',
                            params: {
                                lang: $i18n.locale,
                                slug: getMovieParam(movie)
                            }
                        }" class="w-full">
                            <img :src="getImageUrl(movie.poster_thumb_br)"
                                class="w-full aspect-[2/3] object-cover ring-2 ring-[#7075AB] rounded-sm mb-2 shadow-lg">
                        </RouterLink>

                        <div class="relative w-full">
                            <div class="flex flex-col items-center">
                                <div class="w-full mt-1">
                                    <p class="text-center text-xs sm:text-sm font-bold text-zinc-100 truncate px-1">
                                        {{ movie.titulo_br }}
                                    </p>

                                    <div class="flex items-center justify-between px-1 mt-2">
                                        <IconReviewStar @click.stop="toggleQuickReview(movie.id)"
                                            class="w-6 h-6 text-[#97A7CB] hover:text-[#00FCFF] cursor-pointer transition-colors" />

                                        <span class="text-[9px] sm:text-[10px] font-black text-zinc-400">
                                            IMDb {{ movie.rating }}
                                        </span>

                                        <IconAddToList @click.stop="toggleAddToList(movie.id)"
                                            class="w-6 h-6 text-[#97A7CB] hover:text-[#00FCFF] cursor-pointer transition-colors"
                                            :class="{ 'text-[#00FCFF]': activeListId === movie.id }" />
                                    </div>
                                </div>
                            </div>

                            <Transition name="fade-slide">
                                <div v-if="activeReviewId === movie.id"
                                    class="absolute top-full left-0 right-0 z-[60] mt-2 bg-[#0f0f0f]/95 border border-white/10 rounded-xl p-4 shadow-[0_15px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                                    <div class="flex flex-col gap-3">
                                        <div class="flex justify-center gap-0.5">
                                            <button v-for="star in 5" :key="star" @click="rating = star" class="p-0.5">
                                                <IconStar class="w-5 h-5 transition-colors"
                                                    :class="star <= rating ? 'text-[#00FCFF]' : 'text-zinc-800'" />
                                            </button>
                                        </div>
                                        <input type="text" placeholder="Review rápida..."
                                            class="w-full bg-white/5 border border-white/10 p-2 rounded-md text-[11px] text-white outline-none focus:border-[#00FCFF]/50">
                                        <div class="flex gap-2">
                                            <button @click="toggleQuickReview(movie.id)"
                                                class="flex-1 bg-[#00FCFF] text-black text-[10px] font-black uppercase py-2 rounded-md">OK</button>
                                            <button @click="toggleQuickReview(movie.id)"
                                                class="px-2 text-zinc-500 hover:text-white text-[10px]">✕</button>
                                        </div>
                                    </div>
                                </div>
                            </Transition>

                            <Transition name="fade-slide">
                                <div v-if="activeListId === movie.id"
                                    class="absolute top-full left-0 right-0 z-[60] mt-2 bg-[#0f0f0f]/95 border border-white/10 rounded-xl p-4 shadow-[0_15px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                                    <div class="flex flex-col gap-3">
                                        <p
                                            class="text-[10px] text-zinc-500 uppercase font-black border-b border-white/5 pb-1">
                                            Salvar
                                            em:</p>
                                        <div class="flex flex-col gap-2 max-h-32 overflow-y-auto pr-1">
                                            <label v-for="lista in minhasListas" :key="lista.id"
                                                class="flex items-center gap-2 cursor-pointer group">
                                                <input type="checkbox" v-model="lista.selecionada"
                                                    class="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#00FCFF]">
                                                <span class="text-zinc-300 text-[11px] truncate">{{ lista.nome }}</span>
                                            </label>
                                        </div>
                                        <button @click="activeListId = null"
                                            class="w-full bg-white/10 hover:bg-[#00FCFF] text-white hover:text-black text-[9px] font-black py-2 rounded-md transition-all">Concluir</button>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>
                </TransitionGroup>
                <TransitionGroup v-if="searchMode=='lists'" tag="section" name="list">
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
                                            <div v-if="lista.movies[index]"
                                                class="relative w-28 sm:w-28 lg:w-32 transition-transform"
                                                :class="[style.zIndex, style.ml, style.opacity, style.hover]">
                                                <img :src="getImageUrl(lista.movies[index].poster_thumb_br)"
                                                    class="w-full h-auto rounded-sm"
                                                    :class="[style.ring, index === 0 ? 'shadow-xl' : 'shadow-lg']">
                                            </div>
                                        </template>

                                    </div>
                                </div>
                            </div>
                        </RouterLink>
                    </div>
                </div>
                </TransitionGroup>
                <!-- Paginação -->
                <div v-if="searchMode == 'movies'" class="flex items-center justify-center gap-2 mt-8 mb-12">
                    <!-- Botão Voltar -->
                    <button v-if="movies && (movies as any).data" @click="changePage((movies as any).current_page - 1)"
                        :disabled="(movies as any).current_page === 1"
                        class="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-[#00FCFF] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <IconChevronLeft class="w-4 h-4" />
                    </button>

                    <!-- Números das Páginas (Simples) -->
                    <div class="flex gap-1">
                        <button v-if="movies && (movies as any).data" v-for="page in (movies as any).last_page"
                            :key="page" @click="changePage(page)"
                            class="w-8 h-8 rounded-lg text-[10px] font-bold transition-all border" :class="(movies as any).current_page === page
                                ? 'bg-[#00FCFF]/20 border-[#00FCFF] text-[#00FCFF]'
                                : 'bg-white/5 border-white/10 text-zinc-500 hover:bg-white/10'">
                            {{ page }}
                        </button>
                    </div>

                    <!-- Botão Próximo -->
                    <button v-if="movies && (movies as any).data" @click="changePage((movies as any).current_page + 1)"
                        :disabled="(movies as any).current_page === (movies as any).last_page"
                        class="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-[#00FCFF] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <IconChevronRight class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
        <TheFooter />
    </div>
    <div v-show="isCardReviewVisible" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="isCardReviewVisible = false"></div>

        <div class="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-[380px] shadow-2xl">
            <div class="flex flex-col gap-5">
                <div class="text-center">
                    <h2 class="text-[#00FCFF] font-black text-xl tracking-tighter uppercase leading-none">Review Rápida
                    </h2>
                    <p class="text-zinc-400 text-[11px] mt-2 font-bold">{{ selectedMovieTitle }}</p>
                </div>

                <div class="flex flex-col items-center bg-white/5 py-4 rounded-xl border border-white/5">
                    <div class="flex items-center gap-1">
                        <button v-for="star in 5" :key="star" type="button" @click="selectRating(star)"
                            @mouseenter="hoverRating = star" @mouseleave="hoverRating = 0"
                            class="p-1 transition-all active:scale-125">
                            <IconStar class="w-7 h-7 transition-colors duration-200"
                                :class="star <= (hoverRating || rating) ? 'text-[#00FCFF] drop-shadow-[0_0_8px_#00FCFF]' : 'text-zinc-700'" />
                        </button>
                        <span class="text-[#00FCFF] font-black text-lg ml-2">{{ rating }}</span>
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="flex flex-col gap-1">
                        <label class="text-zinc-500 text-[9px] uppercase font-bold ml-1">Título da Review</label>
                        <input type="text" placeholder="Ex: Masterpiece!"
                            class="w-full bg-black/40 border border-white/10 p-2.5 rounded-lg text-white text-sm outline-none focus:border-[#00FCFF] transition-all">
                    </div>

                    <div class="flex flex-col gap-1">
                        <label class="text-zinc-500 text-[9px] uppercase font-bold ml-1">Tags</label>
                        <input type="text" placeholder="Terror, Clássico..."
                            class="w-full bg-black/40 border border-white/10 p-2.5 rounded-lg text-white text-sm outline-none focus:border-[#00FCFF] transition-all">
                    </div>
                </div>

                <div class="flex flex-col gap-2 pt-2">
                    <button @click="isCardReviewVisible = false"
                        class="w-full bg-[#00FCFF] text-black font-black uppercase text-xs py-3 rounded-lg hover:shadow-[0_0_20px_rgba(0,252,255,0.4)] transition-all active:scale-95">
                        Publicar Agora
                    </button>
                    <button @click="isCardReviewVisible = false"
                        class="w-full py-1 text-[9px] font-bold text-zinc-600 hover:text-white uppercase tracking-widest transition-colors">
                        Descartar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
/* 1. Transição de Entrada e Saída */
.list-enter-active,
.list-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 2. Estado de "Sumir" (Fade + Encolher levemente) */
.list-enter-from,
.list-leave-to {
    opacity: 0;
    /* Reduzimos o movimento para quase zero */
    transform: translateY(5px);
}

/* 3. O Ajuste Crítico para a Saída */
.list-leave-active {
    position: absolute;
    pointer-events: none;
}

/* 4. Suavização do movimento dos que ficam */
.list-move {
    transition: transform 0.4s ease;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.2s ease-out;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
