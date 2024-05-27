<script setup lang="ts">
import { ref } from 'vue';
import TwitchAuth from '@/components/twitchAuth.vue';

interface ChannelClip {
  id: string;
  url: string;
  embed_url: string;
  broadcaster_id: string;
  broadcaster_name: string;
  creator_id: string;
  creator_name: string;
  video_id: string;
  game_id: string;
  language: string;
  title: string;
  view_count: number;
  created_at: string;
  thumbnail_url: string;
  duration: number;
  vod_offset: number | null;
  is_featured: boolean;
}

const channelClipsData = ref<ChannelClip[]>([]);
const handleClipsData = (data: ChannelClip[]) => { channelClipsData.value = data; };
</script>

<template>
  <section id="clips" class="content bordered-section">
    <h2>Twitch Clips</h2>
    <TwitchAuth @channelClipsFetched="handleClipsData" />
    <div v-if="channelClipsData.length > 0">
      <div v-for="clip in channelClipsData" :key="clip.id">
        <!-- Render each clip here -->
        <p>{{ clip.title }}</p>
        <img :src="clip.thumbnail_url" alt="Clip Thumbnail" />
        <!-- Log the clip data -->
        <pre>{{ JSON.stringify(clip, null, 2) }}</pre>
      </div>
    </div>
    <div v-else>
      <p>No clips found</p>
    </div>
  </section>
</template>

<style scoped>
/* Section styles */
.bordered-section {
  border: 5px solid white;
  padding: 1em;
  background-color: #f9f9f9;
}

#streams {
  margin: 2em 0;
}

.content {
  margin: 1em 0;
}

/* Additional styles for the Twitch embed */
#twitch-embed {
  margin-top: 1em;
}
</style>
