<script setup lang="ts">
import IconFilter from '@/components/icons/IconFilter.vue'
</script>

<template>
    <div class="max-w-13/14 mx-auto mt-10">
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 ring-1 ring-[#00FCFF]/30">

            <div class="grid grid-cols-4 sm:grid-cols-8 gap-3 items-center">

                <div
                    class="col-span-2 flex items-center bg-white/5 border border-white/10 rounded-lg ring-1 ring-[#00FCFF] h-9 overflow-hidden">

                    <input type="text" placeholder="Pesquisar..."
                        class="w-full h-full bg-transparent border-none outline-none text-zinc-100 text-[11px] font-bold placeholder:text-zinc-500 px-3 min-w-0">

                    <button
                        class="flex items-center justify-center w-10 h-full bg-white/5 border-l border-white/10 hover:bg-[#00FCFF]/20 transition-all shrink-0">
                        <IconFilter class="w-4 text-[#2adde0]" />
                    </button>

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