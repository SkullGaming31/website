<script setup lang="ts">

</script>

<template>
  <div class="main" style="text-align: center;">
    <h2>Welcome to my Personal Website!</h2>
      <p>Hello, fellow viewers and gamers! My name is CanadienDragon, and this is my personal website. Here, you can
        find updates on my Twitch channel and exciting gaming content.</p>
      <p>I love interacting with my audience and playing various games. If you haven't followed me on Twitch yet, hit
        that follow button and be part of our gaming community!</p>

      <!-- Featured Clips Section -->
      <div class="featured-clips no-bullets">
        <h3>Featured Clips</h3>
        <p>1. [Clip Title 1] - Watch it <a href="[Clip URL 1]">here</a></p>
        <p>2. [Clip Title 2] - Watch it <a href="[Clip URL 2]">here</a></p>
        <p>3. [Clip Title 3] - Watch it <a href="[Clip URL 3]">here</a></p>
        <!-- Add more clips as needed -->
      </div>

      <!-- Call to Action for Social Media -->
    <h3>Follow Me on Social Media</h3>
    <ul class="no-bullets"> <!-- Add a class for styling -->
      <li><a href="https://twitter.com/canadiendragon1" target="_blank">Twitter</a></li>
      <li><a href="https://instagram.com/canadiendragon" target="_blank">Instagram</a></li>
      <li><a href="https://tiktok.com/@canadiendragon" target="_blank">Tiktok</a></li>
      <!-- Add more social media links as needed -->
    </ul>

    <!-- Contact Me Section -->
    <h3>Contact Me</h3>
    <p style="text-align: center;">If you have any questions or want to collaborate on a gaming project, feel free to contact me</p>
    <ul class="no-bullets"> <!-- Add a class for styling -->
      <li>Email: skullgamingg31@gmail.com</li>
      <li><a href="https://twitch.tv/canadiendragon" target="_blank">Twitch</a></li>
      <li><a href="https://twitter.com/canadiendragon1" target="_blank">Twitter</a></li>
      <li><a href="https://instagram.com/canadiendragon" target="_blank">Instagram</a></li>
      <li><a href="https://github.com/skullgaming31" target="_blank">Github</a></li>
    </ul>
  </div>
</template>

<style scoped>

.main {
  max-width: 100%;
  max-height: auto;
}
.no-bullets {
  list-style: none; /* Remove bullets */
  padding: 0; /* Remove padding */
}

.no-bullets li {
  margin: 0; /* Remove default margin */
}
</style>
