<template>
  <div class="min-h-screen">
    <LandingPage @enter="handleEnter" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import LandingPage from '../components/LandingPage.vue'

const router = useRouter()
const handleEnter = () => {
  router.push('/scanner')
}
</script>
