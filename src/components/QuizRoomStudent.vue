<template>

  <div class="col container">
    <div class="col">
      <h3>Hello, student {{ username }}</h3>
      <h2>Welcome to {{ room }} <br /></h2>
    </div>

    <div class="col student-tab">
      <div class="current-question" v-if="currentQuestion !== null">
        <div class="question">{{ currentQuestion.question }}</div>
        <ul class="option">
          <li style="text-align: start;" v-for="each in currentQuestion.option" :key="each">{{ each }}</li>
        </ul>
		<button class="btn" @click="submitQuestion(username, currentQuestion)">Submit</button>
      </div>

      <h3 style="margin: auto" v-else>Waiting for live question</h3>
    </div>
      
  </div>

</template>

<script>
import Pusher from "pusher-js";
export default {
  name: "quiz-room",
  data() {
    return {
      roomId: '',
      roomName: this.room,
      studentId: 'uhsuyfs',
      studentName: this.username,
      currentQuestion: null,
      responses: [],
    };
  },
  props: {
    username: String,
    room: String,
    role: String,
  },
  methods: {
    subscribe() {
        const pusher = new Pusher(process.env.VUE_APP_KEY, {
            cluster: process.env.VUE_APP_CLUSTER,
            authEndpoint: `http://localhost:5000/pusher/auth/${this.username}`,
        })

        this.channel = pusher.subscribe(`private-${this.room}`)

        this.channel.bind("client-send-question", (q) => {
            this.currentQuestion = q
        })

        this.channel.bind("client-teacher-joined", m=>{
            console.log("teacher", m.username, " joined the quiz room")
            this.channel.trigger("client-student-joined", {username: this.username, userId: this.studentId})
        })

        this.channel.bind("client-teacher-left", m=>{
            console.log("teacher", m.username, " left the quiz room")
        })
        
        
    },
    unsubscribe() {
        this.channel.trigger("client-student-left", { username: this.username, userId: this.studentId })
        this.channel.unsubscribe(`private-${this.room}`);
    },
    submitQuestion(username, currentQuestion) {
        var b = this.channel.trigger("client-submit-question", {username: username, userId: this.studentId, question: currentQuestion})
        console.log("b", b)
        this.currentQuestion=null
    }
  },
  created() {
    this.subscribe()
    window.addEventListener('beforeunload', this.unsubscribe)
  },
  mounted() {
    console.log(this.channel)
    var a = this.channel.trigger("client-student-joined", {userId: this.studentId})
    console.log("a", a)
  },
  beforeUnmount() {
    this.unsubscribe();
  },
};
</script>

<style scoped>
h3 {
  margin: 2px;
}
h2 {
  margin: 2px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: block;
  margin: 2px;
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
  min-height: 90vh;
  margin: auto 5%;
  box-shadow: 2px 2px 2px 2px rgb(243, 82, 82);
}
.student-tab {
  margin: auto;
  min-width: 70vw;
  min-height: 40vh;
  box-shadow: -2px -2px #7878ec;
  justify-content: center;
  align-items: start;
}
.current-question {
  min-width: 80%;
  min-height: 210px;
  box-shadow: -2px -2px rgb(227, 68, 227);
  justify-content: center;
  align-items: center;
}
.current-question > * {
  margin: auto;
}
.question {
    text-align: start;
    margin: 0 15px;
}
.option {
    margin-left: 15px;
}
.btn {
  margin: 0.2%;
  padding: 0.4%;
  background-color: #42b983;
  border: none;
  border-radius: 3%;
  min-width: 15%;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.2rem;
}
</style>
