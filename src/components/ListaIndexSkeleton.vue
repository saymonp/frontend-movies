<script setup lang="ts">

defineProps<{
    isSearching: boolean;
    searchMode: string;
}>();
</script>
<template>
    <section v-if="isSearching && searchMode == 'lists'"
        class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 gap-6 max-w-3xl mx-auto pt-2.5 animate-pulse">

        <div v-for="n in 6" :key="n"
            class="relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-md">

            <div class="relative h-40 flex items-center justify-center overflow-hidden px-4 pt-5">

                <div class="flex items-center justify-center relative w-full">
                    <div class="w-[65px] aspect-[2/3] bg-zinc-800/40 rounded-xl shadow-lg -mr-6 scale-90 opacity-60">
                    </div>

                    <div
                        class="w-[75px] aspect-[2/3] bg-zinc-800 rounded-xl shadow-2xl z-10 scale-105 border border-white/5">
                    </div>

                    <div class="w-[65px] aspect-[2/3] bg-zinc-800/40 rounded-xl shadow-lg -ml-6 scale-90 opacity-60">
                    </div>
                </div>

                <div class="absolute inset-0 bg-gradient-to-t from-[#020036]/50 via-transparent to-transparent"></div>
            </div>

            <div class="p-3">

                <div class="h-4 bg-zinc-700/80 rounded w-11/12 mb-2"></div>

                <div class="h-3 bg-zinc-800/60 rounded w-8/12 mb-4"></div>

                <div class="flex items-center justify-between mt-2 pt-1">

                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full bg-zinc-800/60 border border-white/5"></div>

                        <div class="flex flex-col gap-1">
                            <div class="h-3 bg-zinc-800 rounded w-6"></div>
                            <div class="h-2 bg-zinc-800/40 rounded w-8"></div>
                        </div>
                    </div>

                    <div class="w-12 h-6 rounded-full bg-zinc-800/60 border border-white/5"></div>

                </div>
            </div>
        </div>
    </section>
</template>