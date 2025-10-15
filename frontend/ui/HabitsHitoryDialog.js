import { getAllHabits } from "../src/api/habits-api";

export class HabitsHitoryDialog {
  static instance;
  constructor() {
    if (HabitsHitoryDialog.instance) {
      throw new Error("Use HabitsHitoryDialog.getInstance() instead");
    }
  }

  static getInstance() {
    if (!HabitsHitoryDialog.instance) {
      HabitsHitoryDialog.instance = new HabitsHitoryDialog();
    }
    return HabitsHitoryDialog.instance;
  }
  _open = false;
  init() {
    this.trigger = document.querySelector("#open-history");
    this.dialog = document.querySelector("#habits-history-dialog");
    this.tableWrapper = document.querySelector("#table-wrapper");

    this.trigger.addEventListener("click", () => {
      this.open = true;
    });

    window.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (this.open === false) return;
      this.open = false;
    });
  }

  get open() {
    return this._open;
  }

  set open(newOpen) {
    this._open = newOpen;

    if (newOpen) {
      this.dialog.setAttribute("open", "");
      this.render();
    } else {
      this.dialog.removeAttribute("open");
    }
  }

  async render() {
    const habits = await getAllHabits();
    const lowestDate = getLowestDate(habits);
    const dates = getDatesRange(lowestDate);
    const table = document.createElement("table");

    table.appendChild(createTableHeader(dates));

    createTableRows(habits, dates).forEach((row) => table.appendChild(row));

    this.tableWrapper.innerHTML = "";
    this.tableWrapper.appendChild(table);
  }
}

const createTableRows = (habits, dates) => {
  const rows = [];

  return habits.map((habit) => {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.textContent = habit.title;
    row.appendChild(cell);

    dates.forEach((date) => {
      const dateCell = document.createElement("td");
      const doneDay = habit.daysDone[date];
      dateCell.textContent = doneDay ? "🟩" : "❌";
      row.appendChild(dateCell);
    });
    return row;
  });
};

const createTableHeader = (dates) => {
  const headerRow = document.createElement("tr");
  const headerCeil = document.createElement("th");
  headerCeil.textContent = "Habit";
  headerRow.appendChild(headerCeil);

  dates.forEach((date) => {
    const dateCeil = document.createElement("th");
    dateCeil.textContent = date;
    headerRow.appendChild(dateCeil);
  });

  return headerRow;
};

const getLowestDate = (habits) => {
  return habits
    .reduce((acc, habits) => {
      return [...acc, ...Object.keys(habits.daysDone)];
    }, [])
    .map((date) => new Date(date))
    .sort((a, b) => a - b)[0];
};

const getDatesRange = (lowestDate) => {
  const diff = Math.ceil((new Date() - lowestDate) / (1000 * 60 * 60 * 24));
  return Array.from({ length: diff }).map((_, index) => {
    const date = new Date(lowestDate);
    date.setDate(date.getDate() + index);
    return date.toISOString().split("T")[0];
  });
};
