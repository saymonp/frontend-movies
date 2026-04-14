<script setup lang="ts">
import { computed, ref } from 'vue';
import IconAddReview from '@/components/icons/IconAddReview.vue'
import IconAddToList from '@/components/icons/IconAddToList.vue'
import IconFilter from '@/components/icons/IconFilter.vue'
import IconStar from '@/components/icons/IconStar.vue';
import IconReviewEstrelas from '@/components/icons/IconReviewEstrelas.vue';
import IconReviewStar from '@/components/icons/IconReviewStar.vue';
import TheFooter from '@/components/TheFooter.vue';
import Navbar from '@/components/Navbar.vue';
import movies_json from '../assets/movies.json'

import SearchBar from '@/components/SearchBar.vue';
import SearchBar2 from '@/components/SearchBar2.vue';

const movies = ref(movies_json.movie);
const filterRating = ref(0)
const showFilter = ref(false)

const filterShow = computed(() => {
    // Arredonda para a primeira casa decimal de forma mais estável
    return (Math.round(filterRating.value * 10) / 10).toFixed(1);
});

const loggedIn = ref(true);


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
</script>

<template>
    <div class="bg-zinc-50 dark:bg-zinc-900">
        <Navbar :loggedIn="loggedIn" />
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
                            {{ loggedIn === true ? "Acesse suas Listas" : "Comece agora — É Grátis" }}
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
                            {{ loggedIn === true ? "Acesse suas Listas" : "Comece agora — É Grátis" }}
                        </button>
                        </RouterLink>
                    </div>
                </div>

               <div class="lg:max-w-3xl max-w-13/14 mx-auto mt-10">
    <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 ring-1 ring-white/10">
        
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-6">
            
            <div class="sm:col-span-4 flex flex-col gap-4">
                <div class="flex items-center bg-white/5 border border-white/20 rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-[#00FCFF] transition-all">
                    <input type="text" placeholder="Busca..."
                        class="flex-1 bg-transparent border-none outline-none text-zinc-100 text-xs font-bold min-w-0">
                    
                    <div class="relative">
                        <button @click="showFilter = !showFilter"
                            class="flex items-center gap-1 ml-2 px-2 py-1 bg-[#00FCFF]/10 rounded-md hover:bg-[#00FCFF]/20 transition-all group">
                            <span class="text-[9px] text-[#00FCFF] font-black uppercase tracking-tighter">Gêneros</span>
                            <IconFilter class="w-3 text-[#00FCFF]" />
                        </button>

                        <div v-if="showFilter" @click="showFilter = false" class="fixed inset-0 z-40"></div>
                        <div v-show="showFilter"
                            class="absolute right-0 mt-3 z-50 bg-[#020036]/95 backdrop-blur-2xl border border-white/20 rounded-xl p-4 shadow-2xl w-[220px]">
                            <p class="text-[#00FCFF] text-[10px] font-black uppercase tracking-widest border-b border-white/10 pb-2 mb-3">
                                Selecionar Gêneros
                            </p>
                            <div class="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                <label v-for="g in ['Ação', 'Comédia', 'Drama', 'Terror', 'Ficção', 'Romance', 'Animação']" :key="g" 
                                    class="flex items-center gap-3 cursor-pointer group">
                                    <div class="relative flex items-center">
                                        <input type="checkbox" class="peer appearance-none w-4 h-4 border border-white/20 rounded checked:bg-[#00FCFF] checked:border-[#00FCFF] transition-all">
                                        <span class="absolute text-black font-bold text-[10px] left-1 opacity-0 peer-checked:opacity-100">✓</span>
                                    </div>
                                    <span class="text-zinc-300 text-[11px] font-bold group-hover:text-white transition-colors">{{ g }}</span>
                                </label>
                            </div>
                            <button @click="showFilter = false" class="w-full mt-4 py-2 bg-[#00FCFF] text-black text-[10px] font-black uppercase rounded-lg hover:brightness-110 transition-all">
                                Aplicar Filtros
                            </button>
                        </div>
                    </div>
                </div>

                <div class="px-1">
                    <div class="flex justify-between items-center text-[9px] mb-1">
                        <span class="text-zinc-500 uppercase font-bold tracking-widest">Nota Mínima</span>
                        <span class="text-[#00FCFF] font-black bg-[#00FCFF]/10 px-2 py-0.5 rounded">{{ filterRating }}</span>
                    </div>
                    <input type="range" min="0" max="10" step="0.5" v-model="filterRating"
                        class="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00FCFF]">
                </div>
            </div>

            <div class="sm:col-span-8 flex flex-col gap-4">
                
                <div class="grid grid-cols-3 gap-3">
                    <div class="flex flex-col gap-1">
                        <label class="text-[9px] text-zinc-500 uppercase font-bold ml-1">Ano</label>
                        <select class="bg-white/5 border border-white/10 p-2 rounded-lg text-[10px] text-white outline-none focus:border-[#00FCFF] cursor-pointer">
                            <option class="bg-zinc-900">Todos</option>
                            <option class="bg-zinc-900">2026</option>
                            <option class="bg-zinc-900">2025</option>
                        </select>
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="text-[9px] text-zinc-500 uppercase font-bold ml-1">Diretor</label>
                        <select class="bg-white/5 border border-white/10 p-2 rounded-lg text-[10px] text-white outline-none focus:border-[#00FCFF] cursor-pointer">
                            <option class="bg-zinc-900">Qualquer um</option>
                            <option class="bg-zinc-900">Christopher Nolan</option>
                            <option class="bg-zinc-900">Denis Villeneuve</option>
                        </select>
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="text-[9px] text-zinc-500 uppercase font-bold ml-1">Idioma</label>
                        <select class="bg-white/5 border border-white/10 p-2 rounded-lg text-[10px] text-white outline-none focus:border-[#00FCFF] cursor-pointer">
                            <option class="bg-zinc-900">Original</option>
                            <option class="bg-zinc-900">Português</option>
                            <option class="bg-zinc-900">Inglês</option>
                        </select>
                    </div>
                </div>

                <div class="flex gap-2 mt-auto">
                    <button v-for="tag in ['Destaques', '2026', 'Maiores Bilheterias']" :key="tag"
                        class="flex-1 bg-white/5 border border-white/10 rounded-xl py-2.5 px-2 hover:border-[#00FCFF]/50 hover:bg-[#00FCFF]/5 transition-all group">
                        <p class="text-zinc-400 text-[10px] uppercase tracking-tighter font-black group-hover:text-[#00FCFF] text-center">
                            {{ tag }}
                        </p>
                    </button>
                </div>

            </div>
        </div>
    </div>
</div>

                <TransitionGroup tag="section" name="list"
    class="grid grid-cols-2 sm:grid-cols-4 max-w-3xl mt-3 gap-5 p-2.5 mx-auto">
    
    <div v-for="movie in movies.filter((elemento: any) => { return elemento.rating >= filterRating })"
        :key="movie.id" 
        class="relative flex flex-col items-center w-full"
    >
        <RouterLink :to="{
            name: 'MovieView',
            params: {
                lang: $i18n.locale,
                slug: $i18n.locale === 'br' ? movie.slug_br : movie.slug_en
            }
        }" class="w-full">
            <img :src="movie.poster_thumb_br"
                class="w-full aspect-[2/3] object-cover ring-2 ring-[#7075AB] rounded-sm mb-2 shadow-lg">
        </RouterLink>

        <div class="relative w-full">
            <div class="flex flex-col items-center">
                <div class="w-full mt-1">
                    <p class="text-center text-xs sm:text-sm font-bold text-zinc-100 truncate px-1">
                        {{ movie.titulo }}
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
                            <button @click="toggleQuickReview(movie.id)" class="flex-1 bg-[#00FCFF] text-black text-[10px] font-black uppercase py-2 rounded-md">OK</button>
                            <button @click="toggleQuickReview(movie.id)" class="px-2 text-zinc-500 hover:text-white text-[10px]">✕</button>
                        </div>
                    </div>
                </div>
            </Transition>

            <Transition name="fade-slide">
                <div v-if="activeListId === movie.id"
                    class="absolute top-full left-0 right-0 z-[60] mt-2 bg-[#0f0f0f]/95 border border-white/10 rounded-xl p-4 shadow-[0_15px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                    <div class="flex flex-col gap-3">
                        <p class="text-[10px] text-zinc-500 uppercase font-black border-b border-white/5 pb-1">Salvar em:</p>
                        <div class="flex flex-col gap-2 max-h-32 overflow-y-auto pr-1">
                            <label v-for="lista in minhasListas" :key="lista.id" class="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" v-model="lista.selecionada" class="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#00FCFF]">
                                <span class="text-zinc-300 text-[11px] truncate">{{ lista.nome }}</span>
                            </label>
                        </div>
                        <button @click="activeListId = null" class="w-full bg-white/10 hover:bg-[#00FCFF] text-white hover:text-black text-[9px] font-black py-2 rounded-md transition-all">Concluir</button>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</TransitionGroup>
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
