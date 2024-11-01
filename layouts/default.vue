<script setup lang="ts">
import { ChevronRight, Eclipse, Home, PowerOff } from 'lucide-vue-next';
const colorMode = useColorMode()
const { user, signOutUser } = useFirebaseAuth()

const signoutHandler = () => {
  signOutUser().then(() => {
    navigateTo('/login')
  })
}
</script>

<template>
  <header class="">
    <nav class="flex flex-row justify-self-center gap my-2 items-center gap-4">
      <NuxtLink to="/">
        <Button
          size="icon"
          variant="default"
        >
          <Home class="" />
        </Button>
      </NuxtLink>
      <Button
        @click="colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light'"
        size="icon"
        variant="default"
      >
        <Eclipse class="" />
      </Button>
      <Button
        @click="signoutHandler()"
        size="icon"
        variant="default"
      >
        <PowerOff class="" />
      </Button>
      <div>
        <p>{{ user?.email }}</p>
        <p>{{ user?.displayName }}</p>
      </div>
    </nav>
  </header>
  <main>
    <div class="flex flex-col justify-self-center">
      <slot />
    </div>
  </main>
</template>