<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth';

const router = useRouter()
const authStore = useAuthStore();

const email = ref('')
const isLoading = ref(false)
const emailEnviado = ref(false)
const errorMessage = ref('')

const handleRecuperarSenha = async () => {
    if (!email.value) return

    isLoading.value = true
    errorMessage.value = ''

    try {
        const response = await authStore.solicitarRecuperacao({ email: email.value });

        emailEnviado.value = true

    } catch (error) {
        errorMessage.value = 'Ocorreu um erro ao processar sua solicitação.'
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="relative min-h-screen w-full bg-[#0a0a0c] flex items-center justify-center p-4 overflow-hidden">

        <div
            class="absolute w-[500px] h-[500px] bg-[#00FCFF]/5 rounded-full blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        </div>

        <div
            class="relative z-10 bg-black/5 backdrop-blur-xl border border-white/20 rounded-xl p-8 w-full max-w-[400px] shadow-[0_0_50px_rgba(0,0,0,0.6)]">

            <div class="flex flex-col items-center gap-4">
                <div
                    class="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-1">
                    <span class="text-[#00FCFF] text-xl">🔒</span>
                </div>

                <h2 class="text-zinc-100 font-black text-2xl uppercase tracking-tighter text-center">
                    Recuperar Senha
                </h2>

                <template v-if="!emailEnviado">
                    <p class="text-zinc-400 text-center text-sm leading-relaxed">
                        Esqueceu seus dados? Digite seu e-mail cadastrado para enviarmos um link de redefinição.
                    </p>

                    <div class="w-full mt-2">
                        <input v-model="email" type="email" placeholder="Digite seu e-mail"
                            @keyup.enter="handleRecuperarSenha" :disabled="isLoading"
                            class="w-full bg-white/15 border border-white/10 p-2.5 rounded text-white outline-none transition-colors focus:border-[#00FCFF] disabled:opacity-50">
                    </div>

                    <p v-if="errorMessage" class="text-red-400 text-xs text-center font-medium mt-1">
                        {{ errorMessage }}
                    </p>

                    <button @click="handleRecuperarSenha" :disabled="isLoading || !email"
                        class="w-full mt-2 bg-white/5 border border-white/20 text-white rounded-lg py-2.5 px-4 ring-1 ring-[#00FCFF]/50 hover:bg-[#00FCFF]/10 cursor-pointer transition-all disabled:opacity-40 disabled:hover:bg-transparent">
                        {{ isLoading ? 'Enviando Link...' : 'Enviar Link de Recuperação' }}
                    </button>
                </template>

                <template v-else>
                    <div class="p-4 rounded-lg bg-[#00FCFF]/5 border border-[#00FCFF]/20 text-center my-2">
                        <p class="text-[#00FCFF] font-bold text-sm mb-2">E-mail de recuperação enviado!</p>
                        <p class="text-zinc-400 text-xs leading-relaxed">
                            Se o endereço <span class="text-white font-semibold">{{ email }}</span> constar em nosso
                            sistema, você receberá um link de acesso em instantes.
                        </p>
                    </div>

                    <button @click="emailEnviado = false" class="mt-2 text-xs text-[#00FCFF] hover:underline">
                        Não recebeu? Tentar novamente
                    </button>
                </template>

                <div class="w-full h-[1px] bg-white/5 my-2"></div>

                <button @click="$router.push('/')"
                    class="cursor-pointer text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-wider font-bold">
                    Voltar para a Home
                </button>

            </div>
        </div>
    </div>
</template>

<style scoped>
/* Transição suave caso queira aplicar animações adicionais */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
