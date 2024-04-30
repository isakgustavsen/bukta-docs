<template>
  <UDashboardPanelContent>
      <UPageBody prose >
          <SanityContent :blocks="data?.content" />
      </UPageBody>
      <UButton @click="isVideoOpen = true" label="Se Videoinstruks" v-if="data?.video" />
    <UCarousel v-slot="{ item }" :items="data?.gallery" :ui="{ item: 'basis-full' }" indicators class="rounded-lg overflow-hidden">
      <div class="text-center mx-auto">
        <SanityImage :asset-id="item.asset._ref" format="auto"/>
      </div>
    </UCarousel>
    <!-- <QRCode :id="data._id" /> -->
  </UDashboardPanelContent>
  <UModal v-model="isVideoOpen" >
    <UCard>
      <div class="mx-auto max-w-full">
        <LazySanityFile v-if="data?.video" :asset-id="data.video.asset._ref">
          <template #default="{ src }">
            <video controls>
              <source :src="src" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </template>
        </LazySanityFile>
      </div>
      <template #footer>
        <UButton @click="isVideoOpen = false" label="Lukk" />
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const route = useRoute()
const isVideoOpen = ref(false)

import type { ContentPost } from '~/types'

definePageMeta({
  middleware: ['auth-logged-in']
})

const query = groq`*[_type == "contentPage" && slug.current == $slug][0] {
  title,
  content,
  video,
  gallery
}`

const { data } = await useSanityQuery<ContentPost>(query, { slug: route.params.slug })
useTitle(data.value?.title)

</script>