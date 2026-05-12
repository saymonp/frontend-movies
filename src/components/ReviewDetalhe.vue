<script setup lang="ts">
import type { Review, ReviewSummary } from '@/types/Review'; // Ajuste o path conforme seu projeto

defineProps<{
  isOpen: boolean;
  review: ReviewSummary;
}>();

const emit = defineEmits(['close', 'like', 'excluir']);

const close = () => emit('close');

// Função de imagem que você já tem
const getImageUrl = (path: string) => {
  if (!path) return '/placeholder.png';
  let cleanPath = path.replace(/\\/g, '/');
  cleanPath = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;
  return `${import.meta.env.VITE_IMAGE_BASE_URL}${cleanPath}`;
};
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-white/2 backdrop-blur-[1px]" @click="close"></div>

<div class="relative bg-[#121214]/80 backdrop-blur-xl border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
        
        <button @click="close" class="absolute top-4 right-4 text-zinc-500 hover:text-white z-10 transition-colors">
          <IconClose class="w-6 h-6" />
        </button>

        <div class="flex flex-col md:flex-row">
          <div class="w-full md:w-1/3 bg-black/40 p-6 flex flex-col items-center gap-4 border-r border-white/5">
            <img 
              :src="getImageUrl(review.movie.poster_thumb_br || review.movie.poster_thumb_us)" 
              class="w-full h-auto rounded-lg shadow-2xl border border-white/10"
              alt="Poster"
            >
            <div class="text-center">
              <p class="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Filme</p>
              <h4 class="text-white font-bold text-sm leading-tight">
                {{ review.movie.titulo_br || review.movie.titulo_original }}
              </h4>
            </div>
          </div>

          <div class="flex-1 p-8 flex flex-col bg-white/[0.02]">
            <div class="flex items-center gap-3 mb-6">
              <img :src="review.user.avatar || '/default-avatar.png'" class="w-10 h-10 rounded-full border border-[#00FCFF]/30 shadow-[0_0_10px_rgba(0,252,255,0.2)]">
              <div>
                <p class="text-white font-bold text-sm leading-none">{{ review.user.name }}</p>
                <p class="text-zinc-500 text-[10px] uppercase mt-1">Reviewer</p>
              </div>
              <div class="ml-auto bg-[#00FCFF]/10 px-3 py-1 rounded-full border border-[#00FCFF]/20">
                <span class="text-[#00FCFF] font-black text-sm">★ {{ review.rating }}</span>
              </div>
            </div>

            <div v-if="review.tags?.length" class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="tag in review.tags" :key="tag.id"
                class="text-[9px] uppercase font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-400"
              >
                {{ tag.nome }}
              </span>
            </div>

            <div class="flex-1">
               <h3 class="text-zinc-100 font-bold text-lg mb-2 italic">"{{ review.titulo || 'Sem título' }}"</h3>
               <p class="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                 {{ review.comentario }}
               </p>
            </div>

            <div class="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div 
                  @click="$emit('like', review.id)"
                  class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all border"
                  :class="review.is_liked 
                    ? 'bg-[#ff0077]/20 border-[#ff0077] text-[#ff0077] shadow-[0_0_15px_rgba(255,0,119,0.3)]' 
                    : 'bg-white/5 border-white/10 text-zinc-500 hover:text-white'"
                >
                  <IconLike class="w-5 h-5" />
                </div>
                <span class="text-sm font-bold" :class="review.is_liked ? 'text-[#ff0077]' : 'text-zinc-500'">
                  {{ review.likes_count }} <small class="text-[10px] uppercase ml-1">curtidas</small>
                </span>
              </div>
              
              <button @click="$emit('excluir', review.id)" class="text-[10px] font-black uppercase text-zinc-500 hover:text-[#00FCFF] transition-colors">
                Excluir Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Scrollbar personalizada para o comentário se for longo */
.whitespace-pre-wrap {
  max-height: 250px;
  overflow-y: auto;
}
</style>