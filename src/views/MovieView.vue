<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import Navbar from '@/components/Navbar.vue';
import TheFooter from '@/components/TheFooter.vue';
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


const limite = ref(1); // Quantas reviews aparecem inicialmente
const reviews = ref([
  { id: 1, autor: 'Boladotron', nota: 5, texto: 'Filme muito maneiro, é de temática vampiresca com uma abordagem diferente.', avatar: '/image.png' },
  { id: 2, autor: 'StarConvoy', nota: 4, texto: 'A fotografia é incrível, mas o ritmo cansa um pouco no meio.', avatar: '/image.png' },
  { id: 3, autor: 'OrionPax', nota: 5, texto: 'Melhor do gênero que vi esse ano!', avatar: '/image.png' },
  { id: 4, autor: 'OptimusPrime', nota: 3, texto: 'Esperava mais do final.', avatar: '/image.png' },
]);

const mostrarMais = () => {
  limite.value += 3; // Carrega mais 3 por vez
};

const isCardReviewVisible = ref(false)

// Função para pegar a data de hoje formatada (YYYY-MM-DD)
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Inicializamos o estado com a data de hoje
const dataAssistido = ref(getTodayDate());
</script>

<template>
  <div v-show="isCardReviewVisible" 
     class="fixed z-50 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-8 
            top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_20px_rgba(0,252,255,0.1)] w-[92%] max-w-[450px]">
  
  <div class="flex flex-col gap-6">
    <div class="text-center">
      <h2 class="text-zinc-100 font-black text-2xl tracking-tighter uppercase">Minha Review</h2>
      <p class="text-zinc-500 text-xs mt-1 italic">Compartilhe sua opinião sobre o filme</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="flex flex-col gap-1">
        <label class="text-zinc-400 text-[10px] uppercase font-bold ml-1">Título da Review</label>
        <input type="text" placeholder="Ex: Incrível!"
               class="w-full bg-white/5 border border-white/10 p-2.5 rounded-lg text-white text-sm outline-none focus:border-[#00FCFF] focus:ring-1 focus:ring-[#00FCFF]/50 transition-all">
      </div>

      <div class="flex flex-col gap-1">
  <label class="text-zinc-400 text-[10px] uppercase font-bold ml-1">Assistido em</label>
  <input 
    type="date"
    v-model="dataAssistido"
    class="w-full bg-white/5 border border-white/10 p-2.5 rounded-lg text-white text-sm outline-none focus:border-[#00FCFF] transition-all"
  >
</div>
    </div>

    <div class="flex flex-col items-center bg-white/5 p-4 rounded-xl border border-white/5">
      <label class="text-zinc-400 text-[10px] uppercase font-bold mb-2">Sua Nota</label>
      <div class="flex items-center gap-2">
        <div class="flex">
          <button v-for="star in 5" :key="star" type="button" @click="selectRating(star)"
                  @mouseenter="hoverRating = star" @mouseleave="hoverRating = 0"
                  class="p-1 transition-all active:scale-125 cursor-pointer">
            <IconStar class="w-6 h-6 transition-colors duration-200" 
                      :class="star <= (hoverRating || rating) ? 'text-[#00FCFF] drop-shadow-[0_0_8px_#00FCFF]' : 'text-zinc-700'" />
          </button>
        </div>
        <span class="text-[#00FCFF] font-black text-xl italic ml-2 w-10">{{ rating }}<span class="text-zinc-600 text-sm">/5</span></span>
      </div>
    </div>

    <div class="flex flex-col gap-1">
      <label class="text-zinc-400 text-[10px] uppercase font-bold ml-1">Sua Mensagem</label>
      <textarea rows="4" placeholder="O que você achou da fotografia, roteiro e atuação?"
                class="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white text-sm outline-none focus:border-[#00FCFF] focus:ring-1 focus:ring-[#00FCFF]/50 transition-all resize-none"></textarea>
    </div>

    <div class="flex flex-col gap-1">
      <label class="text-zinc-400 text-[10px] uppercase font-bold ml-1">Tags <span class="lowercase font-normal opacity-50">(pressione enter)</span></label>
      <input type="text" placeholder="Ex: Masterpiece, Terror, Favorito"
             class="w-full bg-white/5 border border-white/10 p-2.5 rounded-lg text-white text-sm outline-none focus:border-[#00FCFF] transition-all">
    </div>

    <div class="flex flex-col gap-3 mt-2">
      <button @click="isCardReviewVisible = false"
              class="w-full bg-[#00FCFF] text-black font-black uppercase tracking-widest py-3 rounded-lg hover:bg-[#00f2f5] hover:shadow-[0_0_20px_rgba(0,252,255,0.4)] transition-all cursor-pointer active:scale-95">
        Publicar Review
      </button>
      
      <button @click="isCardReviewVisible = false"
              class="w-full py-2 text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors cursor-pointer">
        Cancelar e Sair
      </button>
    </div>
  </div>
</div>
  <div v-if="isCardReviewVisible" @click="isCardReviewVisible = false"
    class="fixed inset-0 bg-black/10 backdrop-blur-xs z-40">
  </div>
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
              <button @click="isCardReviewVisible = true"
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
                class="bg-white/10 border border-white/20 rounded-lg py-1 px-2 ring-1 ring-[#00FCFF]/50 hover:bg-[#00FCFF]/10 cursor-pointer transition-all h-fit"">
                <p class=" text-white text-[10px] uppercase tracking-wider font-bold text-center"> {{ genero }}</p>
              </span>
            </div>

            <div v-if="abaAtiva === 'detalhes'" class="text-zinc-400 text-sm space-y-2">
              <p><span class="text-zinc-100 font-bold">Título Original:</span> {{ movie.titulo_original }}</p>
              <p><span class="text-zinc-100 font-bold">Idioma:</span> {{ movie.lingua_origem }}</p>
              <p><span class="text-zinc-100 font-bold">Produtoras:</span> {{ movie.estudios }}</p>
              <p><span class="text-zinc-100 font-bold">Nota IMDb</span> {{ movie.rating }}</p>
            </div>
            <p class="mt-5 text-zinc-100 font-bold"><a class="underline"
                href="https://www.imdb.com/pt/title/tt31193180/">Mais em TMDb</a></p>
          </div>
        </div>
        <div class="lg:max-w-5xl  mx-auto">
          <h1 class="max-w-13/14 mx-auto mt-8 text-zinc-100 font-black text-lg uppercase drop-shadow-md">
            Filmes com a mesma pegada
          </h1>
          <div tag="section" name="list"
            class="grid grid-cols-4 sm:grid-cols-4 mt-3 gap-2 sm:gap-5 mx-auto w-full max-w-5xl px-2">

            <div v-for="movie in movies.slice(0, 4)" :key="movie.id" class="movie-card flex flex-col items-center">

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
                  <IconAddReview class="w-4 h-4 sm:w-6 sm:h-6 text-[#97A7CB] hover:text-[#00FCFF]" />

                  <span class="text-[8px] sm:text-[10px] font-black text-zinc-400">
                    {{ movie.rating }}
                  </span>
                </div>
              </div>
            </div>

          </div>



          <div class="lg:max-w-5xl max-w-[95%] mx-auto mb-20">
            <h1
              class="mt-8 mb-6 text-zinc-100 font-black text-lg uppercase drop-shadow-md border-b border-white/10 pb-2">
              Listas Relacionadas
            </h1>

            <div class="grid grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-6">
              <RouterLink :to="{
                name: 'ListView',
                params: {
                  id: 1
                }
              }" class="w-full">
              <div class="group cursor-pointer">
                <p
                  class="text-white text-[10px] lg:text-xs uppercase tracking-widest font-bold text-center mb-3 group-hover:text-[#00FCFF] transition-colors">
                  Comédia Romântica
                </p>
                
                <div class="flex items-center justify-center pl-1">
                  <div class="relative z-40 w-28 sm:w-28 lg:w-32 transition-transform group-hover:-translate-y-2">
                    <img src="http://192.168.2.137:9000/posters/posters_br/w500_48h40o6Q97hZaqH0g7bOiXOrImX.jpg"
                      class="w-full h-auto ring-2 ring-[#7075AB] rounded-sm shadow-xl">
                  </div>

                  <div
                    class="relative z-30 -ml-2 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-90 transition-transform group-hover:-translate-y-1">
                    <img src="http://192.168.2.137:9000/posters/posters_br/w500_hSvhZRkbYD9crC4nqy8uCk9EdFH.jpg"
                      class="w-full h-auto ring-1 ring-white/20 rounded-sm shadow-lg">
                  </div>

                  <div class="relative z-20 -ml-4 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-80">
                    <img src="http://192.168.2.137:9000/posters/posters_br/w500_iGpMm603GUKH2SiXB2S5m4sZ17t.jpg"
                      class="w-full h-auto ring-1 ring-white/10 rounded-sm shadow-md">
                  </div>

                  <div class="relative z-10 -ml-5 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-70">
                    <img src="http://192.168.2.137:9000/posters/posters_br/w500_49b7CTeJqugnpBboT6D5xGy3h4H.jpg"
                      class="w-full h-auto ring-1 ring-white/5 rounded-sm shadow-sm">
                  </div>

                </div>

                <p class="text-zinc-500 text-[9px] text-center mt-4 uppercase">12 filmes nesta lista</p>
              </div>
              </RouterLink>
              <div class="group cursor-pointer">
                <p
                  class="text-white text-[10px] lg:text-xs uppercase tracking-widest font-bold text-center mb-3 group-hover:text-[#00FCFF] transition-colors">
                  Adrenalina pura
                </p>

                <div class="flex items-center justify-center pl-1">
                  <div class="relative z-40 w-28 sm:w-28 lg:w-32 transition-transform group-hover:-translate-y-2">
                    <img src="http://192.168.2.137:9000/posters/posters_br/w500_48h40o6Q97hZaqH0g7bOiXOrImX.jpg"
                      class="w-full h-auto ring-2 ring-[#7075AB] rounded-sm shadow-xl">
                  </div>

                  <div
                    class="relative z-30 -ml-2 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-90 transition-transform group-hover:-translate-y-1">
                    <img src="http://192.168.2.137:9000/posters/posters_br/w500_hSvhZRkbYD9crC4nqy8uCk9EdFH.jpg"
                      class="w-full h-auto ring-1 ring-white/20 rounded-sm shadow-lg">
                  </div>

                  <div class="relative z-20 -ml-4 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-80">
                    <img src="http://192.168.2.137:9000/posters/posters_br/w500_iGpMm603GUKH2SiXB2S5m4sZ17t.jpg"
                      class="w-full h-auto ring-1 ring-white/10 rounded-sm shadow-md">
                  </div>

                  <div class="relative z-10 -ml-5 sm:-ml-14 lg:-ml-16 w-28 sm:w-28 lg:w-32 opacity-70">
                    <img src="http://192.168.2.137:9000/posters/posters_br/w500_49b7CTeJqugnpBboT6D5xGy3h4H.jpg"
                      class="w-full h-auto ring-1 ring-white/5 rounded-sm shadow-sm">
                  </div>

                </div>

                <p class="text-zinc-500 text-[9px] text-center mt-4 uppercase">12 filmes nesta lista</p>
              </div>

            </div>
          </div>





          <div class="lg:max-w-5xl max-w-[95%] mx-auto mb-20">
            <h1
              class="mt-8 mb-6 text-zinc-100 font-black text-lg uppercase drop-shadow-md border-b border-white/10 pb-2">
              Reviews Populares
            </h1>

            <div class="flex flex-col gap-8">
              <div v-for="review in reviews.slice(0, limite)" :key="review.id" class="flex gap-4 items-start group">

                <div class="shrink-0">
                  <div
                    class="w-12 h-12 lg:w-16 lg:h-16 rounded-full overflow-hidden border-2 border-zinc-700 group-hover:border-[#00FCFF] transition-colors">
                    <img class="w-full h-full object-cover" src="/image.png" />
                  </div>
                </div>

                <div class="flex-1 flex flex-col gap-1">
                  <div class="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-3">
                    <p class="text-zinc-100 text-md font-light">
                      Review de <span class="font-extrabold text-[#00FCFF]">{{ review.autor }}</span>
                    </p>

                    <div class="flex">
                      <IconStar v-for="i in 5" :key="i" :class="i <= review.nota ? 'text-[#00FCFF]' : 'text-zinc-700'"
                        class="w-3 h-3 lg:w-4 lg:h-4" />
                    </div>
                  </div>

                  <div class="mt-1">
                    <p class="text-zinc-400 text-sm lg:text-base leading-relaxed">
                      {{ review.texto }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="limite < reviews.length" class="mt-10 flex justify-center">
              <button @click="mostrarMais"
                class="text-zinc-400 hover:text-[#00FCFF] text-sm font-bold uppercase tracking-widest transition-all border-b border-zinc-800 hover:border-[#00FCFF] pb-1">
                Mostrar mais reviews
              </button>
            </div>
          </div>
        </div>

      </div>
      <div v-else class="text-white">
        Filme não encontrado.
      </div>
    </div>
  </div>
  <TheFooter />
</template>