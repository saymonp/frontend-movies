<script setup lang="ts">
import IconFilter from '@/components/icons/IconFilter.vue'

let filterRating = 5
</script>

<template>
    <div class="max-w-13/14 mx-auto mt-10">
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 ring-1 ring-[#00FCFF]/30">

            <div class="grid grid-cols-4 sm:grid-cols-8 gap-3 items-center">
                <div class="col-span-2 flex flex-wrap items-center">

                    <input type="text" placeholder="Pesquisar..."
                        class="flex-1 w-full h-full bg-transparent border-none outline-none text-zinc-100 text-xs font-bold placeholder:text-zinc-500">

                    <button class="flex-none ml-2 hover:scale-110 transition-transform">
                        <IconFilter class="w-4 text-[#2adde0]" />
                    </button>


                    <div class="basis-full w-full pt-1 border-t border-white/5">
                        <div class=" justify-between text-[10px] mb-1">
                            <span class="text-zinc-500 uppercase">Nota Mínima</span>
                            <span class="text-[#00FCFF] font-bold">{{ filterRating }}</span>
                        </div>
                        <input type="range" min="0" max="10" step="0.1" v-model="filterRating"
                            class="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00FCFF]">
                    </div>
                </div>


                <div v-for="genero in ['Ação', 'Comédia', 'Romance', 'Drama', 'Terror', 'Aventura']" :key="genero"
                    class="bg-white/10 border border-white/20 rounded-lg py-1 px-2 ring-1 ring-[#00FCFF]/50 hover:bg-[#00FCFF]/10 cursor-pointer transition-all h-fit">
                    <p class="text-white text-[10px] uppercase tracking-wider font-bold text-center">{{ genero
                    }}</p>
                </div>

            </div>
        </div>
    </div>

</template>