<template>
    <UDashboardNavbar :title="data?.title" />
    <UDashboardPanelContent>
        <UPageBody prose >
            <SanityContent :blocks="data?.content" />
        </UPageBody>
    </UDashboardPanelContent>
</template>

<script setup lang="ts">
import type { ContentPost } from '~/types'

definePageMeta({ layout: 'public' })
const route = useRoute()

const query = groq`*[_id == $id][0] {
  title,
  content,
  video,
  gallery
}`

const { data } = useSanityQuery<ContentPost>(query, { id: route.params.id })
</script>