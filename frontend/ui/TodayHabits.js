import { getHabitsToday, updateHabitDone } from "../src/api/habits-api";
import { HabitSquare } from "./HabitSquare";

export class TodayHabits {
  static instance;
  constructor() {
    if (TodayHabits.instance) {
      throw new Error("Use TodayHabits.getInstance() instead");
    }
  }

  static getInstance() {
    if (!TodayHabits.instance) {
      TodayHabits.instance = new TodayHabits();
    }
    return TodayHabits.instance;
  }

  async init() {
    this.element = document.querySelector("#today-habits");
    console.log(this);
    this.refresh();
  }

  toggle = (event) => {
    const habitSquare = event.currentTarget;
    this.toggleDone(habitSquare.id, habitSquare.done);
  };
  async refresh() {
    try {
      this.todayHabits = await getHabitsToday();
      this.habitsSquare?.forEach((habitSquare) => {
        habitSquare.removeEventListener("toggle", this.toggle);
      });
      this.render();
    } catch {
      alert("impossible to get habits");
    }
  }

  async toggleDone(id, done) {
    try {
      await updateHabitDone(id, !done);
      if (!done && window.confetti) {
        window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.7 } });
      }
      this.refresh();
    } catch {
      alert("impossible to update habit");
    }
  }

  async render() {
    this.element.innerHTML = " ";
    this.habitsSquare = this.todayHabits.map((habit) => {
      const habitSquare = new HabitSquare(
        habit.id,
        habit.title,
        habit.isDoneToday
      );
      habitSquare.addEventListener("toggle", this.toggle);
      this.element.appendChild(habitSquare.element);
      return habitSquare;
    });
  }
}
