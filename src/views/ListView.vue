<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import Navbar from '@/components/Navbar.vue';
import TheFooter from '@/components/TheFooter.vue';
import movies_json from '../assets/movies.json';
import IconAddReview from '@/components/icons/IconAddReview.vue';
import IconAddToList from '@/components/icons/IconAddToList.vue';
import IconDrag from '@/components/icons/IconDrag.vue';
import IconNavHam from '@/components/icons/IconNavHam.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import draggable from 'vuedraggable';
import type { Lista, UpdateLista, Movie } from '@/types/Listas';
import { useListaStore } from '@/stores/lista';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { isAuthenticated, user } = storeToRefs(authStore);

const listaStore = useListaStore();
const moviesList = ref(movies_json.movie.slice(0, 8));
const isSearching = ref(false);
const isUserOwnList = ref();
const isEditMode = ref(false);

const props = defineProps<{
    id: number,
    slug: string
}>();

const updateData: UpdateLista = reactive({
    titulo: '',
    comentario: '',
    tags: [],
});

//const listaData = ref<CreateLista>({
//    titulo: '',
//    comentario: '',
//    idioma: 'pt',
//    slug: '',
//    tags: [],
//    movies: []
//});

const removerFilmeDaLista = (id: number) => {
    // Filtramos o array para manter apenas os filmes que NÃO têm o ID clicado
    moviesList.value = moviesList.value.filter(movie => movie.id !== id);
};

const lista = ref<Lista>();
const searchQuery = ref('');

// Sugestões mockadas (em um app real, viriam de uma API)
const sugestoesLista = [
    { id: 1, movie: "Late Night with The Devil (2023)", diretor: "Cameron Cairnes" },
    { id: 2, movie: "LaBreathless (1960)", diretor: "Jean-Luc Godard" },
    { id: 3, movie: "LaBedazzled (2000)", diretor: "Harold Ramis" },
];

// Filtra as sugestões conforme o usuário digita
const filteredSugestoes = computed(() => {
    if (searchQuery.value.length < 2) return [];
    console.log(sugestoesLista.filter(s =>
        s.movie.toLowerCase().includes(searchQuery.value.toLowerCase())
    ))
    return sugestoesLista.filter(s =>
        s.movie.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

async function loadLista() {
    if (isSearching.value) return;

    isSearching.value = true;
    try {

        const response = await listaStore.detailLista(props.id);

        const listaData = response;

        lista.value = listaData;
        if(user.value?.id == lista.value.user_id){
            isUserOwnList.value = true;

            updateData.comentario = listaData.comentario;
            updateData.titulo = listaData.titulo;
            updateData.tags = listaData.tags;
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

const toggleEditMode = () => {
    isEditMode.value = !isEditMode.value;
}



</script>
<template>
    <Navbar />
    <div class="bg-hero min-h-screen pt-24 pb-10">
        <div class="lg:max-w-3xl max-w-[95%] mx-auto relative z-30">

            <div v-if="!isEditMode" class="relative flex items-center justify-center mb-8">
                <h1 class="text-zinc-100 font-black text-3xl uppercase drop-shadow-lg text-center">
                    {{ lista?.titulo }}
                </h1>

                <button @click="toggleEditMode"
                    class="absolute right-0 hidden lg:block bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 ring-1 ring-[#00FCFF]/20 hover:bg-[#00FCFF]/10 cursor-pointer transition-all">
                    <p class="text-zinc-100 text-[9px] uppercase tracking-tighter font-bold">Editar Lista</p>
                </button>
            </div>
            <div v-if="isEditMode" class="relative flex items-center justify-center mb-8">
                <input v-model="updateData.titulo" placeholder="Título da sua Review"  type="text" class="text-zinc-100 font-black text-3xl border bg-white/5 border-black p-2 rounded mb-3 outline-none focus:border-[#00FCFF] drop-shadow-lg text-center">
                <button @click="toggleEditMode"
                    class="absolute right-0 hidden lg:block bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 ring-1 ring-[#00FCFF]/20 hover:bg-[#00FCFF]/10 cursor-pointer transition-all">
                    <p class="text-zinc-100 text-[9px] uppercase tracking-tighter font-bold">Salvar Lista</p>
                </button>
            </div>
            <div v-if="!isEditMode" class="relative flex items-center justify-center mb-3">
                <p placeholder="Título da sua Review"  type="text" class="w-full text-zinc-100 font-black text-sm p-2 rounded mb-3 outline-none drop-shadow-lg text-center">{{ lista?.comentario }}</p>
            </div>
            <div v-if="isEditMode" class="relative flex items-center justify-center mb-8">
                <textarea v-model="updateData.comentario" placeholder="Título da sua Review"  type="text" class="w-full text-zinc-100 font-black text-sm border bg-white/5 border-black p-2 rounded mb-3 outline-none focus:border-[#00FCFF] drop-shadow-lg text-center"></textarea>
            </div>
           
            <div v-if="isUserOwnList" class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative z-50">
                <div class="flex flex-col gap-3">
                    <label class="text-zinc-400 text-xs font-bold uppercase tracking-wider ml-1">
                        Adicionar Filme para sua lista
                    </label>

                    <div class="relative">
                        <div
                            class="flex items-center bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#00FCFF] focus-within:ring-1 focus-within:ring-[#00FCFF]/30 transition-all">
                            <input :value="searchQuery" @input="searchQuery = ($event.target as HTMLInputElement).value"
                                type="text" placeholder="Digite o nome do filme..."
                                class="flex-1 bg-transparent border-none outline-none text-zinc-100 text-sm font-medium">
                            <span v-if="searchQuery" @click="searchQuery = ''"
                                class="text-zinc-500 cursor-pointer hover:text-white">✕</span>
                        </div>

                        <div v-if="filteredSugestoes.length > 0"
                            class="z-100 absolute left-0 top-full w-full mt-1 bg-zinc-900 border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] max-h-60 overflow-y-auto">
                            <div v-for="sugestao in filteredSugestoes" :key="sugestao.id"
                                class="p-4 border-b border-white/5 hover:bg-[#00FCFF]/10 cursor-pointer transition-colors group">
                                <p class="text-zinc-100 text-sm font-bold group-hover:text-[#00FCFF]">{{ sugestao.movie
                                    }}</p>
                                <p class="text-zinc-500 text-[10px]">{{ sugestao.diretor }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             <div v-if="!isEditMode" class="relative flex items-center justify-center mt-2 mb-1">
                <span v-for="(tag, index) in lista?.tags" :key="index"
                class="m-1 bg-white/10 border border-white/20 rounded-lg py-1 px-2 ring-1 ring-[#00FCFF]/50 hover:bg-[#00FCFF]/10 cursor-pointer transition-all h-fit">
                <p class=" text-white text-[8px] uppercase tracking-wider font-bold text-center"> {{ tag.nome }}
                </p>
              </span>
            </div>
            <div v-if="isEditMode" class="transition-all relative flex items-center justify-center mb-8">
                <textarea v-model="updateData.comentario" placeholder="Título da sua Review"  type="text" class="w-full text-zinc-100 font-black text-sm border bg-white/5 border-black p-2 rounded mb-3 outline-none focus:border-[#00FCFF] drop-shadow-lg text-center"></textarea>
            </div>
            <div class="lg:max-w-3xl max-w-[95%] mx-auto relative z-10">
                <div class="flex justify-end items-center gap-2 mb-1 mt-4">

                    <button
                        @click="toggleEditMode"
                        class="block lg:hidden bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 ring-1 ring-[#00FCFF]/20 hover:bg-[#00FCFF]/10 cursor-pointer transition-all">
                        <p class="text-zinc-100 text-[9px] uppercase tracking-tighter font-bold text-center">Editar
                            Lista</p>
                    </button>

                    <button
                        class="bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 ring-1 ring-[#00FCFF]/20 hover:bg-[#00FCFF]/10 cursor-pointer transition-all">
                        <p class="text-zinc-100 text-[9px] uppercase tracking-tighter font-bold text-center">Ordenar por
                        </p>
                    </button>

                </div>
                <draggable v-if="lista && lista.movies" v-model="lista.movies" item-key="id" tag="section"
                    @end="handleDragEnd"
                    handle=".drag-handle" ghost-class="opacity-50"
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
    </div>
    <TheFooter />
</template>

<style>
.flip-list-move {
    transition: transform 0.5s;
}

.no-move {
    transition: transform 0s;
}
</style>