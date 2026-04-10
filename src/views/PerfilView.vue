<script setup lang="ts">
import { ref } from 'vue';
import Navbar from '@/components/Navbar.vue';
import IconStar from '@/components/icons/IconStar.vue';
import IconEditList from '@/components/icons/IconList.vue';

// Dados fictícios para o exemplo
const stats = ref({ watched: 128, reviews: 42 });
const listas = ref([
  { id: 1, nome: 'Favoritos de Terror', filmes: 12, capas: ['url1', 'url2', 'url3', 'url4'] },
  { id: 2, nome: 'Clássicos anos 90', filmes: 8, capas: ['url5', 'url6', 'url7', 'url8'] }
]);

const reviews = ref([
  { id: 101, movie: 'Blade Runner 2049', rating: 5, date: '2026-04-01', text: 'Visual estonteante...', poster: 'http://192.168.2.137:9000/posters/posters_br/w500_49b7CTeJqugnpBboT6D5xGy3h4H.jpg' },
  { id: 102, movie: 'Máquina de Guerra', rating: 3, date: '2026-02-21', text: 'legal, contudo...', poster: 'http://192.168.2.137:9000/posters/posters_br/w500_48h40o6Q97hZaqH0g7bOiXOrImX.jpg' },
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
    <img src="../assets/image.png" class="object-cover w-full h-full">
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
        
        </div>
  </div>
</div>

<div class="mt-10">
  <h3 class="text-zinc-100 font-bold uppercase text-sm tracking-widest mb-6 border-b border-white/10 pb-2">Minhas Reviews</h3>
  
  <div class="flex flex-col gap-4">
    <div @click="abrirDetalheReview(reviews[0])" class="flex gap-4 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-[#00FCFF]/30 cursor-pointer transition-all group">
      <img :src="reviews[0]?.poster" class="w-12 h-18 object-cover rounded-md shadow-lg">
      <div class="flex-1">
        <div class="flex justify-between items-start">
          <h4 class="text-white font-bold text-sm">{{ reviews[0]?.movie }}</h4>
          <span class="text-[#00FCFF] text-xs font-black">★ {{ reviews[0]?.rating }}</span>
        </div>
        <p class="text-zinc-400 text-xs line-clamp-2 mt-1">{{ reviews[0]?.text }}</p>
      </div>
    </div>
    <div @click="abrirDetalheReview(reviews[1])" class="flex gap-4 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-[#00FCFF]/30 cursor-pointer transition-all group">
      <img :src="reviews[1]?.poster" class="w-12 h-18 object-cover rounded-md shadow-lg">
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