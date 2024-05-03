<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
import type { Userprofile } from './types';
const client = useKindeClient()

const {data: user} = await useAsyncData<Userprofile>(async () => {
    return (await client?.getUserProfile()) ?? {};
});

const state = useState('profile', () => user)

</script>
