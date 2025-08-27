<template>
  <div>
    <Switch
      v-model="model"
      :class="model ? 'bg-primary-colored' : 'bg-primary'"
      class="relative inline-flex h-[38px] w-[82px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
    >
      <span class="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        :class="model ? 'translate-x-9 bg-black' : 'translate-x-0 bg-white'"
        class="pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out"
      />
    </Switch>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Switch } from '@headlessui/vue'

const props = defineProps({
  modelValue: {
    required: true,
    type: Boolean
  }
})

const emit = defineEmits(['update:modelValue'])
const model = computed({
  get() {
    return props.modelValue
  },
  set(val: any) {
    emit('update:modelValue', val)
  }
})
</script>
