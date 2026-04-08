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
        <div class="p-8">
          <h1 class="text-[#00FCFF] font-black text-4xl uppercase">
            {{ movieTitle }}
          </h1>

          <div class="mt-6 flex gap-4">
            <img :src="movie.poster_br" class="w-64 rounded-xl shadow-2xl border border-white/10">

            <div class="flex-1">
              <p class="text-zinc-400 leading-relaxed">
                {{ locale === 'br' ? movie.sinopse_br : movie.sinopse_en }}
              </p>
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