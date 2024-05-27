<template>
  <section id="contact" class="content bordered-section">
    <h1>Contact Me</h1>
    <!-- <form ref="contactForm">
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" required>
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" required>
      </div>
      <div>
        <label for="message">Message:</label>
        <textarea id="message" required></textarea>
      </div>
      <button type="submit" class="submit-button">Send</button>
    </form><br /> -->
    <p>You can reach me on social media as well:</p>
    <ul>
      <li>Twitter: <a href="https://twitter.com/canadiendragon1" target="_blank" style="color: #1DA1F2;">CanadienDragon</a></li>
      <li>Discord: <a href="https://discord.com/users/canadiendragon" target="_blank" style="color: #7289DA;">CanadienDragon</a></li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const contactForm = ref<HTMLFormElement | null>(null);

// JavaScript/TypeScript for form submission
contactForm.value?.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent default form submission

  // Get form data
  // const name = contactForm.value?.elements.namedItem('name') as HTMLInputElement | null;
  // const email = contactForm.value?.elements.namedItem('email') as HTMLInputElement | null;
  // const message = contactForm.value?.elements.namedItem('message') as HTMLInputElement | null;

  // Validate form data
  // if (!name?.value || !email?.value || !message?.value) {
  //   alert('Please fill in all fields.');
  //   return;
  // }

  // Send email (this is just a mock implementation)
  // sendEmail(name.value, email.value, message.value);
});

// function sendEmail(name: string, email: string, message: string) {
//   // This is a mock function to simulate sending an email
//   alert('Email sent successfully!');
//   resetForm();
// }

// function resetForm() {
//   // Reset form fields
//   const name = contactForm.value?.elements.namedItem('name') as HTMLInputElement | null;
//   const email = contactForm.value?.elements.namedItem('email') as HTMLInputElement | null;
//   const message = contactForm.value?.elements.namedItem('message') as HTMLInputElement | null;
  
//   if (name && email && message) {
//     name.value = '';
//     email.value = '';
//     message.value = '';
//   }
// }
</script>

<style scoped>
/* Section styles */
.bordered-section {
  border: 5px solid white;
  padding: 1em;
  background-color: #f9f9f9;
}

#contact {
  margin: 2em 0;
}

.content {
  margin: 1em 0;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 0.5em 0;
}

a {
  color: inherit; /* Inherit color from parent element */
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Specific colors for links */
a[target="_blank"][style*="color: #1DA1F2;"] {
  color: #1DA1F2;
}

a[target="_blank"][style*="color: #7289DA;"] {
  color: #7289DA;
}

/* Button styles */
.submit-button {
  background-color: #ccc; /* Grey background */
  color: #fff; /* White text */
  border: none;
  padding: 0.5em 1em;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #999; /* Darker grey on hover */
}
</style>