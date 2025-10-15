import { addHabit } from "../src/api/habits-api";
import { TodayHabits } from "./TodayHabits";

export class AddHabitDialog {
  static instance;
  constructor() {
    if (AddHabitDialog.instance) {
      throw new Error("Use AddHabitDialog.getInstance() instead");
    }
  }

  static getInstance() {
    if (!AddHabitDialog.instance) {
      AddHabitDialog.instance = new AddHabitDialog();
    }
    return AddHabitDialog.instance;
  }
  _open = false;
  init() {
    this.trigger = document.querySelector("#add-new-habit");
    this.dialog = document.querySelector("#add-habit-dialog");
    this.form = document.querySelector("#add-habit-form");

    this.trigger.addEventListener("click", () => {
      this.open = true;
    });

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit(e);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (this.open === false) return;
      this.open = false;
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const title = String(new FormData(form).get("title") || "").trim();
    if (!title) {
      alert("Le titre est requis");
      return;
    }
    try {
      await addHabit(title);
      await TodayHabits.getInstance().refresh();
      this.open = false;
      form.reset();
    } catch (err) {
      alert(err?.message || "Failed to create habit");
    }
  }

  get open() {
    return this._open;
  }

  set open(newOpen) {
    this._open = newOpen;

    if (newOpen) {
      this.dialog.setAttribute("open", "");
    } else {
      this.dialog.removeAttribute("open");
    }
  }
}
