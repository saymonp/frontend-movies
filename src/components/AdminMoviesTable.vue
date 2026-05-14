<script setup lang="ts">
import { reactive, ref } from 'vue';

import type { UpdateMovieRequest } from '@/types/Movies';
import { useMovieStore } from '@/stores/movie';
import { useToast } from "vue-toastification";

const toast = useToast();

const movieStore = useMovieStore();
// Estado para o formulário manual
const showManualModal = ref(false);

const manualMovie = ref<UpdateMovieRequest>();
const singleImportTmdbId = ref<number>();
const syncTmdbId = ref<number>();
const batchImportQnt = ref<number>(20);
const deleteMovieId = ref<number>();
const movieDetailId = ref<string>();

const isLoading = ref(false);
const errorMessage = ref('');
const initialMovieForm = reactive<UpdateMovieRequest>({
    tmdb_id: 0,

    titulo_original: '',
    descricao_en: '',
    slug_en: '',

    rating: 0,
    duracao: 0,

    lingua_origem: 'en',

    release_date: '',

    generos: [],

    imdb_id: null,
    titulo_br: null,
    titulo_en: null,
    descricao_br: null,
    tagline_br: null,
    tagline_en: null,
    slug_pt: null,
    homepage: null,
    poster_path_br: null,
    poster_thumb_br: null,
    backdrop_path: null,
    poster_path_us: null,
    poster_thumb_us: null,

    diretores: [],
    estudios: [],
    paises: [],

    revenue: null,
    popularity: null,

    colecao: null
});
const movieForm = reactive<UpdateMovieRequest>({
    ...initialMovieForm
});
const resetMovieForm = () => {
    Object.assign(movieForm, initialMovieForm);
};
const handleManualUpdate = async () => {
    console.log("Enviando dados:", manualMovie.value);
    try {
        isLoading.value = true;
        errorMessage.value = '';
        if (manualMovie.value) {
            await movieStore.updateManualMovie(movieForm);
        }
    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || 'Erro ao entrar. Verifique suas credenciais.';
    } finally {
        resetMovieForm();
        isLoading.value = false;
        manualMovie.value = undefined;
    }
};

const handleTmdbSync = async () => {
    console.log("Enviando dados:", syncTmdbId.value);
    try {
        isLoading.value = true;
        errorMessage.value = '';
        if (syncTmdbId.value) {
            const response = await movieStore.importSingleMovie(syncTmdbId.value);
            toast.success(response.message);
        }
    } catch (error: any) {
        toast.error(errorMessage.value = error.response?.data?.message || 'Erro ao entrar. Verifique suas credenciais.');
    } finally {
        isLoading.value = false;
    }
};

const handleMovieSingleImport = async () => {
    console.log("Enviando dados:", singleImportTmdbId.value);
    try {
        isLoading.value = true;
        errorMessage.value = '';
        if (singleImportTmdbId.value) {
            const response = await movieStore.importSingleMovie(singleImportTmdbId.value);
            toast.success(response.message);
        }
    } catch (error: any) {
        toast.error(errorMessage.value = error.response?.data?.message || 'Erro ao entrar. Verifique suas credenciais.');
    } finally {
        isLoading.value = false;
    }
};

const handleMovieDelete = async () => {
    console.log("Enviando dados:", deleteMovieId.value);
    try {
        isLoading.value = true;
        errorMessage.value = '';
        if (deleteMovieId.value) {
            const response = await movieStore.deleteMovie(deleteMovieId.value);
            toast.success(response.message);
        }
    } catch (error: any) {
        toast.error(errorMessage.value = error.response?.data?.message || 'Erro ao entrar. Verifique suas credenciais.');
    } finally {
        isLoading.value = false;
    }
};

const handleMovieBatch = async () => {
    console.log("Enviando dados:", batchImportQnt.value);
    try {
        isLoading.value = true;
        errorMessage.value = '';
        if (batchImportQnt.value) {
            const response = await movieStore.importBatchMovies(batchImportQnt.value);
            toast.success(response.message);
        }
    } catch (error: any) {
        toast.error(errorMessage.value = error.response?.data?.message || 'Erro ao entrar. Verifique suas credenciais.');
    } finally {
        isLoading.value = false;
    }
};

const handleGetMovie = async () => {
    if (isLoading.value) return;


    try {
        if (movieDetailId.value) {
            isLoading.value = true;
            const response = await movieStore.detailMovie(movieDetailId.value);
            Object.assign(movieForm, {
                tmdb_id: response.movie.tmdb_id,
                imdb_id: response.movie.imdb_id,

                titulo_original: response.movie.titulo_original,
                titulo_br: response.movie.titulo_br,
                titulo_en: response.movie.titulo_en,

                descricao_br: response.movie.descricao_br,
                descricao_en: response.movie.descricao_en,

                tagline_br: response.movie.tagline_br,
                tagline_en: response.movie.tagline_en,

                rating: response.movie.rating,
                duracao: response.movie.duracao,

                lingua_origem: response.movie.lingua_origem,

                release_date: response.movie.release_date,

                homepage: response.movie.homepage,

                generos: response.movie.generos?.map((g: any) => g.nome_pt) || [],

                diretores: response.movie.diretores?.map((d: any) => d.nome_pt) || [],

                estudios: response.movie.estudios?.map((e: any) => e.nome) || [],

                paises: response.movie.paises?.map((p: any) => p.nome) || [],

                revenue: response.movie.revenue,

                popularity: response.movie.popularity,
            });
        }
    } catch (error) {
        console.error("Erro na busca:", error);
    } finally {
        isLoading.value = false;
    }
};

</script>

<template>
    <div class="min-h-screen bg-zinc-950 p-6 text-zinc-100">
        <div class="max-w-6xl mx-auto">

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                <div
                    class="bg-zinc-900 border border-white/10 p-5 rounded-xl hover:border-[#00FCFF]/50 transition-colors">
                    <h3 class="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Importar via TMDb</h3>
                    <input v-model="singleImportTmdbId" type="text" placeholder="ID do TMDb (ex: 550)"
                        class="w-full bg-zinc-800 border border-white/5 p-2 rounded mb-3 outline-none focus:border-[#00FCFF] text-sm">
                    <button @click="handleMovieSingleImport"
                        class="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-bold text-sm transition-all">
                        Executar Importação
                    </button>
                </div>

                <div
                    class="bg-zinc-900 border border-white/10 p-5 rounded-xl hover:border-yellow-500/50 transition-colors">
                    <h3 class="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Sincronizar TMDb</h3>
                    <input v-model="syncTmdbId" type="text" placeholder="ID do TMDb (ex: 550)"
                        class="w-full bg-zinc-800 border border-white/5 p-2 rounded mb-3 outline-none focus:border-yellow-500 text-sm">
                    <button @click="handleTmdbSync"
                        class="w-full bg-yellow-600 hover:bg-yellow-500 py-2 rounded font-bold text-sm transition-all">
                        Atualizar Dados
                    </button>
                </div>

                <div
                    class="bg-zinc-900 border border-white/10 p-5 rounded-xl hover:border-purple-500/50 transition-colors">
                    <h3 class="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Importação em Lote
                    </h3>
                    <div class="flex items-center gap-2 mb-3">
                        <input v-model="batchImportQnt" type="number" value="20" step="20" min="20" max="500"
                            class="w-full bg-zinc-800 border border-white/5 p-2 rounded outline-none focus:border-purple-500 text-sm">
                        <span class="text-xs text-zinc-500">Qtd</span>
                    </div>
                    <button @click="handleMovieBatch"
                        class="w-full bg-purple-600 hover:bg-purple-500 py-2 rounded font-bold text-sm transition-all">
                        Iniciar Batch Job
                    </button>
                </div>

                <div
                    class="bg-zinc-900 border border-white/10 p-5 rounded-xl hover:border-red-500/50 transition-colors">
                    <h3 class="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4 text-red-400">Zona de
                        Perigo</h3>
                    <input v-model="deleteMovieId" type="text" placeholder="ID do Filme"
                        class="w-full bg-zinc-800 border border-white/5 p-2 rounded mb-3 outline-none focus:border-red-500 text-sm text-red-200">
                    <button @click="handleMovieDelete"
                        class="w-full bg-red-900/50 hover:bg-red-600 border border-red-500/50 py-2 rounded font-bold text-sm transition-all">
                        Deletar Registro
                    </button>
                </div>
            </div>

            <div class="bg-zinc-900 border border-white/10 rounded-xl p-8">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-xl font-bold">Edição Manual</h2>
                        <p class="text-sm text-zinc-400">Atualize campos específicos que não existem no TMDb ou
                            correções manuais.</p>
                    </div>
                    <button @click="showManualModal = !showManualModal"
                        class="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg border border-white/10 transition-all">
                        {{ showManualModal ? 'Fechar Editor' : 'Abrir Editor Completo' }}
                    </button>
                </div>

                <transition name="fade">
                    <div v-if="showManualModal"
                        class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">

                        <div class="space-y-4">
                            <label class="block">
                                <span class="text-xs uppercase text-zinc-500">Id do Filme</span>
                                <input v-model="movieDetailId" type="text" placeholder="ID do Filme (ex: 550)"
                                    class="w-full bg-zinc-800 border border-white/5 p-2 rounded mb-3 outline-none focus:border-[#00FCFF] text-sm">
                                <button @click="handleGetMovie"
                                    class="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-bold text-sm transition-all">
                                    Buscar Filme
                                </button>
                            </label>
                            <label class="block">
                                <span class="text-xs uppercase text-zinc-500">Título Original *</span>
                                <input v-model="movieForm.titulo_original" type="text"
                                    class="w-full bg-zinc-800 border border-white/5 p-2 rounded mt-1 focus:border-[#00FCFF] outline-none">
                            </label>
                            <label class="block">
                                <span class="text-xs uppercase text-zinc-500">Título Português</span>
                                <input v-model="movieForm.titulo_br" type="text"
                                    class="w-full bg-zinc-800 border border-white/5 p-2 rounded mt-1 focus:border-[#00FCFF] outline-none">
                            </label>
                            <label class="block">
                                <span class="text-xs uppercase text-zinc-500">Título Inglês</span>
                                <input v-model="movieForm.titulo_en" type="text"
                                    class="w-full bg-zinc-800 border border-white/5 p-2 rounded mt-1 focus:border-[#00FCFF] outline-none">
                            </label>
                            <div class="grid grid-cols-2 gap-2">
                                <label>
                                    <span class="text-xs uppercase text-zinc-500">Rating</span>
                                    <input v-model="movieForm.rating" type="number" step="0.1"
                                        class="w-full bg-zinc-800 border border-white/5 p-2 rounded mt-1 outline-none">
                                </label>
                                <label>
                                    <span class="text-xs uppercase text-zinc-500">Duração (min)</span>
                                    <input type="number"
                                        class="w-full bg-zinc-800 border border-white/5 p-2 rounded mt-1 outline-none">
                                </label>
                                <label class="block">
                                    <span class="text-xs uppercase text-zinc-500">Idioma de Origem</span>
                                    <input v-model="movieForm.lingua_origem" type="text"
                                        class="w-full bg-zinc-800 border border-white/5 p-2 rounded mt-1 outline-none text-zinc-400">
                                </label>
                                <label class="block">
                                    <span class="text-xs uppercase text-zinc-500">Homepage</span>
                                    <input v-model="movieForm.homepage" type="text"
                                        class="w-full bg-zinc-800 border border-white/5 p-2 rounded mt-1 outline-none text-zinc-400">
                                </label>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <label class="block">
                                <span class="text-xs uppercase text-zinc-500">Descrição BR</span>
                                <textarea v-model="movieForm.descricao_br" rows="4"
                                    class="w-full bg-zinc-800 border border-white/5 p-2 rounded mt-1 focus:border-[#00FCFF] outline-none resize-none"></textarea>
                            </label>
                            <label class="block">
                                <span class="text-xs uppercase text-zinc-500">Gêneros (IDs separados por vírgula)</span>
                                <input v-model="movieForm.generos" type="text" placeholder="1, 5, 12"
                                    class="w-full bg-zinc-800 border border-white/5 p-2 rounded mt-1 outline-none">
                            </label>
                            <label class="block">
                                <span class="text-xs uppercase text-zinc-500">Estúdios</span>
                                <input v-model="movieForm.estudios" type="text" placeholder="1, 5, 12"
                                    class="w-full bg-zinc-800 border border-white/5 p-2 rounded mt-1 outline-none">
                            </label>
                            <label class="block">
                                <span class="text-xs uppercase text-zinc-500">Países</span>
                                <input v-model="movieForm.estudios" type="text" placeholder="1, 5, 12"
                                    class="w-full bg-zinc-800 border border-white/5 p-2 rounded mt-1 outline-none">
                            </label>
                            <label class="block">
                                <span class="text-xs uppercase text-zinc-500">Release Date</span>
                                <input v-model="movieForm.release_date" type="date"
                                    class="w-full bg-zinc-800 border border-white/5 p-2 rounded mt-1 outline-none text-zinc-400">
                            </label>
                        </div>

                        <div class="space-y-4">


                            <div class="pt-4">
                                <button @click="handleManualUpdate"
                                    class="w-full bg-gradient-to-r from-[#343647] to-[#41496e] py-3 rounded-lg font-bold text-black uppercase tracking-widest hover:opacity-90 transition-all">
                                    Salvar Alterações
                                </button>
                            </div>
                        </div>

                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Custom Scrollbar para o Admin */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #09090b;
}

::-webkit-scrollbar-thumb {
    background: #27272a;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #3f3f46;
}
</style>