<template>

  <div class="col container">
    <div class="col">
      <h3>Hello, teacher {{ username }}</h3>
      <h2>Welcome to {{ room }} <br /></h2>
      <h2>Students online: {{ onlineUsersCount }}</h2>
    </div>

    <div class="col teacher-tab">
      <ul>
        <li class="each-question" v-for="item in questions" :key="item.question">
          <div class="question">{{ item.question }}</div>
          <ul class="option">
            <li style="text-align: start;" v-for="each in item.option" :key="each">{{ each }}</li>
          </ul>
          <button class="btn" @click="sendQuestion(item)">Send</button>
        </li>
      </ul>
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
      teacherId: 'ahiuaeh',
      teacherName: this.username,
      quizId: '',
      quizTitle: '',
      currentQuestion: null,
      questions: [
        {
          questionId: '',
          questionImage: null,
          correctOption: '',
          isPlayed: false,
          question: "Question 1",                                            //alternative for image
          option: ["option 1", "option 2", "option 3", "option 4"],          //alternative for image
        },
        {
          questionId: '',
          questionImage: null,
          correctOption: '',
          isPlayed: false,
          question: "Question 2",                                            //alternative for image
          option: ["option 1", "option 2", "option 3", "option 4"],          //alternative for image
        },
      ],
      students: [],
      channel: null,
      onlineUsersCount: 0,
      onlineUsers: [],
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
      this.channel.bind("client-student-joined", (m) => {
        console.log("std join", m)
        const idx = this.students.findIndex(x=>x.studentId===m.studentId)
        if(idx === -1) {
          this.students.push({
            studentId: m.studentId,
            studentName: m.studentName,
            joined: true,
            responses: [],
          })
          this.onlineUsersCount++;
        }
        else {
          if(this.students[idx].joined === false) {
            this.onlineUsersCount++
          }
          this.students[idx].joined = true
        }
      })
      this.channel.bind("client-submit-question", (m) => {
        console.log(m.username, ' submitted: ', m.question)
      })
      this.channel.bind("client-student-left", (m) => {
        const idx = this.students.findIndex(x=>x.studentId===m.studentId)
        if(idx !== -1) {
          if(this.students[idx].joined ===true) {
            this.onlineUsersCount--;
          }
          this.students[idx].joined = false
        }
      })
    },
    unsubscribe() {
      this.channel.trigger("client-teacher-left", {username: this.username})
      this.channel.unsubscribe(`private-${this.room}`)
    },
    sendQuestion(payload) {
      this.channel.trigger("client-send-question", payload)
    },
  },
  created() {
    this.subscribe()
    setTimeout(() => {this.channel.trigger("client-teacher-joined", {username: this.username})
    }, 400)
    window.addEventListener('beforeunload', this.unsubscribe)
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
.teacher-tab {
  margin: auto;
  min-width: 70vw;
  min-height: 80vh;
  box-shadow: -2px -2px #7878ec;
}
.each-question {
  margin-top: 5px;
  padding-bottom: 5px;
  border-bottom: 2px solid rgb(22, 237, 22);
  border-radius: 5%;
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
