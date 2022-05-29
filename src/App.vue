<template>
  <router-view :username="username" :role="role" />
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      username: "Anonymous",
      role: "student"
    };
  },
  created() {
    //prompt for username
    const currentUsername = window.prompt("Enter username: ", "Anonymous");
    const currentRole = window.prompt("Enter your role: ", "student")
    this.username = currentUsername;
    this.role = currentRole
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>