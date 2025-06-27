# 🗓️ Custom Event Calendar

A dynamic and interactive event calendar built with [React](https://reactjs.org/), designed to let users manage their schedule efficiently with features like event creation, editing, deletion, recurring events, drag-and-drop rescheduling, and more.

---

## 🚀 Features

### 📅 Calendar View
- Monthly view with current day highlighted.
- Navigation between months.

### ✍️ Event Management
- **Add Events**: Click on a date to open a form with fields for title, date & time, description, recurrence, and optional color/category.
- **Edit Events**: Update event details by clicking on any event.
- **Delete Events**: Remove events from the calendar or within the event form.

### 🔁 Recurring Events
- Support for:
  - Daily
  - Weekly (specific days)
  - Monthly (e.g., every 15th)
  - Custom intervals (e.g., every 2 weeks)
- Display of all recurring instances in the calendar.

### 🖱️ Drag-and-Drop Rescheduling
- Move events between days using drag-and-drop.
- Handle event conflicts and overlapping gracefully.

### ⚠️ Conflict Detection
- Prevent or warn users of overlapping or conflicting events.

### 🔍 Optional Enhancements
- **Search and Filter**: Filter events by category or search by title/description.
- **Responsive Design**: Mobile-friendly layout with adaptive views.
- **Persistent Storage**: Events are stored using Local Storage or IndexedDB.

---

## 🛠️ Tech Stack

- **Framework**: React (or Vue.js / Angular if specified)
- **State Management**: React Context API / Redux / Pinia / Vuex (as applicable)
- **Date Handling**: [`date-fns`](https://date-fns.org/) or [`Moment.js`](https://momentjs.com/)
- **Drag and Drop**: [`React DnD`](https://react-dnd.github.io/react-dnd/about) or [`interact.js`](https://interactjs.io/)
- **Styling**: CSS Modules / Tailwind CSS / Styled Components / SCSS

---

## 📦 Installation & Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/your-username/event-calendar.git
cd event-calendar
