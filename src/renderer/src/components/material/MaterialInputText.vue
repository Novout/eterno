<template>
  <input
    class="p-2 text-white raleway border-none shadow-xl bg-primary rounded-lg"
    v-model="model"
    type="text"
    autocomplete="true"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    required: true,
    type: String
  }
})

const emit = defineEmits(['update:modelValue'])
const model = computed({
  get() {
    return props.modelValue
  },
  set(val: any) {
    emit('update:modelValue', val as string)
  }
})
</script>
