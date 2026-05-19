<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import TheFooter from '@/components/TheFooter.vue';
</script>

<template>

    <div class="bg-zinc-200">
        <Navbar />
        <div class="bg-zinc-500 w-full h-12"></div>
        <div class="max-w-3xl mx-auto pt-10">
            <h3 class="text-black font-bold uppercase text-m tracking-widest mt-2 mb-2"> 1. POLÍTICA DE PRIVACIDADE</h3>
            <h4 class="text-black font-bold uppercase text-sm tracking-widest mt-1">Última atualização: Maio de 2026.
            </h4>

            <div class="text-black font-normal text-sm tracking-widest mt-1">Bem-vindo ao Filmeiro. Nós valorizamos a
                sua
                privacidade e operamos sob o princípio da minimização de dados, coletando apenas o estritamente
                necessário para o funcionamento da plataforma.</div>

            <h4 class="text-black font-bold text-sm tracking-widest mt-5">1. Dados Coletados e Finalidade</h4>
            <div class="text-black font-bold text-sm tracking-widest mt-1">Coletamos apenas três informações no momento
                do
                seu cadastro:</div>
            <ul class="list-disc">
                <li>Nome de Usuário (Apelido): Pode ser um nome fictício ou pseudônimo. Serve exclusivamente para
                    identificar o seu perfil, suas listas e seus reviews na plataforma.
                </li>
                <li>
                    E-mail: Utilizado única e exclusivamente para a autenticação da sua conta e para o envio de links de
                    recuperação/troca de senha, caso você a esqueça.

                </li>
                <li>
                    Senha: Armazenada de forma criptografada em nosso banco de dados, servindo apenas para garantir o
                    seu acesso seguro.

                </li>
            </ul>



            <div class="text-black font-bold text-sm tracking-widest mt-5">2. O que NÃO fazemos com seus dados</div>
            <ul class="list-disc">
                <li>Não enviamos e-mails de marketing, newsletters ou spans sem sua autorização expressa.</li>

                <li>Não comercializamos, compartilhamos ou transferimos seus dados para terceiros ou empresas de
                    publicidade.</li>

                <li>Não rastreamos sua navegação fora do nosso site.</li>
            </ul>
            <h4 class="text-black font-bold text-sm tracking-widest mt-5">3. Direitos do Usuário (LGPD)</h4>
            <ul class="list-disc">
                <li>
                    Você tem total controle sobre seus dados. A qualquer momento, através das configurações do seu
                    perfil, você
                    pode:
                </li>
                <li>
                    Trocar sua senha.
                </li>
                <li>
                    Excluir permanentemente sua conta. Ao clicar em deletar conta, todas as suas informações, listas e
                    registros
                    serão apagados definitivamente do nosso banco de dados, sem possibilidade de recuperação.
                </li>
            </ul>
        </div>
    </div>
    <TheFooter />
</template>
