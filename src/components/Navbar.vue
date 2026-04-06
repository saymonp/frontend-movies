<script setup lang="ts">
import IconList from '@/components/icons/IconList.vue'
import IconAdd from '@/components/icons/IconAdd.vue'
import IconFilmeiroFooter from '@/components/icons/IconFilmeiroFooter.vue';
</script>
<template>
    <header class="absolute w-full left-0 right-0 mx-auto z-11 flex flex-wrap items-center justify-between max-w-7xl">
        <a href="/" class="text-white no-underline text-2xl font-bold invisible md:visible">
            <IconFilmeiroFooter class="w-30 text-zinc-100" />
        </a>
        <nav>
            <ul class="flex list-none p-0 m-0">
                <li><a href="/" class="block p-2.5 text-white no-underline ml-2.5 hover:text-teal-400">
                        <IconList class="w-8 text-zinc-100" />
                    </a>
                </li>
                <li><a href="/" class="block p-2.5 text-white no-underline ml-2.5 hover:text-teal-400">
                        <IconAdd class="w-8 text-zinc-100" />
                    </a>
                </li>
            </ul>
        </nav>
    </header>
</template>