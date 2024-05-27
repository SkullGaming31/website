<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import AppFooter from '@/components/appFooter.vue';
import NavBar from '@/components/appNavBar.vue';
import TwitchAuth from '@/components/twitchAuth.vue';

interface UserData {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  email?: string;
  created_at: string;
}

interface Follower {
  followed_at: string;
  user_id: string;
  user_login: string;
  user_name: string;
}

interface ChannelData {
  total: number;
  data: Follower[];
  pagination: {
    cursor?: string;
  };
}

interface ChannelSubscriptionData {
  data: {
    broadcaster_id: string;
    broadcaster_login: string;
    broadcaster_name: string;
    gifter_id: string;
    gifter_login: string;
    gifter_name: string;
    is_gift: boolean;
    plan_name: string;
    tier: '1000' | '2000' | '3000'; // Tier 1, Tier 2, Tier 3
    user_id: string;
    user_name: string;
    user_login: string;
  }[];
  pagination: {
    cursor: string;
  };
  points: number;
  total: number;
}

interface StreamData {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: 'live' | '';
  title: string;
  tags: string[];
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  is_mature: boolean;
}

const userData = ref<UserData | null>(null);
const channelData = ref<ChannelData | null>(null);
const channelSubscriptionData = ref<ChannelSubscriptionData | null>(null);
const streamOnlineData = ref<StreamData | null>(null);

const handleUserData = (data: UserData | null) => {
  userData.value = data;
};

const handleChannelData = (data: ChannelData | null) => {
  channelData.value = data;
};

const handleChannelSubscriptions = (data: ChannelSubscriptionData | null) => {
  channelSubscriptionData.value = data;
}

const handleStreamOnline = (data: StreamData | null) => {
	streamOnlineData.value = data;
}
</script>

<template>
  <div id="app">
    <div class="header-container">
      <header>
        <div class="header-content">
          <h1 class="header-title">CanadienDragon</h1>
        </div>
      </header>
      <NavBar />
    </div>
    <div class="main">
      <div class="left-sidebar" >
        <section id="twitch-stats" class="content bordered-section">
          <twitch-auth @userDataFetched="handleUserData" @channelDataFetched="handleChannelData" @channelSubscriptionsFetched="handleChannelSubscriptions" @streamOnlineFetched="handleStreamOnline" />
          <div v-if="userData && channelData">
            <h2>Welcome, {{ userData.display_name }}</h2>
            <img :src="userData.profile_image_url" alt="User Avatar" />
            <h2>Twitch Stats</h2>
						<p v-if="streamOnlineData">
							Stream: <span :style="{ color: streamOnlineData.type === 'live' ? 'green' : 'red' }">{{ streamOnlineData.type === 'live' ? 'Online' : 'Offline' }}</span>
						</p>
						<p>Broadcaster Type: {{ userData.broadcaster_type }}</p>
            <p v-if="channelData">Followers: {{ channelData.total }}</p>
            <p v-if="channelSubscriptionData">Subs: {{ channelSubscriptionData.total }}</p>
          </div>
        </section>
      </div>
      <div class="main-content">
        <RouterView />
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<style>
/* Reset default margin and padding */
body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
ul,
ol {
  margin: 0;
  padding: 0;
}

/* Ensure full width and height */
html,
body,
#app {
  height: 100%;
  width: 100%;
}

/* Flexbox layout for app */
#app {
  display: flex;
  flex-direction: column;
}

/* Header styles */
.header-container {
  background-color: #333;
  color: #fff;
  padding: 1em 0;
  text-align: center;
}

.header-content {
  margin-bottom: 0.5em;
}

.header-title {
  font-size: 1.5em;
}

/* Bordered section */
.bordered-section {
  border: 5px solid white;
  padding: 1em;
}

/* Main content styles */
.main {
  flex: 1;
  display: flex;
}

.left-sidebar {
  margin-right: 1em; 
}

.main-content {
  flex: 1;
}

img {
  border-radius: 50%;
  width: 120px;
  height: 120px;
}
</style>