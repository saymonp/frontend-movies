<script setup lang="ts">
import { ref } from 'vue';
import IconAddReview from '@/components/icons/IconAddReview.vue'
import IconAddToList from '@/components/icons/IconAddToList.vue'
import IconFilter from '@/components/icons/IconFilter.vue'
import TheFooter from '@/components/TheFooter.vue';
import Navbar from '@/components/Navbar.vue';
import movies_json from '../assets/movies.json'

import SearchBar from '@/components/SearchBar.vue';
import SearchBar2 from '@/components/SearchBar2.vue';

let movies: any = ref([])
movies = movies_json.movie
console.log(movies)

let filterRating = 5
</script>

<template>
    <div class="bg-zinc-50 dark:bg-zinc-900">
        <Navbar />
        <div class="bg-hero">

            <div class="relative z-10 w-full h-auto">

                <div class="relative w-full h-auto overflow-hidden">

                    <div
                        class="relative w-full h-auto mx-auto sm:h-[450px] mask-[linear-gradient(to_bottom,black_55%,transparent_100%)] sm:mask-[linear-gradient(to_bottom,black_70%,transparent_100%)]">
                        <div class="absolute inset-0 bg-[#CC00CC] opacity-20"></div>
                        <div class="absolute inset-0 bg-[#CC00CC]"></div>

                        <img src="../assets/Banner.jpg" class="relative w-full h-full object-cover opacity-73" />
                    </div>

                    <img src="../assets/logo Filmeiro.svg" alt="Logo"
                        class="sm:hidden absolute top-4/5 left-1/2 -translate-x-1/2 -translate-y-1/2 w-65 z-10" />

                    <div class="hidden sm:flex absolute bottom-10 left-0 w-full flex-col items-center z-20">
                        <p class="text-white text-3xl text-center font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                            Registre os filmes que você assistiu.
                        </p>
                        <p
                            class="text-[#00FCFF] text-xl text-center font-bold mt-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                            Crie listas para salvar seus filmes favoritos.
                        </p>

                        <button class="mt-6 bg-[#00FCFF] text-black font-bold py-3 px-10 rounded-md 
                transition-all duration-300
                shadow-[0_0_15px_rgba(0,252,255,0.8)]
                hover:shadow-[0_0_30px_rgba(0,252,255,1)]
                hover:scale-105 active:scale-95">
                            Comece agora — É Grátis
                        </button>
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
                        <button class="bg-[#00FCFF] text-black font-bold py-2 px-6 rounded-md 
                transition-all duration-300
                shadow-[0_0_15px_rgba(0,252,255,0.8)]
                hover:scale-105 active:scale-95">
                            Comece agora — É Grátis
                        </button>
                    </div>
                </div>



                <div class="lg:max-w-3xl max-w-13/14 mx-auto mt-10">
                    <div
                        class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 ring-1 ring-white/10">

                        <div class="grid grid-cols-2 sm:grid-cols-12 gap-4">

                            <div class="col-span-1 sm:col-span-4 flex flex-col gap-3">

                                <div
                                    class="flex items-center bg-white/5 border border-white/20 rounded-xl px-2 py-1.5 ring-[#00FCFF] shadow-[0_0_10px_rgba(0,252,255,0.2)]">
                                    <input type="text" placeholder="Busca..."
                                        class="flex-1 bg-transparent border-none outline-none text-zinc-100 text-[11px] font-bold min-w-0">
                                    <button class="flex-none ml-2 hover:scale-110 transition-transform">
                                        <IconFilter class="w-4 text-[#2adde0]" />
                                    </button>
                                </div>

                                <div class="px-1">
                                    <div class="flex justify-between items-center text-[9px] mb-1">
                                        <span class="text-zinc-500 uppercase font-bold">Nota</span>
                                        <span class="text-[#00FCFF] font-black">{{ filterRating }}</span>
                                    </div>
                                    <input type="range" min="0" max="10" step="0.1" v-model="filterRating"
                                        class="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00FCFF]">
                                </div>
                            </div>

                            <div class="col-span-1 sm:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <button v-for="genero in ['Ação', 'Comédia', 'Romance', 'Drama', 'Terror', 'Aventura']"
                                    :key="genero"
                                    class="bg-white/10 border border-white/20 rounded-lg py-1 px-2 ring-1 ring-[#00FCFF]/50 hover:bg-[#00FCFF]/10 cursor-pointer transition-all h-fit">
                                    <p class="text-white text-[10px] uppercase tracking-wider font-bold text-center">{{
                                        genero
                                        }}</p>
                                </button>
                                <div v-for="extra in ['Animação', 'Fantasia']" :key="extra"
                                    class="hidden sm:block bg-white/10 border border-white/20 rounded-lg py-1 px-2 ring-1 ring-[#00FCFF]/50 hover:bg-[#00FCFF]/10 cursor-pointer transition-all h-fit">
                                    <p class="text-white text-[10px] uppercase tracking-wider font-bold text-center">{{
                                        extra
                                        }}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <section class="grid grid-cols-2 sm:grid-cols-4 max-w-3xl mt-3 gap-5 p-2.5 mx-auto">
                    <div v-for="movie in movies" :key="movie.id" :movie="movie">
                        <div class="flex flex-col items-center w-fit mx-auto">
                            <img :src="movie.poster_thumb_br" class="max-w-full ring-2 ring-[#7075AB] rounded-sm mb-2">

                            <div class="w-full">
                                <p class="text-center text-base font-semibold text-zinc-100">{{ movie.titulo }}</p>
                                <div class="flex items-center justify-between px-2.5">
                                    <IconAddReview
                                        class="w-8 text-[#97A7CB] hover:text-[#00FCFF] transition-colors duration-300" />
                                    <p class="text-center text-xs font-semibold text-zinc-100">IMDb {{ movie.rating }}
                                    </p>
                                    <IconAddToList
                                        class="w-6 text-[#97A7CB] hover:text-[#00FCFF] transition-colors duration-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
        <TheFooter />
    </div>
</template>
