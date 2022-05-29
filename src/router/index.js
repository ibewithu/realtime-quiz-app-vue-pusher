import { createWebHistory, createRouter } from "vue-router"
import HomeComponent from "../components/HomeComponent"
import QuizRoom from "../components/QuizRoom"

const routes = [
  {
    path: "/",
    name: "Home-component",
    component: HomeComponent,
  },
  {
    path: "/quiz-room/:room",
    name: "quiz-room",
    component: QuizRoom,
    props: true
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;