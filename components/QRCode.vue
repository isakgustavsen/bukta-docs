<script lang="ts" setup>
defineProps({
  id:String
})
</script>

<template>
  <div class="flex flex-col justify-center">
    <h1 class="text-2xl pb-4">Lenke til offentlig side</h1>
    <NuxtImg class="max-w-48" :src="'https://api.qrserver.com/v1/create-qr-code/?data=https://bukta.pages.dev/public/' + id " />
  </div>
</template>

<style scoped></style>
