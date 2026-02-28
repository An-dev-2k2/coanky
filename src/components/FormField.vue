<template>
  <div>
    <label :for="props.name" :class="color" class="text-sm font-semibold block">{{ props.label }}</label>
    <slot />
    <ErrorMessage :name="props.name" v-slot="{ message }">
      <p class="text-red-500 text-xs mt-1">{{ message }}</p>
    </ErrorMessage>
  </div>
</template>

<script setup>
import { ErrorMessage } from "vee-validate";

const props = defineProps({
  label: { type: String, default: '' },
  name: { type: String, required: true },
  color: { type: String, default: 'text-black' },
});

</script>