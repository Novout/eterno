<template>
  <div class="w-40">
    <Listbox v-model="model">
      <div class="relative">
        <ListboxButton
          class="relative w-full cursor-default rounded-lg py-2 text-left shadow-md sm:text-sm"
        >
          <span class="block truncate">{{ model }}</span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute z-9999 mt-1 max-h-60 w-full overflow-auto rounded-md bg-primary py-1 text-base shadow-lg focus:outline-none sm:text-sm"
          >
            <ListboxOption
              v-slot="{ active, selected }"
              v-for="(item, index) in props.list"
              :key="index"
              :value="item"
              as="template"
              class="w-full"
            >
              <li
                :class="[
                  active ? 'bg-primary-colored text-black' : 'text-white',
                  'relative cursor-pointer w-full select-none py-2 pr-4'
                ]"
              >
                <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{
                  item
                }}</span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'

const props = defineProps({
  modelValue: {
    required: true,
    type: String
  },
  list: {
    required: true,
    type: Array<String>
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
