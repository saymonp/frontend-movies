<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import Navbar from '@/components/Navbar.vue';
import IconStar from '@/components/icons/IconStar.vue';

import movie_json from '../assets/movieDetalhes.json';

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

const rating = ref(5); // Valor inicial
const hoverRating = ref(0); // Para efeito visual ao passar o mouse

const selectRating = (val: number) => {
  rating.value = val;
};
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
              <p class="items-center justify-center text-zinc-300 font-bold leading-relaxed">{{ movie.release_date?.slice(0, 4) }}
              </p>
              <p class="text-zinc-400 leading-relaxed">Dirigido por <span class="font-bold text-zinc-300">{{ movie.diretores }}</span></p>
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

            </div>
           
            <div class="shrink-0 ml-auto"><img :src="movie.poster_path_br"
              class="-mt-1 w-40 sm:w-70 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
            </div>
            </div>
            

          <div class="mt-8 block lg:hidden">
            <p class="text-zinc-400 leading-relaxed">
              {{ locale === 'br' ? movie.descricao_br : movie.descricao_en }}
            </p>
          </div>
        </div>

      </div>
      <div v-else class="text-white">
        Filme não encontrado.
      </div>
    </div>
  </div>
</template>