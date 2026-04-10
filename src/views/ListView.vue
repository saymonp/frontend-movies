<script setup lang="ts">
import { computed, ref } from 'vue';
import Navbar from '@/components/Navbar.vue';
import TheFooter from '@/components/TheFooter.vue';
import movies_json from '../assets/movies.json';
import IconAddReview from '@/components/icons/IconAddReview.vue';
import IconAddToList from '@/components/icons/IconAddToList.vue';
import IconNavHam from '@/components/icons/IconNavHam.vue';
import IconDelete from '@/components/icons/IconDelete.vue';

const movies = ref(movies_json.movie);
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
</script>
<template>
    <Navbar />
    <div class="bg-hero min-h-screen pt-24 pb-10">
        <div class="lg:max-w-3xl max-w-[95%] mx-auto relative z-30">

            <div class="relative flex items-center justify-center mb-8">
                <h1 class="text-zinc-100 font-black text-3xl uppercase drop-shadow-lg text-center">
                    Comédia Romântica
                </h1>

                <button
                    class="absolute right-0 hidden lg:block bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 ring-1 ring-[#00FCFF]/20 hover:bg-[#00FCFF]/10 cursor-pointer transition-all">
                    <p class="text-zinc-100 text-[9px] uppercase tracking-tighter font-bold">Editar Lista</p>
                </button>
            </div>

            <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative z-50">
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

            <div class="lg:max-w-3xl max-w-[95%] mx-auto relative z-10">
                <div class="flex justify-end items-center gap-2 mb-1 mt-4">

                    <button
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
                <TransitionGroup tag="section" name="list"
                    class="grid grid-cols-2 sm:grid-cols-4 mt-4 gap-6 relative z-10">
                    <div v-for="movie in movies.slice(0, 8)" :key="movie.id" class="movie-card group">
                        <div class="flex flex-col items-center">
                            <RouterLink :to="{ name: 'MovieView', params: { lang: 'br', slug: movie.slug_br } }"
                                class="relative">
                                <img :src="movie.poster_thumb_br"
                                    class="w-full ring-2 ring-white/10 group-hover:ring-[#00FCFF] rounded-lg transition-all duration-300 shadow-lg group-hover:shadow-[#00FCFF]/20">
                            </RouterLink>

                            <div class="w-full mt-3 text-center">
                                <p class="text-sm font-bold text-zinc-100 truncate px-1">{{ movie.titulo }}</p>

                                <div class="flex items-center justify-between mt-2 px-1">
                                    <IconDelete
                                        class="w-6 h-6 text-[#ff0077] hover:text-[#00FCFF] cursor-pointer transition-colors" />
                                    <span class="text-[10px] font-black text-zinc-400">IMDb {{ movie.rating }}</span>
                                    <IconNavHam
                                        class="w-5 h-5 text-zinc-500 hover:text-[#00FCFF] cursor-pointer transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>
                </TransitionGroup>
            </div>
        </div>
    </div>
    <TheFooter />
</template>