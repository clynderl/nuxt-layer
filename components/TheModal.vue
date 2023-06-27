<template>
  <transition
    name="overlay-appear"
    @enter="isContentVisible = true"
    @after-leave="afterOverlayClose"
  >
    <div
      v-if="isOverlayVisible"
      ref="overlay"
      :class="['overlay', classes]"
      @click.self="onClose"
    >
      <component
        :is="component"
        :data="options"
        :visible="isContentVisible"
        @close="onClose"
        @after-enter="isOverflowing = true"
        @before-leave="isOverflowing = false"
        @after-leave="afterContentClose"
      />
    </div>
  </transition>
</template>

<script setup lang="ts">
import {DefineComponent} from 'vue';

const component = ref<DefineComponent | null>(null);
const options = ref<Object | null>(null);
const newComponent = ref<DefineComponent | null>(null);
const newOptions = ref(null);
const isOverlayVisible = ref(false);
const isContentVisible = ref(false);
const isOverflowing = ref(false);

const classes = computed(() => [
  {
    _overflow: isOverflowing.value,
  },
]);

const onClose = () => {
  isContentVisible.value = false;
};

watch(
  () => useRoute().name,
  () => {
    onClose();
  }
);
const {$mitt} = useNuxtApp();

function onOpen({comp, data}: { comp: DefineComponent; data: object }) {
  if (isOverlayVisible.value) {
    newComponent.value = comp;
    newOptions.value = data || null;
    isContentVisible.value = false;
  } else {
    lockBody();
    component.value = comp;
    options.value = data || null;
    isOverlayVisible.value = true;
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (isOverlayVisible.value && e.key === 'Escape') {
    onClose();
  }
}

onBeforeMount(() => {
  $mitt.on('modal:open', onOpen);
  $mitt.on('modal:close', onClose);
  document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  $mitt.off('modal:open', onOpen);
  $mitt.off('modal:close', onClose);
  document.removeEventListener('keydown', handleKeydown);
});

function afterContentClose() {
  isOverflowing.value = false;

  if (newComponent.value) {
    component.value = newComponent.value;
    options.value = newOptions.value;
    newComponent.value = null;
    newOptions.value = null;

    nextTick(() => {
      isContentVisible.value = true;
    });
  } else {
    component.value = null;
    options.value = null;
    isOverlayVisible.value = false;
    unlockBody();
  }
}

function afterOverlayClose() {
  if (!isOverlayVisible.value) {
    unlockBody();
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 98;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: rgba(22, 24, 33, 0.85);
  backdrop-filter: blur(4px);
  -webkit-overflow-scrolling: touch;

  &._overflow {
    overflow-y: auto;
  }

  &:global(.overlay-appear-enter-active) {
    transition: all 0.4s;
  }

  &:global(.overlay-appear-leave-active) {
    transition: all 0.2s;
    opacity: 0;
  }

  &:global(.overlay-appear-enter-from) {
    opacity: 0;
  }
}
</style>
