<script lang="ts">
export default {
  name: 'AppFooter' // Ensure the component name is PascalCase
};
</script>

<template>
  <footer>
    <p>&copy; 2024 CanadienDragon</p>
    <ul>
      <li><a href="https://twitter.com/canadiendragon1" target="_blank">Twitter</a></li>
      <li><a href="https://instagram.com/canadiendragon" target="_blank">Instagram</a></li>
      <li><a href="https://discord.com/invite/6TGV75sDjW" target="_blank">Discord</a></li>
      <li><a href="https://tiktok.com/@canadiendragon" target="_blank">TikTok</a></li>
      <li><a href="https://facebook.com/canadiendragon" target="_blank">Facebook</a></li>
    </ul>
  </footer>
</template>

<style scoped>
/* Footer styles */
footer {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 1em 0;
}

footer ul {
  list-style: none;
  padding: 0;
}

footer li {
  display: inline;
  margin: 0 1em;
}

footer a {
  color: #fff;
  text-decoration: none;
}

footer a:hover {
  text-decoration: underline;
}
</style>