<template>
  <!-- <div class="row"> -->
  <div class="col container">
    <div class="col">
      <h3>Hello, {{ username }}</h3>
      <h2>Welcome to {{ room }} <br /></h2>
      <h2 v-if="role === 'teacher'">Students online: {{ onlineUsersCount }}</h2>
    </div>

    <div v-if="role === 'teacher'" class="col teacher-tab">
      <ul>
        <li class="each-question" v-for="item in questions" :key="item.question">
          <div style="text-align: start; margin: 0 15px" class="question">{{ item.question }}</div>
          <ul class="option" style="margin-left: 15px">
            <li style="text-align: start;" v-for="each in item.option" :key="each">{{ each }}</li>
          </ul>
          <button class="btn" @click="sendQuestion(item)">Send</button>
        </li>
      </ul>
    </div>

    <div v-if="role === 'student'" class="col student-tab">
      <div class="current-question" v-if="currentQuestion !== null">
        <div style="text-align: start; margin: 0 15px" class="question">{{ currentQuestion.question }}</div>
        <ul class="option" style="margin-left: 15px">
          <li style="text-align: start;" v-for="each in currentQuestion.option" :key="each">{{ each }}</li>
        </ul>
				<button class="btn" @click="submitQuestion(username, currentQuestion)">Submit</button>
      </div>

      <h3 style="margin: auto" v-else>Waiting for live question</h3>
    </div>

    <!-- <div>
        <input type="text" v-model.lazy="message" placeholder="chat here...." />
        <button class="button-submit" @click="handleSubmit">Send</button>
      </div> -->
      
  </div>
  <!-- </div> -->
</template>

<script>
import Pusher from "pusher-js";
export default {
  name: "quiz-room",
  data() {
    return {
      roomId: '',
      roomName: '',
      teacherId: '',
      teacherName: this.username,
      quizId: '',
      quizTitle: '',
      currentQuestion: null,
      questions: [
        {
          questionId: '',
          questionImage: '',
          correctOption: '',
          isPlayed: false,
          question: "Question 1",                                            //alternative for image
          option: ["option 1", "option 2", "option 3", "option 4"],          //alternative for image
        },
        {
          questionId: '',
          questionImage: '',
          correctOption: '',
          isPlayed: false,
          question: "Question 2",                                            //alternative for image
          option: ["option 1", "option 2", "option 3", "option 4"],          //alternative for image
        },
      ],
      students: [
        {
          studentId: '',
          studentName: '',
          responses: [
            {
              questionId: '',
              selectedOption: '',
              attempted: false,
              status: false,
              score: 0,
            }
          ],
        }
      ],
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
        authEndpoint: `http://localhost:5000/pusher/auth/${this.role}/${this.username}`,
      })
      console.log(this.channel)

      this.channel = pusher.subscribe(`private-${this.room}`);

      // binding to client event
      this.role === "student" &&
        this.channel.bind("client-send-question", (q) => {
          console.log('question received', q)
          this.currentQuestion = q
        })

      //binding teacher to student submit question
      this.role === "teacher" &&
        this.channel.bind("client-submit-question", (m) => {
          console.log(m.username, ' submitted: ', m.question)
        });

      //binding teacher to student join
      this.role === "teacher" &&
        this.channel.bind("student-joined", (m) => {
          this.onlineUsersCount++;
          this.onlineUsers.push(m);
          console.log(m.username, ' joined')
          console.log('current students ', this.onlineUsers)
        });

      //binding teacher to student left
      this.role === "teacher" &&
        this.channel.bind("client-student-left", (m) => {
          this.onlineUsersCount--;
          this.onlineUsers.filter((each) => each.username !== m.username)
          console.log(m.username, ' left')
        });
    },
    unsubscribe() {
      this.role === "student" &&
        this.channel.trigger("client-student-left", { username: this.username })
      this.channel.unsubscribe(`private-${this.room}`);
    },
    sendQuestion(payload) {
      //triggering from client side
      var wasTriggered = this.channel.trigger("client-send-question", payload)
      console.log('send qustion triggered: ', wasTriggered)
      //things to do after sending
    },
		submitQuestion(username, currentQuestion) {
			var wasTriggered = this.channel.trigger("client-submit-question", {username: username, question: currentQuestion})
      console.log('submit question triggered: ', wasTriggered)
			this.currentQuestion=null
		}
  },
  created() {
    this.subscribe();
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
.student-tab {
  margin: auto;
  min-width: 70vw;
  min-height: 40vh;
  box-shadow: -2px -2px #7878ec;
  justify-content: center;
  align-items: start;
}
.teacher-tab {
  margin: auto;
  min-width: 70vw;
  min-height: 80vh;
  box-shadow: -2px -2px #7878ec;
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
.each-question {
  margin-top: 5px;
  padding-bottom: 5px;
  border-bottom: 2px solid rgb(22, 237, 22);
  border-radius: 5%;
}
</style>
