<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          CanadienDragon
        </q-toolbar-title>

        <!-- <q-btn dense flat round icon="menu" @click="toggleRightDrawer" /> -->
      </q-toolbar>

      <div class="q-space"></div>

      <div class="q-pa-md" style="position: absolute; right: 10px; top: 15px;">
          <q-btn-dropdown color="primary" label="Chat Bots">
            <q-list>
              <q-item clickable v-close-popup @click="twitchAuth">
                <q-item-section>
                  <q-item-label>Twitch</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="discordAuth">
                <q-item-section>
                  <q-item-label>Discord</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <!-- <q-toggle v-model="$q.dark.isActive" label="Dark Mode" @change="toggleDarkMode" /> -->

      <q-tabs align="center">
        <q-route-tab to="/" label="Home" />
        <q-route-tab to="/about" label="About Me" />
        <q-route-tab to="/clips" label="Clips" />
      </q-tabs>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" behavior="desktop" bordered>
  <div class="drawer-content">
    <h6>Twitch Metrics</h6>
    <p><strong>Followers</strong>: {{ followersCount }}</p>
    <p><strong>Subscribers</strong>: {{ subscriberCount }}</p>
    <p><strong>Moderators</strong>: {{ 'NONE' }}</p>
    <!-- Add other Twitch metrics if needed -->
    <button @click="openTwitchStream()">Watch Stream</button>
  </div>
</q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal bordered class="bg-grey-8 text-white">
  <q-toolbar>
    <q-toolbar-title>
      <div class="text-center">
        <p>&copy; 2023 CanadienDragon - All rights reserved.</p>
      </div>
      <ul class="footer-links">
        <li><a href="mailto:skullgamingg31@gmail.com" target="_blank">Email</a></li>
        <li><a href="https://twitch.tv/canadiendragon" target="_blank">Twitch</a></li>
        <li><a href="https://twitter.com/canadiendragon1" target="_blank">Twitter</a></li>
        <li><a href="https://instagram.com/canadiendragon" target="_blank">Instagram</a></li>
        <li><a href="https://discord.com/invite/dHpehkD6M3" target="_blank">Discord</a></li>
      </ul>
    </q-toolbar-title>
  </q-toolbar>
</q-footer>

  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { useQuasar } from 'quasar'

// Define the reactive variable
// const $q = useQuasar()
// const darkMode = ref(false)
const leftDrawerOpen = ref(false)
const followersCount = ref(0) // Use ref to define followersCount
const subscriberCount = ref(0)

// Function to toggle dark mode
// const toggleDarkMode = () => {
//   darkMode.value = !darkMode.value
//   $q.dark.set(darkMode.value)
// }
const twitchAuth = () => {
  console.log('Twitch Button Clicked')
  // Redirect to the Twitch URL
  window.location.href = 'https://google.ca' // Replace with your Twitch URL
}

const discordAuth = () => {
  console.log('Discord Button Clicked')
  // Redirect to the Discord URL
  window.location.href = 'http://localhost:3001/api/v1/discord' // Replace with your Discord URL
}
// Define the method inside the setup function
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
// Define the openTwitchStream method here
const openTwitchStream = () => {
  const twitchUsername = 'CanadienDragon' // Replace with the Twitch username you want to open the stream for
  const twitchStreamURL = `https://www.twitch.tv/${twitchUsername}`

  // Define the dimensions and options for the popup window
  const popupWidth = 800
  const popupHeight = 600
  const popupOptions = `width=${popupWidth},height=${popupHeight},resizable=yes`

  // Open the Twitch stream URL in a popup window
  window.open(twitchStreamURL, '_blank', popupOptions)
}

// Expose the reactive variable and method to be used in the template
// defineProps({
//   leftDrawerOpen,
// })

defineEmits([
  // If you have any custom events to emit, define them here
])

defineExpose({
  toggleLeftDrawer,
  openTwitchStream // Expose the openTwitchStream method
})
</script>

<style lang="scss">
// Define SCSS variables for reuse
$footer-links-margin: 15px;

.footer-links {
  list-style: none; // Remove default list styles
  display: flex; // Display the links horizontally
  align-items: center; // Align the links vertically in the middle
  justify-content: center; // Center the links horizontally
  padding: 0; // Remove padding to avoid extra space

  li {
    margin-right: $footer-links-margin; // Add some space between links
    &:last-child {
      margin-right: 0; // Remove margin for the last link
    }
  }
}
</style>
