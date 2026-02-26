<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
// Main shell for IRIS-TS
</script>

<style>
@keyframes scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(1000%); } 
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.custom-textarea::-webkit-scrollbar { width: 6px; }
.custom-textarea::-webkit-scrollbar-track { background: transparent; }
.custom-textarea::-webkit-scrollbar-thumb { background-color: rgba(16, 185, 129, 0.2); border-radius: 20px; }
.custom-textarea::-webkit-scrollbar-thumb:hover { background-color: rgba(16, 185, 129, 0.5); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
