<template>
  <section id="faq" class="content bordered-section">
    <h1>Frequently Asked Questions</h1>
    <ul>
      <li v-for="(item, index) in faq" :key="index" class="faq-item">
        <strong><u>{{ item.question }}</u></strong>
        <ul v-if="Array.isArray(item.answer)" class="answer-list">
          <li v-for="(subitem, subindex) in item.answer" :key="subindex">
            <span v-html="renderAnswer(subitem)"></span>
          </li>
        </ul>
        <span v-else class="answer"><strong>{{ item.answer }}</strong></span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Frequently Asked Questions
const faq = ref([
  {
    question: "Where can I find CanadienDragon on social media?",
    answer: [
      { platform: "Twitter", link: "https://twitter.com/canadiendragon1", color: "#1DA1F2" },
      { platform: "Discord", link: "https://discord.com/invite/6TGV75sDjW", color: "#7289DA" },
      { platform: "TikTok", link: "https://tiktok.com/@canadiendragon", color: "#000000" },
      { platform: "instagram", link: "https://instagram.com/canadiendragon", color: "#000000" },
      { platform: "facebook", link: "https://facebook.com/canadiendragon", color: "#000000" },
      { platform: "github", link: "https://github.com/skullgaming31", color: '#000000' }
    ]
  },
  {
    question: "How can I join CanadienDragon's Discord community?",
    answer: "You can join CanadienDragon's Discord server by following the discord link in the first FAQ"
  },
  {
    question: "Who is OpenDevBot on CanadienDragons Twitch Chat",
    answer: "It is a twitch chat bot created by CanadienDragon using Typescript with the help from some libraries. @twurple | Discord.js"
  },
  {
    question: "Is the source code for OpenDevBot Public?",
    answer: "Yes you can view all OpenDevBots Source code on Github, Repo Name: opendevbot"
  },
]);

interface AnswerObject {
  platform: string;
  link: string;
  color: string;
}

const renderAnswer = (answer: string | AnswerObject) => {
  if (typeof answer === 'string') {
    // Convert plain text to HTML and apply styling
    return `<span class="clickable-link">${answer.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank">$1</a>'
    )}</span>`;
  } else {
    // Return platform-specific links
    return answer.platform ? `<a href="${answer.link}" target="_blank" style="color: ${answer.color}; text-decoration: underline;">${answer.platform}</a>` : '';
  }
}

computed(() => {
  return faq.value.map(item => {
    if (Array.isArray(item.answer)) {
      return item.answer.map(subitem => renderAnswer(subitem)).join('');
    } else {
      return item.answer;
    }
  });
});
</script>

<style scoped>
/* Section styles */
.bordered-section {
  border: 5px solid white;
  padding: 1em;
  background-color: #f9f9f9;
}

/* List styles */
#faq ul {
  list-style: none;
  padding: 0;
}

/* FAQ item styles */
.faq-item {
  text-align: center; /* Center-align the FAQ items */
}

/* Answer list styles */
.answer-list {
  margin-left: 0;
}

/* Answer styles */
.answer {
  display: block;
  margin-top: 0.5em;
  font-weight: bold; /* Make the answer bold */
}

/* Clickable link styles */
.clickable-link {
  text-decoration: underline; /* Underline the links */
}
</style>