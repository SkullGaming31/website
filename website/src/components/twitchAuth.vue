<template>
  <div>
    <button @click="loginWithTwitch">Login with Twitch</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, onMounted } from 'vue';
import axios from 'axios';

export default defineComponent({
  setup() {
    const clientId = 'bmorajsa11mnb04kl7cl0q0odxu7qb';
    const redirectUri = 'http://localhost:3001/api/v1/auth/twitch/callback';
    const instance = getCurrentInstance();

    // Define interfaces for API responses and data
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

    interface UserApiResponse {
      data: UserData[];
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

    interface ChannelApiResponse {
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

    interface StreamApiResponse {
      data: StreamData[];
      pagination: {
        cursor: string;
      };
    }

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

    interface ChannelClipsApiResponse {
      data: ChannelClip[];
      pagination: {
        cursor: string;
      };
    }

    // Define reactive data
    const userData = ref<UserData | null>(null);
    const channelData = ref<ChannelData | null>(null);
    const channelSubscriptionData = ref<ChannelSubscriptionData | null>(null);
    const channelClipsData = ref<ChannelClipsApiResponse | null>(null);
    const streamOnlineData = ref<StreamApiResponse | null>(null);

    // Function to initiate Twitch login
    const loginWithTwitch = () => {
      const url = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=user:read:email channel:read:subscriptions`;
      window.location.href = url;
    };

    // Function to fetch user data from Twitch API
    const fetchUserData = async (token: string) => {
      console.log('Fetching user data...');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Client-ID': clientId,
      };
      try {
        const response = await axios.get<UserApiResponse>('https://api.twitch.tv/helix/users', { headers });
        userData.value = response.data.data[0];
        instance?.emit('userDataFetched', userData.value);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Function to fetch channel data from Twitch API
    const fetchChannelData = async (token: string) => {
      console.log('Fetching channel data...');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Client-ID': clientId,
      };
      try {
        const followerResponse = await axios.get<ChannelApiResponse>('https://api.twitch.tv/helix/channels/followers', {
          headers,
          params: {
            broadcaster_id: '31124455'
          }
        });
        channelData.value = {
          total: followerResponse.data.total,
          data: followerResponse.data.data,
          pagination: followerResponse.data.pagination
        };
        instance?.emit('channelDataFetched', channelData.value);
      } catch (error) {
        console.error('Error fetching channel data:', error);
      }
    };

    // Function to fetch channel subscriptions from Twitch API
    const fetchChannelsubscriptions = async (token: string) => {
      console.log('Fetching channel subscriptions...');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Client-ID': clientId,
      };

      try {
        const subscriptionsResponse = await axios.get<ChannelSubscriptionData>('https://api.twitch.tv/helix/subscriptions', {
          headers,
          params: {
            broadcaster_id: '31124455'
          }
        });

        channelSubscriptionData.value = subscriptionsResponse.data;
        instance?.emit('channelSubscriptionsFetched', channelSubscriptionData.value);
      } catch (error) {
        console.error('Error fetching channel data:', error);
      }
    };

    // Function to fetch channel clips from Twitch API
    const fetchChannelClips = async (token: string) => {
      console.log('Fetching channel Clips...');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Client-ID': clientId,
      };
      try {
        const clipsResponse = await axios.get<ChannelClipsApiResponse>('https://api.twitch.tv/helix/clips', {
          headers,
          params: {
            broadcaster_id: '31124455',
            first: 10
          }
        });
        channelClipsData.value = clipsResponse.data;
        instance?.emit('channelClipsFetched', channelClipsData.value);
        console.log('Channel Clips after Emit', channelClipsData.value);
      } catch (error) {
        console.error('Error fetching channel Clips:', error);
      }
    };

    // Function to fetch stream data from Twitch API
    const fetchStream = async (token: string) => {
      console.log('Fetching Online Stream...');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Client-ID': clientId,
      };
      try {
        const streamOnlineResponse = await axios.get<StreamApiResponse>('https://api.twitch.tv/helix/streams', {
          headers,
          params: {
            user_id: '31124455'
          }
        });
        streamOnlineData.value = streamOnlineResponse.data;
        instance?.emit('streamOnlineFetched', streamOnlineData.value);
      } catch (error) {
        console.error('Error fetching channel Clips:', error);
      }
    };

    // Function to get cookie value by name
    const getCookie = (name: string) => {
      console.log('Getting cookie:', name);
      console.log('All cookies:', document.cookie);
      const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
      console.log('Cookie match:', cookieValue);
      return cookieValue ? cookieValue.pop() : null;
    };

    // Use onMounted lifecycle hook to fetch data on component mount
    onMounted(async () => {
      console.log('Mounted hook called');
      const accessToken = getCookie('access_token');
      if (accessToken) {
        try {
          await fetchUserData(accessToken);
          await fetchChannelData(accessToken);
          await fetchChannelsubscriptions(accessToken);
          await fetchChannelClips(accessToken);
          await fetchStream(accessToken);
        } catch (error) {
          console.error('Error during authentication:', error);
        }
      } else {
        console.error('Access token not found');
      }
    });
    // Set Axios defaults to include credentials
    axios.defaults.withCredentials = true;
    return {
      userData,
      channelData,
      channelSubscriptionData,
      channelClipsData,
      streamOnlineData,
      loginWithTwitch,
    };
  },
});
</script>

<style scoped>
button {
  padding: 10px 20px;
  background-color: #9147ff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #772ce8;
}

div {
  text-align: center;
}
</style>