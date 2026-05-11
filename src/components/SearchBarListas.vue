<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

import IconFilter from '@/components/icons/IconFilter.vue'

export interface ListaFilters {
    search?: string
    tags?: string[]
    orderBy?: string
    user_only?: boolean;
    top_listas?: boolean;
    curadorias?: boolean;
    mais_ativas?: boolean;
    filterValue?: number
}

const props = defineProps<{
    filters: ListaFilters
    isSearching: boolean
    maxLikes: number
}>()

const emit = defineEmits<{
    (e: 'update:filters', value: ListaFilters): void
    //(e: 'update:filterValue', value: number): void
}>()

const target = ref(null)
const showFilter = ref(false)

onClickOutside(target, () => {
    showFilter.value = false
})

const availableTags = [
    'Favoritos',
    'Maratona',
    'Cyberpunk',
    'Clássicos',
    'Terror',
    'Drama',
    'Sci-Fi'
]

const updateFilter = (key: keyof ListaFilters, value: any) => {
    console.log(props.maxLikes);
    emit('update:filters', {
        ...props.filters,
        [key]: value
    })
}

const toggleTag = (tag: string) => {
    const currentTags = [...(props.filters.tags || [])]

    const index = currentTags.indexOf(tag)

    if (index > -1) {
        currentTags.splice(index, 1)
    } else {
        currentTags.push(tag)
    }

    updateFilter('tags', currentTags)
}

//const updateFilterValue = (value: string) => {
//    emit('update:filterValue', Number(value))
//}

const toggleBooleanFilter = (tag: string) => {
    if (tag === 'Top Listas') {
        updateFilter('top_listas', !props.filters.top_listas)
    }

    if (tag === 'Curadorias') {
        updateFilter('curadorias', !props.filters.curadorias)
    }

    if (tag === 'Mais Ativas') {
        updateFilter('mais_ativas', !props.filters.mais_ativas)
    }
}

const isFilterActive = (tag: string) => {
    if (tag === 'Top Listas') return !!props.filters.top_listas
    if (tag === 'Curadorias') return !!props.filters.curadorias
    if (tag === 'Mais Ativas') return !!props.filters.mais_ativas

    return false
}
</script>

<template>
    <div class="lg:max-w-3xl max-w-13/14 mx-auto">

        <div
            class="relative z-50 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 ring-1 ring-white/10 transition-all duration-500">

            <div class="grid grid-cols-1 sm:grid-cols-12 gap-6">

                <!-- ESQUERDA -->
                <div class="sm:col-span-4 flex flex-col gap-4">

                    <!-- SEARCH -->
                    <div
                        class="flex items-center bg-white/5 border border-white/20 rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-[#ff0077] transition-all"
                        :class="isSearching ? 'opacity-50 cursor-not-allowed' : ''">

                        <input type="text"
                            :value="filters.search"
                            @input="e => updateFilter('search', (e.target as HTMLInputElement).value)"
                            placeholder="Buscar listas..."
                            class="flex-1 bg-transparent border-none outline-none text-zinc-100 text-xs font-bold min-w-0">

                        <!-- FILTRO TAG -->
                        <div class="relative">

                            <button @click="showFilter = !showFilter"
                                class="flex items-center gap-1 ml-2 px-2 py-1 rounded-md transition-all group bg-[#ff0077]/10 text-[#d919ff]">

                                <span class="text-[9px] font-black uppercase tracking-tighter">
                                    Tags
                                </span>

                                <IconFilter class="w-3" />
                            </button>

                            <!-- DROPDOWN -->
                            <div ref="target"
                                v-show="showFilter"
                                class="absolute right-0 mt-3 z-[9999] bg-[#020036]/95 backdrop-blur-2xl border border-white/20 rounded-xl p-4 shadow-2xl w-[220px]">

                                <p
                                    class="text-[#d919ff] text-[10px] font-black uppercase tracking-widest border-b border-white/10 pb-2 mb-3">
                                    Filtrar por Tags
                                </p>

                                <div class="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">

                                    <label
                                        v-for="tag in availableTags"
                                        :key="tag"
                                        class="flex items-center gap-3 cursor-pointer group">

                                        <div class="relative flex items-center">

                                            <input type="checkbox"
                                                :value="tag"
                                                :checked="filters.tags?.includes(tag)"
                                                @change="toggleTag(tag)"
                                                class="peer appearance-none w-4 h-4 border border-white/20 rounded transition-all checked:bg-[#ff0077] checked:border-[#ff0077]">

                                            <span
                                                class="absolute text-black font-bold text-[10px] left-1 opacity-0 peer-checked:opacity-100">
                                                ✓
                                            </span>
                                        </div>

                                        <span
                                            class="text-zinc-300 text-[11px] font-bold group-hover:text-white transition-colors">
                                            {{ tag }}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- RANGE -->
                    <div class="px-1">

                        <div class="flex justify-between items-center text-[9px] mb-1">

                            <span class="text-zinc-500 uppercase font-bold tracking-widest">
                                Mínimo de Likes
                            </span>

                            <span class="font-black px-2 py-0.5 rounded text-[#d919ff] bg-[#ff0077]/10">
                                {{ filters.filterValue }}
                            </span>
                        </div>

                        <input type="range"
                            min="0"
                            :max="maxLikes"
                            step="1"
                            :value="filters.filterValue"
                            @change="e => updateFilter('filterValue', (e.target as HTMLSelectElement).value)"
                            class="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#d919ff]">
                    </div>
                </div>

                <!-- DIREITA -->
                <div class="sm:col-span-8 flex flex-col gap-4">

                    <div class="grid grid-cols-2 gap-3">

                        <!-- ORDENAR -->
                        <div class="flex flex-col gap-1">

                            <label class="text-[9px] text-zinc-500 uppercase font-bold ml-1">
                                Ordenar por
                            </label>

                            <select
                                :value="filters.orderBy"
                                @change="e => updateFilter('orderBy', (e.target as HTMLSelectElement).value)"
                                class="bg-white/5 border border-white/10 p-2 rounded-lg text-[10px] text-white outline-none focus:border-[#ff0077] cursor-pointer">

                                <option class="bg-zinc-900" value="likes">
                                    Mais curtidas
                                </option>

                                <option class="bg-zinc-900" value="recentes">
                                    Recentes
                                </option>

                                <option class="bg-zinc-900" value="filmes">
                                    Mais filmes
                                </option>
                            </select>
                        </div>

                        <!-- PRIVACIDADE -->
                        <div class="flex flex-col gap-1">

                            <label class="text-[9px] text-zinc-500 uppercase font-bold ml-1">
                                Privacidade
                            </label>

                            <select
                                :value="filters.user_only"
                                @change="e => updateFilter('user_only', (e.target as HTMLSelectElement).value)"
                                class="bg-white/5 border border-white/10 p-2 rounded-lg text-[10px] text-white outline-none focus:border-[#ff0077] cursor-pointer">

                                <option class="bg-zinc-900" value=false>
                                    Públicas
                                </option>

                                <option class="bg-zinc-900" value=true>
                                    Minhas Listas
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- BOTÕES -->
                    <div class="flex gap-2 mt-auto">

                        <button
                            v-for="tag in ['Top Listas', 'Curadorias', 'Mais Ativas']"
                            :key="tag"
                            @click="toggleBooleanFilter(tag)"
                            class="flex-1 rounded-xl py-2.5 px-2 transition-all group hover:bg-white/10"
                            :class="isFilterActive(tag)
                                ? 'bg-[#ff0077]/20 border border-[#ff0077]'
                                : 'bg-white/5 border border-white/10 hover:border-[#ff0077]/50'">

                            <p
                                class="text-[10px] uppercase tracking-tighter font-black text-center transition-colors"
                                :class="isFilterActive(tag)
                                    ? 'text-[#ff0077]'
                                    : 'text-zinc-400 group-hover:text-white'">

                                {{ tag }}
                            </p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>