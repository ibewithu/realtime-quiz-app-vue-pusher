<template>
  <div class="col container">
    <h3>Hi, {{ username }}</h3>
    <br />
    <h3>Welcome {{role}} </h3>
    <div class="col room-box">
      <h3 style="text-decoration: underline;">Available Quiz Rooms</h3>
      <div class="rooms row" v-if="role==='teacher'">
        <router-link :to="`/quiz-room/teacher/${room}`" class="btn" v-for="room in publicRooms" :key="room">{{ room }} </router-link>
      </div>
      <div class="rooms row" v-else>
        <router-link :to="`/quiz-room/student/${room}`" class="btn" v-for="room in publicRooms" :key="room">{{ room }} </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home-component",
  data() {
    return {
      publicRooms: [ "quiz-room-1", "quiz-room-2", "quiz-room-3", ],
    };
  },
  props: {
    username: String,
    role: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0;
}
a {
  color: black;
}
.row {
  display: flex;
  flex-direction: row;
  /* border: 2px solid red; */
}
.col {
  display: flex;
  flex-direction: column;
  /* border: 2px solid red; */
}
.container {
  min-height: 80vh;
  margin: auto;
}
.room-box {
  margin: 2%;
  padding: 1%;
  min-height: 60vh;
  border: 2px #42b983;
  box-shadow: 2px 2px 2px 2px #42b983;
}
.rooms {
  margin: 2%;
  padding: 2%;
  justify-content: space-around;
  align-items: center;
}
.btn {
  margin: 2%;
  padding: 2%;
  background-color: #42b983;
  border: none;
  border-radius: 3%;
  min-width: 15%;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.2rem;
}
</style>