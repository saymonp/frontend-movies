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
import type { Lista, UpdateLista, MovieWithDirectors, Tag } from '@/types/Listas';
import { useListaStore } from '@/stores/lista';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useMovieStore } from '@/stores/movie';

const authStore = useAuthStore();
const { isAuthenticated, user } = storeToRefs(authStore);

const listaStore = useListaStore();
const movieStore = useMovieStore();
// const moviesList = ref(movies_json.movie.slice(0, 8));
const isSearching = ref(false);
const isUserOwnList = ref();
const isEditMode = ref(false);
const novaTag = ref('');
const moviesList = ref<MovieWithDirectors[]>([]);
// Objeto para guardar o estado original (antes da edição)
const originalData = ref('');

const props = defineProps<{
    id: number,
    slug: string
}>();

//const updateData: UpdateLista = reactive({
//    titulo: '',
//    comentario: '',
//    tags: [],
//    movies: []
//});
const updateData = ref<UpdateLista>({
    titulo: '',
    comentario: '',
    tags: [],
    movies: []
});

const adicionarTag = () => {
    const valor = novaTag.value.trim();

    // Evita tags vazias ou duplicadas
    if (valor && !updateData.value.tags?.includes(valor)) {
        // Adiciona ao array de tags que será enviado ao backend
        updateData.value.tags?.push(valor);
        novaTag.value = ''; // Limpa o input
    }
};

const removerTag = (index: number) => {
    updateData.value.tags?.splice(index, 1);
};

const removerFilmeDaLista = (id: number) => {
    // Filtramos o array para manter apenas os filmes que NÃO têm o ID clicado
    //moviesList.value = moviesList.value.filter(movie => movie.id !== id);
};

const lista = ref<Lista>();
const searchQuery = ref('');

async function loadLista() {
    if (isSearching.value) return;

    isSearching.value = true;
    try {

        const response = await listaStore.detailLista(props.id);

        const listaData = response;

        lista.value = listaData;
        if (user.value?.id == lista.value.user_id) {
            isUserOwnList.value = true;
        }

    } catch (error) {
        console.error("Erro na comunicação com a API:", error);
    } finally {
        isSearching.value = false;
    }
};

onMounted(() => {
    try {
        loadLista();
    } catch (error) {
        console.error("Erro ao carregar:", error);
    }
});

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

const handleDragEnd = async () => {
    if (!lista.value) return;

    // Criamos um array apenas com os IDs na nova ordem que o v-model gerou
    const orderedIds = lista.value.movies.map(m => m.id);
    console.log(orderedIds);
    try {
        await listaStore.reorderMoviesLista(lista.value.id, orderedIds);
        console.log("Ordem salva no banco!");
    } catch (error) {
        console.error("Erro ao salvar ordem:", error);
        // Opcional: Recarregar a lista caso dê erro para voltar a ordem original
    }
};


const toggleEditMode = async () => {
    if (!isEditMode.value) {
        // ENTRANDO NO MODO EDIÇÃO
        // Cria snapshot do que tem agora na lista
        const snapshot = {
            titulo: lista.value?.titulo,
            comentario: lista.value?.comentario,
            tags: lista.value?.tags.map(tag => tag.nome)
        };

        // Preenchemos o updateData e guardamos a string original para comparar depois
        updateData.value = JSON.parse(JSON.stringify(snapshot));
        originalData.value = JSON.stringify(snapshot);

        isEditMode.value = true;
    } else {
        // CLICOU EM SALVAR (SAINDO DO MODO EDIÇÃO)
        const currentData = JSON.stringify({
            titulo: updateData.value.titulo,
            comentario: updateData.value.comentario,
            tags: updateData.value.tags
        });

        // CHECAGEM: Se os dados forem idênticos ao original, apenas fecha
        if (currentData === originalData.value) {
            console.log("Nada mudou, não vou chamar a API.");
            isEditMode.value = false;
            return;
        }

        // Se chegou aqui, algo mudou, chama o método de atualizar
        try {
            if (!lista.value?.id) {
                throw new Error('Lista não encontrada');
            }
            const response = await listaStore.updateLista(lista.value.id, updateData.value);

        
            lista.value.titulo = response.data.titulo;
            lista.value.comentario = response.data.comentario;

            lista.value.tags = response.data.tags;


            isEditMode.value = false;
        } catch (error) {
            console.error("Erro ao atualizar:", error);
        }
    }
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

async function addMovie(movieId: number) {
    if (isSearching.value) return;

    isSearching.value = true;
    try {
        if (isUserOwnList.value) {
            if (!lista.value?.id) {
                throw new Error('Lista não encontrada');
            }
           

            const newMovies = lista.value.movies.map(movie => movie.id);
            newMovies.push(movieId);
            console.log('Lista de filmes Depois',newMovies);
          
            const listaMoviesAtualizada = await listaStore.updateLista(lista.value?.id, { movies: newMovies });
            
            lista.value.movies = listaMoviesAtualizada.data.movies;
            
        }
    } catch (error) {
        console.error('Search error:', error)
    } finally {
        searchQuery.value = '';
        moviesList.value = [];
        isSearching.value = false;
    }
};

async function updateLista() {
    if (isSearching.value) return;

    isSearching.value = true;
    try {
        if (isUserOwnList.value) {
            if (!lista.value?.id) {
                throw new Error('Lista não encontrada');
            }

            // remove movies
            const { movies, ...payload } = updateData.value;

            const listaAtualizada = await listaStore.updateLista(lista.value?.id, payload);

            //updateData.value.comentario = listaAtualizada.comentario;
            //updateData.value.titulo = listaAtualizada.titulo;
           // updateData.value.tags = listaAtualizada.tags.map(tag => tag.nome);
            //updateData.value.movies = listaAtualizada.movies;

            //lista.value = listaAtualizada;
        }

    } catch (error) {
        console.error('Search error:', error)
    } finally {
        isSearching.value = false;
    }
};
</script>
<template>
    <Navbar />
    <div class="bg-hero min-h-screen pt-24 pb-10">
        <div class="lg:max-w-3xl max-w-[95%] mx-auto relative z-30">

            <Transition name="fade-slide" mode="out-in">
                <!-- MODO EDIÇÃO -->
                <div v-if="isEditMode" key="edit" class="flex flex-col items-center">
                    <div class="relative w-full flex items-center justify-center mb-4">
                        <input v-model="updateData.titulo" type="text"
                            class="text-zinc-100 font-black text-3xl border bg-white/5 border-black p-2 rounded outline-none focus:border-[#00FCFF] drop-shadow-lg text-center w-full max-w-xl"
                            placeholder="Título da lista">
                        <button @click="toggleEditMode"
                            class="absolute right-0 hidden lg:block bg-[#00FCFF]/20 border border-[#00FCFF]/50 rounded-lg py-1.5 px-3 hover:bg-[#00FCFF]/30 cursor-pointer transition-all shadow-[0_0_15px_rgba(0,252,255,0.2)]">
                            <p class="text-zinc-100 text-[9px] uppercase tracking-tighter font-bold">Salvar Lista</p>
                        </button>
                    </div>

                    <textarea v-model="updateData.comentario"
                        class="w-full text-zinc-100 font-medium text-sm border bg-white/5 border-black p-4 rounded mb-8 outline-none focus:border-[#00FCFF] drop-shadow-lg text-center min-h-[100px]"
                        placeholder="Adicione um comentário sobre esta lista..."></textarea>
                    <div v-if="isEditMode" class="w-full flex flex-col gap-2 mb-8">
                        <label class="text-[#00FCFF] text-[10px] font-bold uppercase tracking-widest ml-1">
                            Tags da Lista
                        </label>

                        <div
                            class="flex flex-wrap items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-xl focus-within:border-[#00FCFF]/50 transition-all">

                            <!-- Badges das Tags já adicionadas -->
                            <span v-for="(tag, index) in updateData.tags" :key="index"
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

                <!-- MODO VISUALIZAÇÃO -->
                <div v-else key="view" class="flex flex-col items-center">
                    <div class="relative w-full flex items-center justify-center mb-4">
                        <h1 class="text-zinc-100 font-black text-3xl uppercase drop-shadow-lg text-center">
                            {{ lista?.titulo }}
                        </h1>

                        <button v-if="isUserOwnList" @click="toggleEditMode"
                            class="absolute right-0 hidden lg:block bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 hover:bg-white/10 cursor-pointer transition-all">
                            <p class="text-zinc-100 text-[9px] uppercase tracking-tighter font-bold">Editar Lista</p>
                        </button>
                    </div>

                    <p class="w-full text-zinc-300 font-medium text-sm px-2 mb-2 text-center italic opacity-80">
                        {{ lista?.comentario || 'Sem comentário.' }}
                    </p>

                    <div class="flex flex-wrap justify-center gap-2 mb-8">
                        <span v-for="(tag, index) in lista?.tags" :key="index"
                            class="bg-white/10 border border-white/20 rounded-lg py-1 px-2 ring-1 ring-[#00FCFF]/30 hover:bg-[#00FCFF]/10 transition-all">
                            <p class="text-white text-[8px] uppercase tracking-wider font-bold"> {{ tag.nome }} </p>
                        </span>
                    </div>
                </div>
            </Transition>

            <!-- ÁREA DE ADICIONAR FILMES (SÓ APARECE PARA O DONO) -->
            <Transition name="fade">
                <div v-if="isUserOwnList && isEditMode"
                    class="bg-white/5 backdrop-blur-xl border border-[#00FCFF]/20 rounded-2xl p-6 shadow-2xl relative z-50 mb-8">
                    <div class="flex flex-col gap-3">
                        <label class="text-[#00FCFF] text-xs font-bold uppercase tracking-wider ml-1">
                            Adicionar Filme para sua lista
                        </label>
                        <div class="relative">
                            <div
                                class="flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#00FCFF] transition-all">
                                <input :value="searchQuery"
                                    @input="searchQuery = ($event.target as HTMLInputElement).value" type="text"
                                    placeholder="Busque um filme para adicionar..."
                                    class="flex-1 bg-transparent border-none outline-none text-zinc-100 text-sm font-medium">
                            </div>
                            <div v-if="isSearching && searchQuery.length > 3" 
                                class="z-100 absolute left-0 top-full w-full mt-1 bg-zinc-900 border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] max-h-60 overflow-y-auto"
                                >
                                <p class="p-4 text-zinc-100 text-sm font-bold">Carregando...</p>
                            </div>
                            <div v-if="moviesList.length > 0"
                                class="z-100 absolute left-0 top-full w-full mt-1 bg-zinc-900 border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] max-h-60 overflow-y-auto">
                                <div v-for="movie in moviesList" :key="movie.id" @click="addMovie(movie.id)"
                                    class="p-4 border-b border-white/5 hover:bg-[#00FCFF]/10 cursor-pointer
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
            </Transition>

            <!-- LISTAGEM DE FILMES (DRAGGABLE) -->
            <div class="flex justify-end mb-4">
                <button @click="toggleEditMode"
                    class="lg:hidden bg-white/5 border border-white/10 rounded-lg py-1.5 px-3">
                    <p class="text-zinc-100 text-[9px] uppercase font-bold">{{ isEditMode ? 'Salvar' : 'Editar' }}</p>
                </button>
            </div>

            <draggable v-if="lista && lista.movies" v-model="lista.movies" item-key="id" tag="section"
                @end="handleDragEnd" handle=".drag-handle" ghost-class="opacity-50"
                class="grid grid-cols-2 sm:grid-cols-4 mt-4 gap-6 relative z-10">
                <template #item="{ element: movie }">
                    <div class="movie-card group">
                        <div class="flex flex-col items-center">
                            <RouterLink :to="{ name: 'MovieView', params: { lang: 'br', slug: movie.slug_pt } }"
                                class="relative">
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