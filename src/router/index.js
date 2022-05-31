import { createWebHistory, createRouter } from "vue-router"
import HomeComponent from "../components/HomeComponent"
import QuizRoom from "../components/QuizRoom"
import QuizRoomStudent from "../components/QuizRoomStudent"

const routes = [
  {
    path: "/",
    name: "Home-component",
    component: HomeComponent,
  },
  {
    path: "/quiz-room/teacher/:room",
    name: "quiz-room",
    component: QuizRoom,
    props: true
  },
  {
    path: "/quiz-room/student/:room",
    name: "quiz-room-student",
    component: QuizRoomStudent,
    props: true
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;