<script setup lang="ts">
import IconList from '@/components/icons/IconList.vue'
import IconAdd from '@/components/icons/IconAdd.vue'
import IconFilmeiroFooter from '@/components/icons/IconFilmeiroFooter.vue';
import { ref } from 'vue';

defineProps({
    loggedIn: Boolean
})

const isLoginVisible = ref(false)
const isCriarConta = ref(false)
</script>
<template>

    <div v-show="isLoginVisible" class="fixed z-50 bg-black/5 backdrop-blur-xl border border-white/20 rounded-xl p-8 
         top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
         shadow-[0_0_50px_rgba(0,0,0,0.5)] w-[90%] max-w-[400px]">
        <div class="flex flex-col items-center gap-4">
            <h2 class="text-zinc-100 font-black text-2xl uppercase tracking-tighter">Entrar</h2>
            <p class="text-white text-center text-sm">
                Acesse sua conta no Filmeiro para salvar suas listas.
            </p>

            <input type="text" placeholder="Usuário"
                class="w-full bg-white/15 border border-white/10 p-2 rounded text-white outline-none focus:border-[#00FCFF]">

            <input type="text" placeholder="Senha"
                class="w-full bg-white/15 border border-white/10 p-2 rounded text-white outline-none focus:border-[#00FCFF]">

            <button @click="isLoginVisible = false"
                class="bg-white/5 border border-white/20 text-white rounded-lg py-1 px-2 ring-1 ring-[#00FCFF]/50 hover:bg-[#00FCFF]/10 cursor-pointer transition-all h-fit">
                Entrar
            </button>

            <button @click="isLoginVisible = false"
                class="cursor-pointer mt-4 text-xs text-zinc-400 hover:text-white transition-colors">
                FECHAR
            </button>
        </div>
    </div>

    <div v-if="isLoginVisible" @click="isLoginVisible = false" class="fixed inset-0 bg-black/10 backdrop-blur-xs z-40">
    </div>

    <div v-show="isCriarConta" class="fixed z-50 bg-black/5 backdrop-blur-xl border border-white/20 rounded-xl p-8 
         top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
         shadow-[0_0_50px_rgba(0,0,0,0.5)] w-[90%] max-w-[400px]">
        <div class="flex flex-col items-center gap-4">
            <h2 class="text-zinc-100 font-black text-2xl uppercase tracking-tighter">Criar Conta</h2>
            <p class="text-white text-center text-sm">
                Crie sua conta no Filmeiro para salvar suas listas.
            </p>

            <input type="text" placeholder="Usuário"
                class="w-full bg-white/15 border border-white/10 p-2 rounded text-white outline-none focus:border-[#00FCFF]">

            <input type="text" placeholder="Senha"
                class="w-full bg-white/15 border border-white/10 p-2 rounded text-white outline-none focus:border-[#00FCFF]">

            <button @click="isCriarConta = false"
                class="bg-white/5 border border-white/20 text-white rounded-lg py-1 px-2 ring-1 ring-[#00FCFF]/50 hover:bg-[#00FCFF]/10 cursor-pointer transition-all h-fit">
                Criar Conta
            </button>

            <button @click="isCriarConta = false"
                class="cursor-pointer mt-4 text-xs text-zinc-400 hover:text-white transition-colors">
                FECHAR
            </button>
        </div>
    </div>

    <div v-if="isCriarConta" @click="isCriarConta = false" class="fixed inset-0 bg-black/10 backdrop-blur-xs z-40">
    </div>

    <header class="absolute w-full left-0 right-0 mx-auto z-11 flex flex-wrap items-center justify-between max-w-7xl">
        <a href="/" class="text-white no-underline text-2xl font-bold invisible md:visible">
            <IconFilmeiroFooter class="w-30 text-zinc-100" />
        </a>
        <nav>
            <ul class="flex list-none p-0 m-0">
                <li v-if="!loggedIn"><a class="block cursor-pointer p-2.5 text-white no-underline ml-2.5 hover:text-teal-400">
                        <a class="font-bold text-zinc-100" @click="isLoginVisible = !isLoginVisible"
                            :isLoginVisible="isLoginVisible">Entrar</a>
                    </a>
                </li>
                <li v-if="!loggedIn">
                    <a class="block cursor-pointer p-2.5 text-white no-underline ml-2.5 hover:text-teal-400" 
                    @click="isCriarConta = !isCriarConta" :isCriarConta="isCriarConta">
                        <p class="font-bold text-zinc-100">Criar Conta</p>
                    </a>
                </li>
                <li v-if="loggedIn"><a href="/" class="block p-2.5 text-white no-underline ml-2.5 hover:text-teal-400">
                        <IconList class="w-8 text-zinc-100" />
                    </a>
                </li>
                <li v-if="loggedIn"><a href="/" class="block p-2.5 text-white no-underline ml-2.5 hover:text-teal-400">
                        <IconAdd class="w-8 text-zinc-100" />
                    </a>
                </li>
            </ul>
        </nav>
    </header>


</template>