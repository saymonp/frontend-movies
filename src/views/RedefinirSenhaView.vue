<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth';

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore();
const isLoading = ref(false)
const sucesso = ref(false)
const errorMsgLocal = ref('')

const formData = reactive({
  email: '',
  token: '',
  new_password: '',
  confirm_password: ''
})

onMounted(() => {
  formData.email = route.query.email as string || ''
  formData.token = route.query.token as string || ''

  // Se vier sem token, avisa o usuário
  if (!formData.token || !formData.email) {
    errorMsgLocal.value = 'Link de recuperação inválido ou incompleto.'
  }
})

// Validação reativa em tempo real antes de enviar para o Laravel
const isFormValido = computed(() => {
  return (
    formData.new_password.length >= 8 &&
    formData.new_password === formData.confirm_password &&
    formData.token &&
    formData.email
  )
})

const handleResetSenha = async () => {
  if (!isFormValido.value) {
    if (formData.new_password !== formData.confirm_password) {
      errorMsgLocal.value = 'As senhas digitadas não coincidem.'
    }
    return
  }

  isLoading.value = true
  errorMsgLocal.value = ''

  try {
    const response = await authStore.redefinirSenha({
       email: formData.email,
       token: formData.token,
       new_password: formData.new_password
     })

    // Store já salva o token recebido (access_token) no localStorage
    // o usuário já fica logado direto.
    sucesso.value = true

    // Redireciona para o perfil do usuário após 2 segundos
    setTimeout(() => {
      router.push('/perfil')
    }, 2000)

  } catch (error) {
    errorMsgLocal.value = 'Erro ao redefinir a senha. O token pode ter expirado.'
  } finally {
    isLoading.value = false
  }
}
</script>
<template>
  <div class="relative min-h-screen w-full bg-[#0a0a0c] flex items-center justify-center p-4 overflow-hidden">
    
    <div class="absolute w-[500px] h-[500px] bg-[#00FCFF]/5 rounded-full blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

    <div class="relative z-10 bg-black/5 backdrop-blur-xl border border-white/20 rounded-xl p-8 w-full max-w-[400px] shadow-[0_0_50px_rgba(0,0,0,0.6)]">
      
      <div class="flex flex-col items-center gap-4">
        
        <div class="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-1">
          <span class="text-[#00FCFF] text-xl">🔄</span>
        </div>

        <h2 class="text-zinc-100 font-black text-2xl uppercase tracking-tighter text-center">
          Nova Senha
        </h2>

        <template v-if="!sucesso">
          <p class="text-zinc-400 text-center text-sm leading-relaxed mb-2">
            Quase lá! Digite e confirme sua nova senha de acesso abaixo.
          </p>

          <div class="w-full relative">
            <input 
              v-model="formData.new_password" 
              type="password" 
              placeholder="Nova Senha (mín. 8 caracteres)"
              :disabled="isLoading"
              class="w-full bg-white/15 border border-white/10 p-2.5 rounded text-white outline-none transition-colors focus:border-[#00FCFF] disabled:opacity-50"
            >
          </div>

          <div class="w-full relative">
            <input 
              v-model="formData.confirm_password" 
              type="password" 
              placeholder="Confirme a Nova Senha"
              @keyup.enter="handleResetSenha"
              :disabled="isLoading"
              class="w-full bg-white/15 border border-white/10 p-2.5 rounded text-white outline-none transition-colors focus:border-[#00FCFF] disabled:opacity-50"
            >
          </div>

          <p v-if="errorMsgLocal" class="text-red-400 text-xs text-center font-medium mt-1">
            {{ errorMsgLocal }}
          </p>

          <button 
            @click="handleResetSenha" 
            :disabled="isLoading || !isFormValido"
            class="w-full mt-2 bg-white/5 border border-white/20 text-white rounded-lg py-2.5 px-4 ring-1 ring-[#00FCFF]/50 hover:bg-[#00FCFF]/10 cursor-pointer transition-all disabled:opacity-40 disabled:hover:bg-transparent"
          >
            {{ isLoading ? 'Atualizando Senha...' : 'Redefinir Senha' }}
          </button>
        </template>

        <template v-else>
          <div class="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center my-2 w-full">
            <p class="text-emerald-400 font-bold text-sm mb-2">Senha alterada com sucesso!</p>
            <p class="text-zinc-400 text-xs leading-relaxed">
              Sua credencial foi atualizada e você já está autenticado no Filmeiro.
            </p>
          </div>

          <p class="text-zinc-500 text-[11px] uppercase tracking-wider animate-pulse">
            Redirecionando para o seu perfil...
          </p>
        </template>

      </div>
    </div>
  </div>
</template>

