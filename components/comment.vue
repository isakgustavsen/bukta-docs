<script lang="ts" setup>
import { defineProps } from 'vue';
import type { Comment } from '~/types';


defineProps({
  comment: {
    type: Object,
    required: true,
  },
});

</script>

<template>
  <div>
    <h4>{{ comment.comment }}</h4>
  </div>
</template>

<style scoped></style>
