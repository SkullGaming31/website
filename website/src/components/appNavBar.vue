<script lang="ts">
export default {
  name: 'appNavBar' // Ensure the component name is PascalCase
};
</script>

<template>
<nav class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/streams">Streams</RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
        <RouterLink to="/clips">Clips</RouterLink>
        <RouterLink to="/faq">FAQ</RouterLink>
      </nav>
</template>

<style scoped>
/* Navigation styles */
.nav-links {
  background-color: #444;
  padding: 0.5em 0;
  text-align: center;
}

.nav-links a {
  color: #fff;
  text-decoration: none;
  margin: 0 1em;
}

.nav-links a:hover {
  text-decoration: underline;
}
</style>