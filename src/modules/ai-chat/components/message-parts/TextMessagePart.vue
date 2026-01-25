<template>
  <div class="text-message-part">
    <MarkdownRenderer :content="part.content" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import MarkdownRenderer from '../MarkdownRenderer.vue';

const props = defineProps({
  part: {
    type: Object,
    required: true,
    validator: (value) => value.type === 'text' && typeof value.content === 'string'
  }
});
</script>

<style scoped>
.text-message-part {
  margin-bottom: var(--spacing-2);
}
</style>
