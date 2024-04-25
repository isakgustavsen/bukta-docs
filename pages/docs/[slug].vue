<template>
  <UDashboardNavbar :title="data?.title" />
  <UDashboardPanelContent>
      <UPageBody prose >
          <SanityContent :blocks="data?.content" />
      </UPageBody>
      <LazySanityFile v-if="data?.video" :asset-id="data.video.asset._ref">
      <template #default="{ src }">
        <video controls>
          <source :src="src" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </template>
    </LazySanityFile>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
const route = useRoute()
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

const { data } = useSanityQuery<ContentPost>(query, { slug: route.params.slug })
</script>