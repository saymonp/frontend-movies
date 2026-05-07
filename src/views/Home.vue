<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick } from 'vue';
import IconAddReview from '@/components/icons/IconAddReview.vue'
import IconAddToList from '@/components/icons/IconAddToList.vue'
import IconFilter from '@/components/icons/IconFilter.vue'
import IconStar from '@/components/icons/IconStar.vue';
import IconReviewEstrelas from '@/components/icons/IconReviewEstrelas.vue';
import IconReviewStar from '@/components/icons/IconReviewStar.vue';
import TheFooter from '@/components/TheFooter.vue';
import Navbar from '@/components/Navbar.vue';
import movies_json from '../assets/movies.json'
import { onClickOutside } from '@vueuse/core'

import { useAuthStore } from '@/stores/auth';
import { useMovieStore } from '@/stores/movie';


import SearchBar from '@/components/SearchBar.vue';
import SearchBar2 from '@/components/SearchBar2.vue';
import { storeToRefs } from 'pinia';
import type { MoviePaginationResponse, DinamicMovieInsertionResponse, GeneroResponse, DiretorResponse, MovieIndex, MovieFilters, MovieIndexResponse, UpdateMovieRequest, MovieDetail, ApiResponse } from '@/types/Movies';
import i18n from '@/i18n';


const authStore = useAuthStore();
const movieStore = useMovieStore();

// transforma as propriedades em Refs, permitindo o uso de .value
const { isAuthenticated, user } = storeToRefs(authStore);

const isResettingFilters = ref(false);
const target = ref(null);

const isSearching = ref(false);

// const movies = ref(movies_json.movie);
const generos = ref<GeneroResponse[]>([]);
const diretores = ref<DiretorResponse[]>([]);
const idiomasDisponiveis = ref<string[]>([]);

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
// Função que observa mudanças e recarrega os filmes
// Usamos um "debounce" no search para não sobrecarregar a API enquanto o usuário digita
//watch(filterMovies, (newFilters) => {
//    loadMovies(newFilters);
//}, { deep: true });
watch(
    () => ({ ...filterMovies.value }), // Observa uma cópia dos filtros
    (newVal, oldVal) => {
        if (isSearching.value || isResettingFilters.value) return;
        // Se o que mudou NÃO foi a página, resetamos para a página 1
        if (newVal.page === oldVal.page) {
            filterMovies.value.page = 1;
        }

        loadMovies(filterMovies.value);
    },
    { deep: true }
);
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
// Função para manipular os gêneros (Checkbox)
const toggleGenero = (id: number) => {
    const index = filterMovies.value.generos?.indexOf(id);
    if (index !== undefined && index > -1) {
        filterMovies.value.generos?.splice(index, 1);
    } else {
        filterMovies.value.generos?.push(id);
    }
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
const searchMode = ref('movies')

const filterShow = computed(() => {
    // Arredonda para a primeira casa decimal de forma mais estável
    return (Math.round(filterRating.value * 10) / 10).toFixed(1);
});

const filterValue = ref(0);


const isCardReviewVisible = ref(false);
//const rating = ref(0);
const hoverRating = ref(0);
const selectedMovieTitle = ref(''); // Para mostrar o nome do filme no modal

const openQuickReview = (movieTitle: string) => {
    selectedMovieTitle.value = movieTitle;
    isCardReviewVisible.value = true;
};

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

const toggleBooleanFilter = (tag: string) => {
    if (searchMode.value === 'movies') {
        switch (tag) {
            case 'Destaques':
                filterMovies.value.destaque = !filterMovies.value.destaque;
                break;
            case '2026':
                // Se clicar em 2026, seta o ano ou limpa
                filterMovies.value.ano = filterMovies.value.ano === 2026 ? undefined : 2026;
                break;
            case 'Bilheterias':
                filterMovies.value.bilheteria = !filterMovies.value.bilheteria;
                break;
        }
    } else {
        // Lógica para o searchMode === 'lists' se necessário
        console.log('Filtro de lista clicado:', tag);
    }
};

// Função para verificar se o botão deve estar com estilo "ativo"
const isFilterActive = (tag: string): boolean => {
    if (searchMode.value === 'movies') {
        if (tag === 'Destaques') return !!filterMovies.value.destaque;
        if (tag === '2026') return filterMovies.value.ano === 2026;
        if (tag === 'Bilheterias') return !!filterMovies.value.bilheteria;
    }
    return false;
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

                <div ref="movieListSection" class="lg:max-w-3xl max-w-13/14 mx-auto mt-10">
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

                        <div
                            class="relative z-50 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 ring-1 ring-white/10 transition-all duration-500">
                            <div class="grid grid-cols-1 sm:grid-cols-12 gap-6">

                                <div class="sm:col-span-4 flex flex-col gap-4">
                                    <div class="flex items-center bg-white/5 border border-white/20 rounded-xl px-3 py-2 focus-within:ring-1 transition-all"
                                        :class="[
                                            isSearching ? 'opacity-50 cursor-not-allowed' : '',
                                            searchMode === 'movies' ? 'focus-within:ring-[#00FCFF]' : 'focus-within:ring-[#ff0077]'
                                        ]">

                                        <input type="text" v-model="filterMovies.search"
                                            :placeholder="searchMode === 'movies' ? 'Buscar filmes...' : 'Buscar listas por título...'"
                                            class="flex-1 bg-transparent border-none outline-none text-zinc-100 text-xs font-bold min-w-0">

                                        <div class="relative">
                                            <button @click="showFilter = !showFilter"
                                                class="flex items-center gap-1 ml-2 px-2 py-1 rounded-md transition-all group"
                                                :class="searchMode === 'movies' ? 'bg-[#00FCFF]/10 text-[#00FCFF]' : 'bg-[#ff0077]/10 text-[#d919ff]'">
                                                <span class="text-[9px] font-black uppercase tracking-tighter">
                                                    {{ searchMode === 'movies' ? 'Gêneros' : 'Tags' }}
                                                </span>
                                                <IconFilter class="w-3" />
                                            </button>

                                            <div ref="target" v-show="showFilter"
                                                class="absolute right-0 mt-3 z-50 bg-[#020036]/95 backdrop-blur-2xl border border-white/20 rounded-xl p-4 shadow-2xl w-[220px]">
                                                <p class="text-[10px] font-black uppercase tracking-widest border-b border-white/10 pb-2 mb-3"
                                                    :class="searchMode === 'movies' ? 'text-[#00FCFF]' : 'text-[#d919ff]'">
                                                    {{ searchMode === 'movies' ? 'Selecionar Gêneros' : 'Filtrar por Tags' }}
                                                </p>
                                                <div
                                                    class="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                                    <label
                                                        v-for="item in (searchMode === 'movies' ? generos : ['Favoritos', 'Maratona', 'Cyberpunk', 'Clássicos'])"
                                                        :key="searchMode === 'movies' ? (item as any).id : (item as string)"
                                                        class="flex items-center gap-3 cursor-pointer group">

                                                        <div class="relative flex items-center">
                                                            <input type="checkbox"
                                                                :value="searchMode === 'movies' ? (item as any).id : (item as string)"
                                                                :checked="searchMode === 'movies' ? filterMovies.generos?.includes((item as any).id) : false"
                                                                @change="searchMode === 'movies' ? toggleGenero((item as any).id) : null"
                                                                :class="searchMode === 'movies' ? 'checked:bg-[#00FCFF] checked:border-[#00FCFF]' : 'checked:bg-[#ff0077] checked:border-[#ff0077]'"
                                                                class="peer appearance-none w-4 h-4 border border-white/20 rounded transition-all">
                                                            >

                                                            <span
                                                                class="absolute text-black font-bold text-[10px] left-1 opacity-0 peer-checked:opacity-100">✓</span>
                                                        </div>
                                                        <span
                                                            class="text-zinc-300 text-[11px] font-bold group-hover:text-white transition-colors">{{
                                                                searchMode === 'movies' ? (item as any).nome_pt : item
                                                            }}</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="px-1">
                                        <div class="flex justify-between items-center text-[9px] mb-1">
                                            <span class="text-zinc-500 uppercase font-bold tracking-widest">
                                                {{ searchMode === 'movies' ? 'Nota Mínima' : 'Mínimo de Likes' }}
                                            </span>
                                            <span class="font-black px-2 py-0.5 rounded"
                                                :class="searchMode === 'movies' ? 'text-[#00FCFF] bg-[#00FCFF]/10' : 'text-[#d919ff] bg-[#ff0077]/10'">
                                                {{ filterValue }}
                                            </span>
                                        </div>
                                        <input type="range" min="0" step="0.5"
                                            :max="searchMode === 'movies' ? 10 : 1000" v-model="filterValue"
                                            class="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                            :class="searchMode === 'movies' ? 'accent-[#00FCFF]' : 'accent-[#d919ff]'">
                                    </div>
                                </div>

                                <div class="sm:col-span-8 flex flex-col gap-4">

                                    <div class="grid grid-cols-3 gap-3">
                                        <div class="flex flex-col gap-1">
                                            <label class="text-[9px] text-zinc-500 uppercase font-bold ml-1">Ano</label>
                                            <select v-model="filterMovies.ano"
                                                class="bg-white/5 border border-white/10 p-2 rounded-lg text-[10px] text-white outline-none focus:border-[#00FCFF] cursor-pointer">
                                                <option class="bg-zinc-900" :value="undefined">Todos</option>
                                                <option class="bg-zinc-900">2026</option>
                                                <option class="bg-zinc-900">2025</option>
                                                <option class="bg-zinc-900">2024</option>
                                            </select>
                                        </div>

                                        <template v-if="searchMode === 'movies'">
                                            <div class="flex flex-col gap-1">
                                                <label
                                                    class="text-[9px] text-zinc-500 uppercase font-bold ml-1">Diretor</label>
                                                <select v-model="filterMovies.diretores"
                                                    class="bg-white/5 border border-white/10 p-2 rounded-lg text-[10px] text-white outline-none focus:border-[#00FCFF] cursor-pointer">
                                                    <option class="bg-zinc-900" :value="undefined">Todos</option>
                                                    <option v-for="diretor in diretores" :key="diretor.id"
                                                        :value="diretor.id" class="bg-zinc-900">
                                                        {{ diretor.nome }}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="flex flex-col gap-1">
                                                <label class="text-[9px] text-zinc-500 uppercase font-bold ml-1">Idioma
                                                    de Origem</label>
                                                <select v-model="filterMovies.idioma"
                                                    class="bg-white/5 border border-white/10 p-2 rounded-lg text-[10px] text-white outline-none focus:border-[#00FCFF] cursor-pointer">
                                                    <option class="bg-zinc-900" :value="undefined">Todos</option>
                                                    <option class="bg-zinc-900" v-for="idioma in idiomasDisponiveis"
                                                        :key="idioma" :value="idioma">
                                                        {{ new Intl.DisplayNames(['pt-BR'], {
                                                            type: 'language'
                                                        }).of(idioma) }}
                                                    </option>
                                                </select>
                                            </div>
                                        </template>

                                        <template v-else>
                                            <div class="flex flex-col gap-1">
                                                <label class="text-[9px] text-zinc-500 uppercase font-bold ml-1">Ordenar
                                                    por</label>
                                                <select
                                                    class="bg-white/5 border border-white/10 p-2 rounded-lg text-[10px] text-white outline-none focus:border-[#ff0077] cursor-pointer">
                                                    <option class="bg-zinc-900">Mais curtidas</option>
                                                    <option class="bg-zinc-900">Recentes</option>
                                                </select>
                                            </div>
                                            <div class="flex flex-col gap-1">
                                                <label
                                                    class="text-[9px] text-zinc-500 uppercase font-bold ml-1">Privacidade</label>
                                                <select
                                                    class="bg-white/5 border border-white/10 p-2 rounded-lg text-[10px] text-white outline-none focus:border-[#ff0077] cursor-pointer">
                                                    <option class="bg-zinc-900">Públicas</option>
                                                    <option class="bg-zinc-900">Minhas Listas</option>
                                                </select>
                                            </div>
                                        </template>
                                    </div>

                                    <div class="flex gap-2 mt-auto">
                                        <button
                                            v-for="tag in (searchMode === 'movies' ? ['Destaques', '2026', 'Bilheterias'] : ['Top Listas', 'Curadorias', 'Mais Ativas'])"
                                            :key="tag" @click="toggleBooleanFilter(tag)"
                                            class="flex-1 rounded-xl py-2.5 px-2 transition-all group hover:bg-white/10"
                                            :class="[
                                                // Cores base e hover
                                                searchMode === 'movies' ? 'hover:border-[#00FCFF]/50' : 'hover:border-[#ff0077]/50',

                                                // Estilo quando ATIVO
                                                isFilterActive(tag)
                                                    ? (searchMode === 'movies' ? 'bg-[#00FCFF]/5 border border-[#00FCFF]' : 'bg-[#ff0077]/20 border-[#ff0077]')
                                                    : 'bg-white/5 border border-white/10'
                                            ]">
                                            <p class="text-zinc-400 text-[10px] uppercase tracking-tighter font-black text-center group-hover:text-white"
                                                :class="[
                                                    isFilterActive(tag)
                                                        ? (searchMode === 'movies' ? 'text-[#00FCFF]' : 'text-[#ff0077]')
                                                        : 'text-zinc-400 group-hover:text-white'
                                                ]">

                                                {{ tag }}
                                            </p>
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <TransitionGroup tag="section" name="list"
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
                <!-- Paginação -->
                <div class="flex items-center justify-center gap-2 mt-8 mb-12">
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
