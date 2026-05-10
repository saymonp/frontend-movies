<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import Navbar from '@/components/Navbar.vue';
import TheFooter from '@/components/TheFooter.vue';
import movies_json from '../assets/movies.json';
import IconAddReview from '@/components/icons/IconAddReview.vue';
import IconAddToList from '@/components/icons/IconAddToList.vue';
import IconDrag from '@/components/icons/IconDrag.vue';
import IconNavHam from '@/components/icons/IconNavHam.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import draggable from 'vuedraggable';
import type { Lista, UpdateLista, MovieWithDirectors, Tag, CreateLista } from '@/types/Listas';
import { useListaStore } from '@/stores/lista';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useMovieStore } from '@/stores/movie';
import { onClickOutside, transition } from '@vueuse/core';
import i18n from '@/i18n';

const authStore = useAuthStore();
const { isAuthenticated, user } = storeToRefs(authStore);

const listaStore = useListaStore();
const target = ref(null);
const isSearching = ref(false);
const moviesList = ref<MovieWithDirectors[]>([]);
const novaTag = ref('');

// Objeto para guardar o estado original (antes da edição)
const originalData = ref('');


const getInitialState = (): CreateLista => ({
    titulo: '',
    comentario: '',
    tags: [],
    movies: [],
    idioma: 'pt',
    slug: '',
    publica: true
});

const listaData = ref<CreateLista>(getInitialState());

const criarLista = async () => {
    console.log(listaData.value);
}
// Para limpar o formulário após o sucesso:
const resetForm = () => {
    listaData.value = getInitialState();
};

const adicionarTag = () => {
    const valor = novaTag.value.trim();

    // Evita tags vazias ou duplicadas
    if (valor && !listaData.value.tags?.includes(valor)) {
        // Adiciona ao array de tags que será enviado ao backend
        listaData.value.tags?.push(valor);
        novaTag.value = ''; // Limpa o input
    }
};

const removerTag = (index: number) => {
    listaData.value.tags?.splice(index, 1);
};

const removerFilmeDaLista = (movieId: number) => {
    const index = listaData.value.movies.findIndex(movie => movie.id === movieId);

    if (index !== -1) {
        listaData.value.movies.splice(index, 1);
    }
};


const searchQuery = ref('');


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

async function loadMovies() {
    if (isSearching.value) return;

    isSearching.value = true;

    try {
        const response = await listaStore.moviesAddToList(searchQuery.value);
        if (response && !Array.isArray(response) && 'temp_result' in response) {
            const movie = (response as any);
            moviesList.value = [{
                titulo_original: movie.temp_result.original_title,
                titulo_br: movie.temp_result.title,
                id: movie.id,
                release_date: movie.temp_result.release_date,
                poster_thumb_br: movie.temp_result.poster_path
            }];
        } else {
            moviesList.value = response;
        }
    } catch (error) {

        console.error("Erro na comunicação com a API:", error);

    } finally {
        isSearching.value = false;
    }
}

watch(searchQuery, async (newQuery) => {
    // Avoid empty calls or overworking the server
    if (newQuery.length < 3) {
        moviesList.value = []
        return
    }

    try {
        loadMovies();
    } catch (error) {
        console.error('Search error:', error);
    }
});

function addMovie(movieId: number, poster?: string) {
    if (movieId && poster) {
        const filmeJaExiste = listaData.value.movies.some(movie => movie.id === movieId);

        if (!filmeJaExiste) {
            listaData.value.movies.unshift({
                id: movieId,
                poster_thumb_br: poster
            });

            searchQuery.value = '';
            moviesList.value = [];
        } else {
            console.warn("Este filme já foi adicionado à lista.");
        }
    }
}

onClickOutside(target, () => {
    searchQuery.value = '';
    moviesList.value = [];
});

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
    <Navbar />
    <div class="bg-hero min-h-screen pt-24 pb-10">
        <div class="lg:max-w-3xl max-w-[95%] mx-auto relative z-30">


            <!-- MODO EDIÇÃO -->
            <div key="edit" class="flex flex-col items-center">
                <div class="relative w-full flex items-center justify-center mb-4">
                    <input v-model="listaData.titulo" type="text"
                        class="text-zinc-100 font-black text-3xl border bg-white/5 border-black p-2 rounded outline-none focus:border-[#00FCFF] drop-shadow-lg text-center w-full max-w-xl"
                        placeholder="Título da lista">
                    <button @click="criarLista"
                        class="absolute right-0 hidden lg:block bg-[#00FCFF]/20 border border-[#00FCFF]/50 rounded-lg py-1.5 px-3 hover:bg-[#00FCFF]/30 cursor-pointer transition-all shadow-[0_0_15px_rgba(0,252,255,0.2)]">
                        <p class="text-zinc-100 text-[9px] uppercase tracking-tighter font-bold">Salvar Lista</p>
                    </button>

                </div>

                <textarea v-model="listaData.comentario"
                    class="w-full text-zinc-100 font-medium text-sm border bg-white/5 border-black p-4 rounded mb-8 outline-none focus:border-[#00FCFF] drop-shadow-lg text-center min-h-[100px]"
                    placeholder="Adicione um comentário sobre esta lista..."></textarea>
                <div class="w-full flex flex-col gap-2 mb-8">
                    <label class="text-[#00FCFF] text-[10px] font-bold uppercase tracking-widest ml-1">
                        Tags da Lista
                    </label>

                    <div
                        class="flex flex-wrap items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-xl focus-within:border-[#00FCFF]/50 transition-all">

                        <!-- Badges das Tags já adicionadas -->
                        <span v-for="(tag, index) in listaData.tags" :key="index"
                            class="flex items-center gap-1 bg-[#00FCFF]/10 border border-[#00FCFF]/30 text-[#00FCFF] text-[10px] font-bold py-1 px-2 rounded-lg uppercase">
                            {{ tag }}
                            <button @click="removerTag(index)" class="hover:text-white transition-colors">
                                <span class="text-xs">×</span>
                            </button>
                        </span>

                        <!-- Input da Tag -->
                        <input v-model="novaTag" @keydown.enter.prevent="adicionarTag" type="text"
                            placeholder="Adicione uma tag e aperte Enter..."
                            class="flex-1 bg-transparent border-none outline-none text-zinc-100 text-xs p-1 min-w-[150px]" />
                    </div>
                    <p class="text-zinc-500 text-[9px] ml-1">Pressione Enter para adicionar cada tag.</p>
                </div>
            </div>


        </div>

        <div
            class="bg-white/5 backdrop-blur-xl border border-[#00FCFF]/20 rounded-2xl p-6 shadow-2xl relative z-50 mb-8">
            <div class="flex flex-col gap-3">
                <label class="text-[#00FCFF] text-xs font-bold uppercase tracking-wider ml-1">
                    Adicionar Filme para sua lista
                </label>
                <div class="relative">
                    <div
                        class="flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#00FCFF] transition-all">
                        <input :value="searchQuery" @input="searchQuery = ($event.target as HTMLInputElement).value"
                            type="text" placeholder="Busque um filme para adicionar..."
                            class="flex-1 bg-transparent border-none outline-none text-zinc-100 text-sm font-medium">
                    </div>
                    <div v-if="isSearching && searchQuery.length > 3"
                        class="z-100 absolute left-0 top-full w-full mt-1 bg-zinc-900 border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] max-h-60 overflow-y-auto">
                        <p class="p-4 text-zinc-100 text-sm font-bold">Carregando...</p>
                    </div>
                    <div ref="target" v-if="moviesList.length > 0"
                        class="z-100 absolute left-0 top-full w-full mt-1 bg-zinc-900 border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] max-h-60 overflow-y-auto">
                        <div v-for="movie in moviesList" :key="movie.id"
                            @click="addMovie(movie.id, movie.poster_thumb_br)" class="p-4 border-b border-white/5 hover:bg-[#00FCFF]/10 cursor-pointer
                                    transition-colors group">
                            <div class="flex">
                                <p class="text-zinc-100 text-sm font-bold group-hover:text-[#00FCFF]">{{
                                    movie.titulo_br || movie.titulo_original
                                    }}</p>
                                <p class="ml-3 text-zinc-500 text-[12px] font-bold">{{ movie.rating || '' }}</p>
                            </div>
                            <p class="text-zinc-500 text-[10px]">{{movie.diretores?.map(diretor =>
                                diretor.nome).join(', ') || ''}}</p>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <div>
                <label class="flex items-end gap-2 cursor-pointer">
                    <p class="text-zinc-300 font-medium text-sm text-center italic opacity-80">Lista
                        Pública</p>

                    <div class="relative flex items-center">
                        <input type="checkbox" v-model="listaData.publica"
                            class="peer appearance-none w-4 h-4 border border-white/20 rounded transition-all checked:bg-[#00FCFF] checked:border-[#00FCFF]">

                        <span
                            class="absolute left-1 text-[10px] font-bold text-black opacity-0 peer-checked:opacity-100">
                            ✓
                        </span>
                    </div>
                </label>
            </div>
        </div>

        <!-- LISTAGEM DE FILMES (DRAGGABLE) -->
        <div class="flex justify-end mb-4">
            <button @click="" class="lg:hidden bg-white/5 border border-white/10 rounded-lg py-1.5 px-3">
                <p class="text-zinc-100 text-[9px] uppercase font-bold">Salvar</p>
            </button>
        </div>

        <draggable v-model="listaData.movies" item-key="id" tag="section" handle=".drag-handle" ghost-class="opacity-50"
            class="grid grid-cols-2 sm:grid-cols-4 mt-4 gap-6 relative z-10">
            <template #item="{ element: movie }">

                <div class="movie-card group">
                    <div class="flex flex-col items-center">
                        <RouterLink :to="{
                            name: 'MovieView',
                            params: {
                                lang: $i18n.locale,
                                slug: getMovieParam(movie)
                            }
                        }" class="relative">
                            <img :src="getImageUrl(movie.poster_thumb_br)"
                                class="w-full aspect-[2/3] object-cover ring-2 ring-white/10 group-hover:ring-[#00FCFF] rounded-lg transition-all duration-300 shadow-lg">
                        </RouterLink>

                        <div class="w-full mt-3 text-center">
                            <p class="text-sm font-bold text-zinc-100 truncate px-1">
                                {{ movie.titulo_br || movie.titulo_original }}
                            </p>
                            <div class="flex items-center justify-between mt-2 px-1">
                                <IconDelete @click.stop="removerFilmeDaLista(movie.id)"
                                    class="w-6 h-6 text-[#ff0077] hover:scale-110 active:scale-90 cursor-pointer transition-all" />

                                <span class="text-[10px] font-black text-zinc-400">IMDb {{ movie.rating
                                    }}</span>

                                <IconDrag
                                    class="drag-handle w-6 h-6 text-zinc-500 hover:text-[#00FCFF] cursor-grab active:cursor-grabbing transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </draggable>

    </div>

    <TheFooter />
</template>

<style scoped>
/* Transição suave de troca de modo */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

/* Transição simples para o campo de busca */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>