<script setup lang="ts">
import { ref } from 'vue';
import Navbar from '@/components/Navbar.vue';
import IconStar from '@/components/icons/IconStar.vue';
import IconEditList from '@/components/icons/IconList.vue';

const getImageUrl = (path: string) => {
  // Isso converte o caminho relativo em um caminho que o navegador entende
  return new URL(path, import.meta.url).href;
};

// Dados fictícios para o exemplo
const stats = ref({ watched: 128, reviews: 42 });
const listas = ref([
  { id: 1, nome: 'Favoritos de Terror', filmes: 12, capas: ['url1', 'url2', 'url3', 'url4'] },
  { id: 2, nome: 'Clássicos anos 90', filmes: 8, capas: ['url5', 'url6', 'url7', 'url8'] }
]);

const reviews = ref([
  { id: 101, movie: 'Blade Runner 2049', rating: 5, date: '2026-04-01', text: 'Visual estonteante...', poster: '/w500_49b7CTeJqugnpBboT6D5xGy3h4H.jpg' },
  { id: 102, movie: 'Máquina de Guerra', rating: 3, date: '2026-02-21', text: 'legal, contudo...', poster: '/w500_48h40o6Q97hZaqH0g7bOiXOrImX.jpg' },
]);

// Controle do Modal de Edição
const isEditModalVisible = ref(false);
const selectedReview = ref(null);

const abrirDetalheReview = (review: any) => {
  selectedReview.value = { ...review }; // Clonagem para não editar direto na lista antes de salvar
  isEditModalVisible.value = true;
};
</script>

<template>
    <Navbar />
    <div class="bg-hero min-h-screen pt-24 pb-10">
        <div class="lg:max-w-3xl max-w-[95%] mx-auto relative z-30">
<div class="flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl">
  <div class="w-20 h-20 rounded-full border-2 border-[#00FCFF] overflow-hidden">
    <img src="/assets/image.png" class="object-cover w-full h-full">
  </div>
  
  <div class="flex flex-col gap-2">
    <h2 class="text-xl font-black text-white uppercase tracking-tighter">Boladotron</h2>
    <div class="flex gap-4">
      <div class="text-center">
        <p class="text-[#00FCFF] font-black text-lg">128</p>
        <p class="text-zinc-500 text-[10px] uppercase font-bold">Assistidos</p>
      </div>
      <div class="text-center border-l border-white/10 pl-4">
        <p class="text-[#00FCFF] font-black text-lg">42</p>
        <p class="text-zinc-500 text-[10px] uppercase font-bold">Reviews</p>
      </div>
    </div>
  </div>
</div>

<div class="mt-10">
  <div class="flex items-center justify-between mb-6">
    <h3 class="text-zinc-100 font-bold uppercase text-sm tracking-widest">Minhas Listas</h3>
    <RouterLink to="/criar-lista" class="text-[#00FCFF] text-[10px] font-black uppercase border border-[#00FCFF]/30 px-3 py-1 rounded-full hover:bg-[#00FCFF]/10 transition-all">
      + Nova Lista
    </RouterLink>
  </div>

  <div class="grid grid-cols-2 lg:grid-cols-3 gap-6">
    <div class="cursor-pointer hover:scale-105 transition-transform">
        <div>
        <h4 class="text-white font-bold text-md p-2">Adrenalina Pura</h4>
        <div class="flex items-center justify-center pl-1">
                  <div class="relative z-40 w-28 sm:w-28 lg:w-32 transition-transform group-hover:-translate-y-2">
                    <img src="/w500_48h40o6Q97hZaqH0g7bOiXOrImX.jpg"
                      class="w-full h-auto ring-2 ring-[#7075AB] rounded-sm shadow-xl">
                  </div>

                  <div
                    class="relative z-30 -ml-2 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-90 transition-transform group-hover:-translate-y-1">
                    <img src="/w500_hSvhZRkbYD9crC4nqy8uCk9EdFH.jpg"
                      class="w-full h-auto ring-1 ring-white/20 rounded-sm shadow-lg">
                  </div>

                  <div class="relative z-20 -ml-4 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-80">
                    <img src="/w500_iGpMm603GUKH2SiXB2S5m4sZ17t.jpg"
                      class="w-full h-auto ring-1 ring-white/10 rounded-sm shadow-md">
                  </div>

                  <div class="relative z-10 -ml-5 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-70">
                    <img src="/w500_49b7CTeJqugnpBboT6D5xGy3h4H.jpg"
                      class="w-full h-auto ring-1 ring-white/5 rounded-sm shadow-sm">
                  </div>

        </div>
        </div>
        </div>
<div class="cursor-pointer hover:scale-105 transition-transform">
          <div>
        <h4 class="text-white font-bold text-md p-2">Emocionante</h4>
        <div class="flex items-center justify-center pl-1">
                  <div class="relative z-40 w-28 sm:w-28 lg:w-32 transition-transform group-hover:-translate-y-2">
                    <img src="/w500_49b7CTeJqugnpBboT6D5xGy3h4H.jpg"
                      class="w-full h-auto ring-2 ring-[#7075AB] rounded-sm shadow-xl">
                  </div>

                  <div
                    class="relative z-30 -ml-2 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-90 transition-transform group-hover:-translate-y-1">
                    <img src="/w500_hSvhZRkbYD9crC4nqy8uCk9EdFH.jpg"
                      class="w-full h-auto ring-1 ring-white/20 rounded-sm shadow-lg">
                  </div>

                  <div class="relative z-20 -ml-4 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-80">
                    <img src="/w500_iGpMm603GUKH2SiXB2S5m4sZ17t.jpg"
                      class="w-full h-auto ring-1 ring-white/10 rounded-sm shadow-md">
                  </div>

                  <div class="relative z-10 -ml-5 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-70">
                    <img src="/w500_49b7CTeJqugnpBboT6D5xGy3h4H.jpg"
                      class="w-full h-auto ring-1 ring-white/5 rounded-sm shadow-sm">
                  </div>

        </div>
        </div>
        </div>

        <div class="cursor-pointer hover:scale-105 transition-transform">
          <div>
        <h4 class="text-white font-bold text-md p-2">Chorar no Banho</h4>
        <div class="flex items-center justify-center pl-1">
                  <div class="relative z-40 w-28 sm:w-28 lg:w-32 transition-transform group-hover:-translate-y-2">
                    <img src="/w500_iGpMm603GUKH2SiXB2S5m4sZ17t.jpg"
                      class="w-full h-auto ring-2 ring-[#7075AB] rounded-sm shadow-xl">
                  </div>

                  <div
                    class="relative z-30 -ml-2 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-90 transition-transform group-hover:-translate-y-1">
                    <img src="/w500_hSvhZRkbYD9crC4nqy8uCk9EdFH.jpg"
                      class="w-full h-auto ring-1 ring-white/20 rounded-sm shadow-lg">
                  </div>

                  <div class="relative z-20 -ml-4 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-80">
                    <img src="/w500_iGpMm603GUKH2SiXB2S5m4sZ17t.jpg"
                      class="w-full h-auto ring-1 ring-white/10 rounded-sm shadow-md">
                  </div>

                  <div class="relative z-10 -ml-5 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-70">
                    <img src="/w500_49b7CTeJqugnpBboT6D5xGy3h4H.jpg"
                      class="w-full h-auto ring-1 ring-white/5 rounded-sm shadow-sm">
                  </div>

        </div>
        </div>
        </div>

        <div class="cursor-pointer hover:scale-105 transition-transform">
          <div>
        <h4 class="text-white font-bold text-md p-2">Guilt Pleasure</h4>
        <div class="flex items-center justify-center pl-1">
                  <div class="relative z-40 w-28 sm:w-28 lg:w-32 transition-transform group-hover:-translate-y-2">
                    <img src="/w500_jYpk5Zun4VTWrplO3m9BHANi4S5.jpg"
                      class="w-full h-auto ring-2 ring-[#7075AB] rounded-sm shadow-xl">
                  </div>

                  <div
                    class="relative z-30 -ml-2 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-90 transition-transform group-hover:-translate-y-1">
                    <img src="/w500_hSvhZRkbYD9crC4nqy8uCk9EdFH.jpg"
                      class="w-full h-auto ring-1 ring-white/20 rounded-sm shadow-lg">
                  </div>

                  <div class="relative z-20 -ml-4 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-80">
                    <img src="/w500_iGpMm603GUKH2SiXB2S5m4sZ17t.jpg"
                      class="w-full h-auto ring-1 ring-white/10 rounded-sm shadow-md">
                  </div>

                  <div class="relative z-10 -ml-5 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-70">
                    <img src="/w500_49b7CTeJqugnpBboT6D5xGy3h4H.jpg"
                      class="w-full h-auto ring-1 ring-white/5 rounded-sm shadow-sm">
                  </div>

        </div>
        </div>
        </div>
        <div class="cursor-pointer hover:scale-105 transition-transform">
          <div>
        <h4 class="text-white font-bold text-md p-2">Filmes de Conforto</h4>
        <div class="flex items-center justify-center pl-1">
                  <div class="relative z-40 w-28 sm:w-28 lg:w-32 transition-transform group-hover:-translate-y-2">
                    <img src="/w500_ftPFJBGbldoWiiPrmesW96zBzdH.jpg"
                      class="w-full h-auto ring-2 ring-[#7075AB] rounded-sm shadow-xl">
                  </div>

                  <div
                    class="relative z-30 -ml-2 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-90 transition-transform group-hover:-translate-y-1">
                    <img src="/w500_hSvhZRkbYD9crC4nqy8uCk9EdFH.jpg"
                      class="w-full h-auto ring-1 ring-white/20 rounded-sm shadow-lg">
                  </div>

                  <div class="relative z-20 -ml-4 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-80">
                    <img src="/w500_iGpMm603GUKH2SiXB2S5m4sZ17t.jpg"
                      class="w-full h-auto ring-1 ring-white/10 rounded-sm shadow-md">
                  </div>

                  <div class="relative z-10 -ml-5 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-70">
                    <img src="/w500_49b7CTeJqugnpBboT6D5xGy3h4H.jpg"
                      class="w-full h-auto ring-1 ring-white/5 rounded-sm shadow-sm">
                  </div>

        </div>
        </div>
        </div>
        <div class="cursor-pointer hover:scale-105 transition-transform">
          <div>
        <h4 class="text-white font-bold text-md p-2">Assistir com a Morena</h4>
        <div class="flex items-center justify-center pl-1">
                  <div class="relative z-40 w-28 sm:w-28 lg:w-32 transition-transform group-hover:-translate-y-2">
                    <img src="/w500_bOzG3SG6gBxHGGHYiq7xXeNb1bG.jpg"
                      class="w-full h-auto ring-2 ring-[#7075AB] rounded-sm shadow-xl">
                  </div>

                  <div
                    class="relative z-30 -ml-2 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-90 transition-transform group-hover:-translate-y-1">
                    <img src="/w500_hSvhZRkbYD9crC4nqy8uCk9EdFH.jpg"
                      class="w-full h-auto ring-1 ring-white/20 rounded-sm shadow-lg">
                  </div>

                  <div class="relative z-20 -ml-4 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-80">
                    <img src="/w500_iGpMm603GUKH2SiXB2S5m4sZ17t.jpg"
                      class="w-full h-auto ring-1 ring-white/10 rounded-sm shadow-md">
                  </div>

                  <div class="relative z-10 -ml-5 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-70">
                    <img src="/w500_49b7CTeJqugnpBboT6D5xGy3h4H.jpg"
                      class="w-full h-auto ring-1 ring-white/5 rounded-sm shadow-sm">
                  </div>

        </div>
        </div>
        </div>
  </div>
</div>

<div class="mt-10">
  <h3 class="text-zinc-100 font-bold uppercase text-sm tracking-widest mb-6 border-b border-white/10 pb-2">Minhas Reviews</h3>
  
  <div class="flex flex-col gap-4">
    <div @click="abrirDetalheReview(reviews[0])" class="flex gap-4 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-[#00FCFF]/30 cursor-pointer transition-all group">
      <img v-if="reviews[0]?.poster" :src="getImageUrl(reviews[0].poster)" class="w-12 h-18 object-cover rounded-md shadow-lg">
      <div class="flex-1">
        <div class="flex justify-between items-start">
          <h4 class="text-white font-bold text-sm">{{ reviews[0]?.movie }}</h4>
          <span class="text-[#00FCFF] text-xs font-black">★ {{ reviews[0]?.rating }}</span>
        </div>
        <p class="text-zinc-400 text-xs line-clamp-2 mt-1">{{ reviews[0]?.text }}</p>
      </div>
    </div>
    <div @click="abrirDetalheReview(reviews[1])" class="flex gap-4 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-[#00FCFF]/30 cursor-pointer transition-all group">
      <img v-if="reviews[0]?.poster" :src="getImageUrl(reviews[0].poster)" class="w-12 h-18 object-cover rounded-md shadow-lg">
      <div class="flex-1">
        <div class="flex justify-between items-start">
          <h4 class="text-white font-bold text-sm">{{ reviews[1]?.movie }}</h4>
          <span class="text-[#00FCFF] text-xs font-black">★ {{ reviews[1]?.rating }}</span>
        </div>
        <p class="text-zinc-400 text-xs line-clamp-2 mt-1">{{ reviews[1]?.text }}</p>
      </div>
    </div>
  </div>
</div>
</div>
</div>

</template>