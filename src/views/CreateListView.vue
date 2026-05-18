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
import { useRouter } from 'vue-router';
import i18n from '@/i18n';
import MoviePoster from '@/components/MoviePoster.vue';
import { getImageUrl } from '@/utils/imageHelper';

const authStore = useAuthStore();
const { isAuthenticated, user } = storeToRefs(authStore);
const router = useRouter();
const listaStore = useListaStore();
const target = ref(null);
const isSearching = ref(false);
const moviesList = ref<MovieWithDirectors[]>([]);
const novaTag = ref('');

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

function generateSlug(title: string) {
    return title
        .toLowerCase()
        .normalize('NFD') // separa acentos
        .replace(/[\u0300-\u036f]/g, '') // remove acentos
        .replace(/[^a-z0-9\s-]/g, '') // remove caracteres especiais
        .trim()
        .replace(/\s+/g, '-') // espaços -> hífen
        .replace(/-+/g, '-'); // evita múltiplos hífens
}

const criarLista = async () => {
    if (isSearching.value) return;

    isSearching.value = true;
    try {
        listaData.value.slug = generateSlug(listaData.value.titulo);
        console.log(listaData.value);
        const newList = await listaStore.createLista(listaData.value);
        const link = `/lista/${newList.id}-${newList.slug}`;
        router.push(link);
    } catch (error) {

    } finally {
        isSearching.value = false;
    }


}

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

</script>
<template>
    <Navbar />
    <div class="bg-hero min-h-screen pt-24 pb-10">
        <div class="max-w-4xl mx-auto px-4 relative">

            <div class="flex flex-col items-center mb-12 relative z-10">
                <div class="relative w-full flex flex-col lg:flex-row items-center justify-center mb-6 gap-3 lg:gap-0">
                    <input v-model="listaData.titulo" type="text"
                        class="text-zinc-100 font-black text-2xl lg:text-4xl bg-white/5 border-black border-none outline-none focus:ring-0 text-center w-full placeholder:text-zinc-700"
                        placeholder="Título da lista">


                </div>
                <textarea v-model="listaData.comentario"
                    class="w-full max-w-2xl text-zinc-400 font-medium text-base bg-transparent border-none outline-none focus:ring-0 text-center min-h-[80px] resize-none placeholder:text-zinc-800"
                    placeholder="Adicione uma descrição para esta lista..."></textarea>

                <div class="w-full max-w-xl flex flex-col items-center gap-3 mt-4">
                    <div class="flex flex-wrap justify-center gap-2">
                        <span v-for="(tag, index) in listaData.tags" :key="index"
                            class="flex items-center gap-2 bg-[#00FCFF]/5 border border-[#00FCFF]/20 text-[#00FCFF] text-[10px] font-bold py-1.5 px-3 rounded-full uppercase tracking-wider">
                            {{ tag }}
                            <button @click="removerTag(index)"
                                class="hover:text-white transition-colors text-xs">×</button>
                        </span>
                    </div>

                    <div class="relative w-full max-w-xs">
                        <input v-model="novaTag" @keyup.enter.prevent="adicionarTag" type="text" enterkeyhint="done"
                            placeholder="Adicionar tag..."
                            class="w-full bg-white/5 border border-white/5 rounded-full px-4 py-1.5 text-zinc-100 text-[11px] text-center outline-none focus:border-[#00FCFF]/50 transition-all" />
                    </div>
                </div>
            </div>
            <div class="m-1">
                <button @click="criarLista" :disabled="!listaData.titulo || listaData.titulo.trim() === ''" :class="[
                    !listaData.titulo || listaData.titulo.trim() === ''
                        ? 'bg-zinc-800 border-zinc-700 opacity-50 cursor-not-allowed text-zinc-500'
                        : 'bg-[#00FCFF]/10 border-[#00FCFF]/30 hover:bg-[#00FCFF]/20 cursor-pointer text-[#00FCFF]'
                ]"
                    class="w-full lg:w-auto lg:justify-center bg-[#00FCFF]/10 border border-[#00FCFF]/30 rounded-xl py-3 lg:py-2 px-6 lg:px-4 hover:bg-[#00FCFF]/20 cursor-pointer transition-all shadow-[0_0_20px_rgba(0,252,255,0.1)]">
                    <p
                        class="text-[#00FCFF] text-[11px] lg:text-[10px] uppercase tracking-widest font-black text-center">
                        Criar Lista</p>
                </button>
            </div>

            <div
                class="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 mb-12 shadow-2xl relative z-50">
                <div class="flex flex-col gap-4">
                    <div class="flex items-center justify-between px-1">
                        <label class="text-[#00FCFF] text-[10px] font-black uppercase tracking-[0.2em]">
                            Explorar Filmes
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer group">
                            <span
                                class="text-zinc-500 text-[10px] font-bold uppercase group-hover:text-zinc-300 transition-colors">Pública</span>
                            <div class="relative">
                                <input type="checkbox" v-model="listaData.publica" class="peer hidden">
                                <div
                                    class="w-8 h-4 bg-zinc-800 rounded-full border border-white/10 peer-checked:bg-[#00FCFF]/20 peer-checked:border-[#00FCFF]/50 transition-all">
                                </div>
                                <div
                                    class="absolute left-1 top-1 w-2 h-2 bg-zinc-500 rounded-full peer-checked:left-5 peer-checked:bg-[#00FCFF] transition-all">
                                </div>
                            </div>
                        </label>
                    </div>

                    <div class="relative">
                        <div
                            class="flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#00FCFF] transition-all">
                            <input :value="searchQuery" @input="searchQuery = ($event.target as HTMLInputElement).value"
                                type="text" placeholder="Busque um filme para adicionar..."
                                class="flex-1 bg-transparent border-none outline-none text-zinc-100 text-sm font-medium">
                        </div>

                        <div ref="target" v-if="(isSearching && searchQuery.length > 3) || moviesList.length > 0"
                            class="absolute left-0 top-full w-full mt-2 bg-zinc-900 border border-white/10 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,1)] max-h-80 overflow-y-auto z-[100] backdrop-blur-xl">

                            <div v-if="isSearching" class="p-4 text-zinc-100 text-sm font-bold flex items-center gap-2">
                                <div
                                    class="w-4 h-4 border-2 border-[#00FCFF] border-t-transparent rounded-full animate-spin">
                                </div>
                                Carregando...
                            </div>

                            <div v-else v-for="movie in moviesList" :key="movie.id"
                                @click="addMovie(movie.id, movie.poster_thumb_br)"
                                class="flex p-4 border-b border-white/5 hover:bg-[#00FCFF]/10 cursor-pointer transition-colors group items-center">

                                <MoviePoster v-if="movie.poster_thumb_br" :path="getImageUrl(movie.poster_thumb_br)"
                                    class="w-10 h-14 object-cover rounded-md shadow-md" />

                                <div class="ml-3 flex-1">
                                    <p
                                        class="text-zinc-100 text-sm font-bold group-hover:text-[#00FCFF] transition-colors">
                                        {{ movie.titulo_br || movie.titulo_original }}
                                    </p>
                                    <p class="text-zinc-500 text-xs mt-1">{{ movie.release_date?.split('-')[0] }}</p>
                                    <p class="text-zinc-500 text-[10px] line-clamp-1">
                                        {{movie.diretores?.map(d => d.nome).join(', ') || ''}}
                                    </p>
                                </div>

                                <span
                                    class="text-[#00FCFF] text-xs font-black opacity-0 group-hover:opacity-100 transition-all">+
                                    Adicionar</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <draggable v-model="listaData.movies" item-key="id" tag="section" handle=".drag-handle"
                ghost-class="opacity-20"
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6 relative z-0">
                <template #item="{ element: movie }">
                    <div class="relative group">
                        <button @click.stop="removerFilmeDaLista(movie.id)"
                            class="absolute -top-2 -right-2 z-20 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-xl">
                            <span class="text-xs">×</span>
                        </button>

                        <div class="flex flex-col gap-3">
                            <div
                                class="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-800 shadow-2xl ring-1 ring-white/10 group-hover:ring-[#00FCFF]/50 transition-all">
                                <MoviePoster :path="getImageUrl(movie.poster_thumb_br)"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                                <div
                                    class="drag-handle absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                                    <IconDrag class="w-8 h-8 text-[#00FCFF]" />
                                </div>
                            </div>

                            <div class="px-1 text-center">
                                <p class="text-[11px] font-black text-zinc-100 uppercase tracking-tighter line-clamp-1">
                                    {{ movie.titulo_br || movie.titulo_original }}
                                </p>
                            </div>
                        </div>
                    </div>
                </template>
            </draggable>

        </div>
    </div>
    <TheFooter />
</template>