<template>
  <div class="main" style="text-align: center;">
    <q-carousel
      v-model="slide"
      transition-prev="scale"
      transition-next="scale"
      swipeable
      animated
      control-color="white"
      navigation
      padding
      arrows
      height="300px"
      class="bg-primary text-white shadow-1 rounded-borders"
    >
      <q-carousel-slide name="clips" class="column no-wrap flex-center">
        <div class="q-mt-md text-center">
          <h2>Twitch Clips</h2>
          <!-- Display your Twitch clips here -->
          <div class="clip-container">
            <div v-for="clip in clips" :key="clip.id" class="clip">
              <!-- Display clip information, e.g., thumbnail, title, URL -->
              <img :src="clip.thumbnail_url" alt="Clip Thumbnail" />
              <p>{{ clip.title }}</p>
              <a :href="clip.url" target="_blank">Watch Clip</a>
            </div>
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  setup () {
    const slide = ref('clips')
    const clips = ref([])

    // Function to fetch Twitch clips
    const fetchTwitchClips = async () => {
      try {
        const clientId = 'bmorajsa11mnb04kl7cl0q0odxu7qb'
        const channelName = 'canadiendragon'
        const clipLimit = 5 // Number of clips to retrieve

        const headers = {
          'Client-ID': clientId,
          Authentication: 'Bearer 5yzebwn4q5lfof2ps9u21lwytzvb53'
        }

        const response = await axios.get(
          `https://api.twitch.tv/helix/clips?broadcaster_id=${channelName}&first=${clipLimit}`,
          { headers }
        )

        clips.value = response.data.data
      } catch (error) {
        console.error('Error fetching Twitch clips:', error)
      }
    }

    // Fetch Twitch clips when the component is mounted
    onMounted(() => {
      fetchTwitchClips()
    })

    return {
      slide,
      clips
    }
  }
}
</script>

<style>
.main {
  max-width: 100%;
  max-height: auto;
}

/* Style for Twitch clips */
.clip-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
}

.clip {
  text-align: center;
}

.clip img {
  max-width: 100%;
  height: auto;
}

.clip p {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.clip a {
  text-decoration: none;
  background-color: #9147ff;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}

.clip a:hover {
  background-color: #7533e2;
}
</style>
