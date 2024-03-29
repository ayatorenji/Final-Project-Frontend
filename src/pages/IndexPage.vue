<template>
  <q-page class="flex flex-center">
    <div class="my-card text-center">
      <div class="text-h4 q-mb-md">Welcome to Stray Animal Care!</div>
      <q-img
        src="/src/assets/Stray Animal Care Logo.png"
        contain
        style="max-width: 150px; max-height: 150px;"
      />
      <div class="q-mt-md">
        <q-btn label="Login" to="/login" color="green" class="full-width q-mb-md" />
        <q-btn label="Register" to="/register" color="green" class="full-width" />
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.gradient-bg {
  background: linear-gradient(to bottom, #0eff00, #1fc500);
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.my-card {
  max-width: 400px;
  width: 90%;
  padding: 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}
</style>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage'
})
</script>
