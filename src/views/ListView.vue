<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import { computed, ref } from 'vue';
import movies_json from '../assets/movies.json'
import IconAddReview from '@/components/icons/IconAddReview.vue'
import IconAddToList from '@/components/icons/IconAddToList.vue'

import TheFooter from '@/components/TheFooter.vue';

const movies = ref(movies_json.movie)

const props = defineProps<{
    id: string
}>();

const filterRating = ref(0)
const showFilter = ref(false)

const filterShow = computed(() => {
    // Arredonda para a primeira casa decimal de forma mais estável
    return (Math.round(filterRating.value * 10) / 10).toFixed(1);
});

const loggedIn = ref(false);

const sugestoesPesquisa = [
    { id: 1, movie: "Late Night with The Devil (2023)", diretor: "Cameron Cairnes" },
    { id: 2, movie: "Breathless (1960)", diretor: "Jean-Luc Godarc" },
    { id: 3, movie: "Bedazzled (2000)", diretor: "Harol Ramis" },
]

</script>
<template>
    <Navbar />
    <div class="bg-hero">
        <div class="lg:max-w-3xl max-w-13/14 mx-auto mt-10">
            <h1 class="text-zinc-100 font-black text-2xl uppercase drop-shadow-md text-center">
                Comédia Romântica
            </h1>
            <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 ring-1 ring-white/10">

                <div class="gap-4">

                    <div class="flex flex-col gap-3">
                        <p class="text-zinc-100">Adicionar Filme para sua lista</p>
                        <div
                            class="flex items-center bg-white/5 border border-white/20 rounded-xl px-2 py-1.5 ring-[#00FCFF] shadow-[0_0_10px_rgba(0,252,255,0.2)]">

                            <input type="text" placeholder="Busca..."
                                class="flex-1 bg-transparent border-none outline-none text-zinc-100 text-[11px] font-bold min-w-0">
                            <div clas="relative">



                            </div>
                        </div>

                        <div class="px-1">


                        </div>
                    </div>



                </div>
            </div>

            <TransitionGroup tag="section" name="list"
                class="grid grid-cols-2 sm:grid-cols-4 max-w-3xl mt-3 gap-5 p-2.5 mx-auto">
                <div v-for="movie in movies.slice(0, 6)" :key="movie.id" :movie="movie" :filterRating="filterRating"
                    class="movie-card">

                    <div class="flex flex-col items-center w-fit mx-auto">
                        <RouterLink :to="{
                            name: 'MovieView',
                            params: {
                                lang: $i18n.locale,
                                slug: $i18n.locale === 'br' ? movie.slug_br : movie.slug_en
                            }
                        }">
                            <img :src="movie.poster_thumb_br" class="max-w-full ring-2 ring-[#7075AB] rounded-sm mb-2">
                        </RouterLink>
                        <div class="w-full">
                            <p class="text-center text-base font-semibold text-zinc-100">{{ movie.titulo }}</p>
                            <div class="flex items-center justify-between px-2.5">
                                <IconAddReview
                                    class="w-8 text-[#97A7CB] hover:text-[#00FCFF] transition-colors duration-300" />
                                <p class="text-center text-xs font-semibold text-zinc-100">IMDb {{ movie.rating
                                }}
                                </p>
                                <IconAddToList
                                    class="w-6 text-[#97A7CB] hover:text-[#00FCFF] transition-colors duration-300" />
                            </div>
                        </div>
                    </div>
                </div>

            </TransitionGroup>
        </div>




    </div>
<TheFooter />
</template>