<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
const query = groq`*[_id == "b7e407b5-ad08-4fd2-9311-0ccd601f07c1"][0]`

const { data } = await useSanityQuery(query)
</script>
