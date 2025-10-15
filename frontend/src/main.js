import { AddHabitDialog } from "../ui/AddHabitDialog";
import { HabitsHitoryDialog } from "../ui/HabitsHitoryDialog";
import { TodayHabits } from "../ui/TodayHabits";
import "./style.css";

const todayHabits = TodayHabits.getInstance();
todayHabits.init();

const addHabitDialog = AddHabitDialog.getInstance();
addHabitDialog.init();

const habitHisotyDialog = HabitsHitoryDialog.getInstance();
habitHisotyDialog.init();
