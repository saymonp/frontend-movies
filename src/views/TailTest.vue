<template>
    <div class="font-sans text-lg mb-24 text-zinc-800">

        <header class="bg-[#1d1e20] flex flex-wrap justify-between items-center p-5">
            <a href="/" class="text-white no-underline text-2xl font-bold">Logo</a>
            <nav>
                <ul class="flex list-none p-0 m-0">
                    <li><a href="/" class="block p-2.5 text-white no-underline ml-2.5 hover:text-teal-400">Sobre</a>
                    </li>
                    <li><a href="/" class="block p-2.5 text-white no-underline ml-2.5 hover:text-teal-400">Produtos</a>
                    </li>
                    <li><a href="/" class="block p-2.5 text-white no-underline ml-2.5 hover:text-teal-400">Contato</a>
                    </li>
                </ul>
            </nav>
        </header>

        <h1 class="text-center mt-24 text-3xl font-bold mb-6">Section Flexbox</h1>
        <section class="flex flex-wrap max-w-3xl mx-auto">
            <div v-for="n in 6" :key="n" class="flex-1 basis-50 m-2.5">
                <img src="/photo-1495360010541-f48722b34f7d.avif?text=Gato" class="max-w-full block">
                <p class="mt-2">Legenda</p>
            </div>
        </section>

        <h1 class="text-center mt-24 text-3xl font-bold mb-6">Section Grid 1</h1>
        <section class="grid grid-cols-2 sm:grid-cols-3 max-w-3xl gap-5 p-2.5 mx-auto">

            <div v-for="n in 3" :key="'g1-' + n">
                <img src="/assets/photo-1503777119540-ce54b422baff.avif?text=Gato" class="max-w-full block">
                <p class="mt-2">Legenda</p>
            </div>

            <div class="col-start-1 row-start-2 row-end-5 border-t-10 border-tomato hidden sm:block">
                <img src="/assets/photo-1514888286974-6c03e2ca1dba.avif?text=Gato" class="max-w-full block">
                <p class="mt-2">Anúncio</p>
            </div>

            <div v-for="n in 6" :key="'g1-sub-' + n" class="grid grid-cols-2 gap-2.5 items-center sm:block">
                <img src="/assets/photo-1561948955-570b270e7c36.avif?text=Gato" class="max-w-full block">
                <p>Legenda</p>
            </div>
        </section>

        <h1 class="text-center mt-24 text-3xl font-bold mb-6">Section Grid 2</h1>
        <section class="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-5 max-w-200 p-2.5 mx-auto">
            <div class="video">
                <img src="/assets/photo-1573865526739-10659fec78a5.avif?text=Video" class="max-w-full block">
                <h2 class="text-xl mt-4 font-bold">Como criar sites.</h2>
            </div>

            <div class="flex overflow-x-auto sm:block sm:overflow-visible gap-4">
                <div v-for="n in 4" :key="'side-' + n" class="flex-none w-50 sm:w-full mb-2.5">
                    <img src="/assets/premium_photo-1664299749481-ac8dc8b49754.avif?text=Gato"
                        class="max-w-full block">
                    <p class="mt-1">Legenda</p>
                </div>
            </div>
        </section>

        <h1 class="text-center mt-24 text-3xl font-bold mb-6">Section Grid 3</h1>
        <section class="grid grid-cols-2 gap-5 max-w-200 p-2.5 mx-auto">

            <div class="grid row-span-2 relative">
                <img src="/assets/premium_photo-1667030474693-6d0632f97029.avif?text=Gato"
                    class="w-full h-full object-cover self-end">
                <p class="absolute bottom-0 w-full bg-black/60 p-2.5 text-white">Legenda</p>
            </div>

            <div class="grid relative">
                <img src="/assets/premium_photo-1667030474693-6d0632f97029.avif?text=Gato"
                    class="w-full h-full object-cover self-end">
                <p class="absolute bottom-0 w-full bg-black/60 p-2.5 text-white">Legenda</p>
            </div>

            <div class="grid relative">
                <img src="/assets/premium_photo-1677545183884-421157b2da02.avif?text=Gato"
                    class="w-full h-full object-cover self-end">
                <p class="absolute bottom-0 w-full bg-black/60 p-2.5 text-white">Legenda</p>
            </div>
        </section>

    </div>

    <section class="bg-blue-600 py-12">
        <div class="max-w-3xl mx-auto px-4">
            <h2 class="text-white text-center">Este fundo é azul infinito, mas o texto está no centro.</h2>
        </div>
    </section>
<div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
  <p class="text-white">Este card desfoca o que está atrás dele!</p>
</div>
    <section>
        <div class="bg-zinc-400 py-12 max-w-3xl mx-auto px-4">
            <p class="text-center">Mesmo alinhamento da seção de cima!</p>
        </div>
    </section>
</template>

<style>
/* CSS adicional apenas para cores que o Tailwind não tem por padrão */
.border-tomato {
    border-color: tomato;
}
</style>