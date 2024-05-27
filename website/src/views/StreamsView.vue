<template>
  <section id="streams" class="content bordered-section">
    <h2>Streams</h2>
    <!-- <p>Loading streams...</p> -->
    <div class="embed-container">
      <div>
        <h3>CanadienDragon</h3>
        <div id="canadien-dragon-embed"></div>
      </div>
      <div>
        <h3>Modvlog</h3>
        <div id="modvlog-embed"></div>
      </div>
      <div>
        <h3>Lonnybluebird</h3>
        <div id="lonny-bluebird-embed"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  loadTwitchEmbed("canadien-dragon-embed", "canadiendragon");
  loadTwitchEmbed("modvlog-embed", "modvlog");
  loadTwitchEmbed("lonny-bluebird-embed", "lonnybluebird");
});

function loadTwitchEmbed(embedId: string, channel: string) {
  const embed = new Twitch.Embed(embedId, {
    width: 750,
    height: 400,
    channel: channel,
    layout: "video",
    autoplay: true,
    parent: ["localhost"]
  });

  embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
    const player = embed.getPlayer();
    player.play();
  });
}
</script>

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

.embed-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.embed-container > div {
  margin-bottom: 20px;
}

h3 {
  text-align: center;
}
</style>