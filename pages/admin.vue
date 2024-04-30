<script lang="ts" setup>
definePageMeta({
    title: "foo",
    middleware: "has-report-access",
});
</script>

<template>
    <NuxtPage />
</template>
