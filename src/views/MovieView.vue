<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import Navbar from '@/components/Navbar.vue';
import IconStar from '@/components/icons/IconStar.vue';
import IconWatchLater from '@/components/icons/IconWatchLater.vue';
import IconAddToList from '@/components/icons/IconAddToList.vue';
import IconCheck from '@/components/icons/IconCheck.vue';

import movie_json from '../assets/movieDetalhes.json';
import movies_json from '../assets/movies.json'

const abaAtiva = ref('generos');

const loggedIn = ref(true);
const props = defineProps<{
  slug: string
}>();

const { locale } = useI18n();

// Computed para encontrar o filme toda vez que o slug ou o idioma mudar
const movie = computed(() => {
  const slugKey = locale.value === 'br' ? 'slug_pt' : 'slug_en';

  // Buscamos o filme que contenha o slug da URL em qualquer uma das linguagens
  // Isso permite que o usuário acesse o link em EN mesmo estando no site em BR
  return movie_json.find(m => m.slug_br === props.slug || m.slug_en === props.slug);
});

// Opcional: Traduzir campos dinâmicos do JSON
const movieTitle = computed(() => {
  return locale.value === 'br' ? movie.value?.nome_br : movie.value?.nome_en;
});

const rating = ref(0); // Valor inicial
const hoverRating = ref(0); // Para efeito visual ao passar o mouse

const selectRating = (val: number) => {
  rating.value = val;
};


const movies = ref(movies_json.movie);
</script>

<template>
  <div class="bg-zinc-50 dark:bg-zinc-900">
    <Navbar :loggedIn="loggedIn" />
    <div class="bg-hero">
      <div v-if="movie" class="relative z-10 w-full h-auto">

        <div class="relative w-full h-auto overflow-hidden">



          <div
            class="relative w-full h-auto mx-auto max-w-[1440px] h-auto lg:max-w-[400%] lg:max-h-[450px] object-cover object-top mask-[linear-gradient(to_bottom,black_55%,transparent_100%)] sm:mask-[linear-gradient(to_bottom,black_70%,transparent_100%)]">

            <div class="absolute inset-0 bg-[#CC00CC] opacity-20"></div>

            <div class="absolute inset-0 bg-[#CC00CC]"></div>



            <img :src="movie.backdrop_path_br" class="relative w-full h-full object-cover opacity-73" />

          </div>
        </div>

        <div class="relative z-20 px-4 -mt-13 sm:-mt-18 lg:max-w-5xl  mx-auto">



          <div class="mt-2 flex gap-2 lg:gap-10 lg:place-content-around">
            <div
              class="flex-1 flex flex-col gap-1 lg:flex-row lg:flex-wrap lg:items-baseline lg:gap-x-4 h-fit lg:max-w-[800px]">
              <h1 class="text-zinc-100 font-black text-2xl uppercase drop-shadow-md">
                {{ movieTitle }}
              </h1>
              <p class="items-center justify-center text-zinc-300 font-bold leading-relaxed">{{
                movie.release_date?.slice(0, 4) }}
              </p>
              <p class="text-zinc-400 leading-relaxed">Dirigido por <span class="font-bold text-zinc-300">{{
                movie.diretores }}</span></p>
              <p class="text-zinc-400 leading-relaxed drop-shadow-sm basis-full">{{ movie.tagline_br }}</p>
              <p class="text-zinc-400 leading-relaxed mb-2">{{ movie.duracao }} mins</p>
              <div class="mt-2 hidden lg:block">
                <p class="text-zinc-400 leading-relaxed">
                  {{ locale === 'br' ? movie.descricao_br : movie.descricao_en }}
                </p>
              </div>
              <button
                class="mt-2 w-fit lg:basis-auto bg-white/5 border border-white/20 text-white rounded-lg py-1 px-4 ring-1 ring-[#00FCFF]/50 hover:bg-[#00FCFF]/10 cursor-pointer transition-all">
                Fazer Review
              </button>
              <!-- Estrelas -->
              <div class="mt-4 flex lg:basis-full lg:items-center">
                <button v-for="star in 5" :key="star" type="button" @click="selectRating(star)"
                  @mouseenter="hoverRating = star" @mouseleave="hoverRating = 0"
                  class="p-1 transition-transform active:scale-90 cursor-pointer">
                  <IconStar class="w-4 h-4 lg:w-6 lg:h-6 transition-colors duration-200" :class="star <= (hoverRating || rating)
                    ? 'text-[#00FCFF] drop-shadow-[0_0_8px_#00FCFF]'
                    : 'text-zinc-600'" />
                </button>
                <span class="text-[#00FCFF] font-black text-l italic">
                  {{ rating }}/5
                </span>
              </div>
              <div class="hidden lg:block">
                <div class="grid grid-cols-3 gap-4 mx-auto lg:mx-0 w-fit lg:w-full max-w-sm mt-6 lg:mt-1 lg:basis-full">

                  <div class="  flex flex-col items-center lg:items-start gap-1">
                    <IconWatchLater class="w-6 h-6 lg:w-5 lg:h-5 text-zinc-100 opacity-80" />
                    <span class="text-zinc-100 text-[10px] lg:text-xs text-center lg:text-left">Assistir mais
                      Tarde</span>
                  </div>

                  <div class="flex flex-col items-center lg:items-start gap-1">
                    <IconAddToList class="w-6 h-6 lg:w-5 lg:h-5 text-zinc-100 opacity-80" />
                    <span class="text-zinc-100 text-[10px] lg:text-xs text-center lg:text-left">Salvar na Lista</span>
                  </div>

                  <div class="flex flex-col items-center lg:items-start gap-1">
                    <IconCheck class="w-6 h-6 lg:w-5 lg:h-5 text-zinc-100 opacity-80" />
                    <span class="text-zinc-100 text-[10px] lg:text-xs text-center lg:text-left">Assistido</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col ">
              <div class="shrink-0 ml-auto"><img :src="movie.poster_path_br"
                  class="-mt-1 w-40 sm:w-70 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
              </div>


            </div>

          </div>
          <div clas="block lg:hidden">
            <div class="grid grid-cols-3 gap-4 mx-auto lg:mx-0 w-fit lg:w-full max-w-md mt-9 lg:mt-6">
              <div class="flex flex-col items-center gap-2">
                <IconWatchLater class="w-7 h-7 lg:w-10 text-zinc-100" />
                <span class="text-zinc-100 text-xs lg:text-sm text-center">Assistir mais Tarde</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <IconAddToList class="w-7 h-7 lg:w-10 text-zinc-100" />
                <span class="text-zinc-100 text-xs lg:text-sm text-center">Salvar na Lista</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <IconCheck class="w-7 h-7 lg:w-10 text-zinc-100" />
                <span class="text-zinc-100 text-xs lg:text-sm text-center">Assistido</span>
              </div>
            </div>
          </div>
          <div class="mt-8 block lg:hidden">
            <p class="text-zinc-400 leading-relaxed">
              {{ locale === 'br' ? movie.descricao_br : movie.descricao_en }}
            </p>
          </div>

        </div>
        <div class="lg:max-w-5xl mx-auto px-4">
          <div class="flex gap-6 border-b border-white/10">
            <button @click="abaAtiva = 'generos'"
              :class="abaAtiva === 'generos' ? 'text-[#00FCFF] border-b-2 border-[#00FCFF]' : 'text-zinc-500'"
              class="pb-2 mt-8 font-black text-lg uppercase transition-all cursor-pointer outline-none">
              Gêneros
            </button>

            <button @click="abaAtiva = 'detalhes'"
              :class="abaAtiva === 'detalhes' ? 'text-[#00FCFF] border-b-2 border-[#00FCFF]' : 'text-zinc-500'"
              class="pb-2 mt-8 font-black text-lg uppercase transition-all cursor-pointer outline-none">
              Detalhes
            </button>
          </div>

          <div class="mt-4">
            <div v-if="abaAtiva === 'generos'" class="flex flex-wrap gap-2">
              <span v-for="(genero, index) in movie.generos" :key="index"
                class="bg-zinc-800 text-zinc-100 px-3 py-1 rounded-full text-sm border border-white/5">
                {{ genero }}
              </span>
            </div>

            <div v-if="abaAtiva === 'detalhes'" class="text-zinc-400 text-sm space-y-2">
              <p><span class="text-zinc-100 font-bold">Título Original:</span> {{ movie.original_title }}</p>
              <p><span class="text-zinc-100 font-bold">Idioma:</span> {{ movie.original_language }}</p>
              <p><span class="text-zinc-100 font-bold">Produtoras:</span> {{ movie.production_companies }}</p>
            </div>
          </div>
        </div>
        <div class="lg:max-w-5xl  mx-auto">
          <h1 class="mt-8 text-zinc-100 font-black text-lg uppercase drop-shadow-md">
            Filmes com a mesma pegada
          </h1>
          <div tag="section" name="list"
     class="grid grid-cols-4 sm:grid-cols-4 mt-3 gap-2 sm:gap-5 mx-auto w-full max-w-5xl px-2">
  
  <div v-for="movie in movies.slice(0, 4)" :key="movie.id" 
       class="movie-card flex flex-col items-center">

    <RouterLink :to="{
        name: 'MovieView',
        params: {
            lang: $i18n.locale,
            slug: $i18n.locale === 'br' ? movie.slug_br : movie.slug_en
        }
    }" class="w-full">
      <img :src="movie.poster_thumb_br"
           class="w-full h-auto ring-1 sm:ring-2 ring-[#7075AB] rounded-sm mb-1 shadow-md transition-all hover:ring-[#00FCFF]">
    </RouterLink>

    <div class="w-full flex flex-col">
      <p class="text-center text-[10px] sm:text-sm font-bold text-zinc-100 truncate leading-tight">
        {{ movie.titulo }}
      </p>

      <div class="flex items-center justify-between mt-1 px-0.5">
        <IconAddReview 
          class="w-4 h-4 sm:w-6 sm:h-6 text-[#97A7CB] hover:text-[#00FCFF]" />
        
        <span class="text-[8px] sm:text-[10px] font-black text-zinc-400">
          {{ movie.rating }}
        </span>
      </div>
    </div>

  </div>
</div>
        </div>

      </div>
      <div v-else class="text-white">
        Filme não encontrado.
      </div>
    </div>
  </div>
</template>