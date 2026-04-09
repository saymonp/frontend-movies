<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import Navbar from '@/components/Navbar.vue';

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

watchEffect(() => {
  console.log("Caminho da imagem atual:", movie.value?.backdrop_path_br);
});
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

        <div class="relative z-20 px-8 -mt-13 sm:-mt-18 lg:max-w-5xl  mx-auto">



          <div class="mt-2 flex gap-10 place-content-around">
            <div class="flex flex-col gap-1 lg:flex-row lg:flex-wrap lg:items-baseline lg:gap-x-4 h-fit lg:max-w-[800px]">
              <h1 class="text-zinc-100 font-black text-2xl uppercase drop-shadow-md">
                {{ movieTitle }}
              </h1>
              <p class="items-center justify-center text-zinc-400 leading-relaxed">{{ movie.release_date?.slice(0, 4) }}</p>
              <p class="text-zinc-400 leading-relaxed">Dirigido por {{ movie.diretores }}</p>
              <p class="text-zinc-400 leading-relaxed drop-shadow-sm basis-full">{{ movie.tagline_br }}</p>
              <p class="text-zinc-400 leading-relaxed mb-2">{{ movie.duracao }} mins</p>
              <div class="mt-2 hidden lg:block">
            <p class="text-zinc-400 leading-relaxed">
              {{ locale === 'br' ? movie.descricao_br : movie.descricao_en }}
            </p>
          </div>
              <button
                class="w-fit lg:basis-auto bg-white/5 border border-white/20 text-white rounded-lg py-1 px-4 ring-1 ring-[#00FCFF]/50 hover:bg-[#00FCFF]/10 cursor-pointer transition-all">
                Fazer Review
              </button>
            </div>

            <img :src="movie.poster_path_br"
              class="-mt-1 w-40 sm:w-70 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
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