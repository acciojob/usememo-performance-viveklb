
import React, { memo, useCallback, useMemo, useState } from "react";
import './../styles/App.css';

const FILTERS = ["All", "Active", "Completed"];

const createInitialTasks = () =>
  Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    title: [
      "Review the project brief",
      "Organize the workspace",
      "Prepare notes for the team",
      "Update the weekly priorities",
      "Reply to the open questions",
      "Check the latest design feedback",
      "Plan the next work session",
      "Sort the shared documents",
    ][index % 8],
    completed: index < 25,
  }));

const filterTasks = (tasks, filter) => {
  if (filter === "Active") return tasks.filter((task) => !task.completed);
  if (filter === "Completed") return tasks.filter((task) => task.completed);
  return tasks;
};

const simulateExpensiveRender = (seed) => {
  let result = seed;
  for (let iteration = 0; iteration < 50000; iteration += 1) {
    result = (result * 31 + iteration) % 1000003;
  }
  return result;
};

const TaskList = memo(({ tasks, onToggle }) => (
  <ul className="task-list">
    {tasks.map((task) => {
      const workload = simulateExpensiveRender(task.id);

      return (
        <li className={`task-row${task.completed ? " is-completed" : ""}`} key={task.id}>
          <label className="task-label">
            <input
              aria-label={`${task.completed ? "Mark active" : "Mark completed"}: ${task.title}`}
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              type="checkbox"
            />
            <span className="task-check" aria-hidden="true">
              <svg viewBox="0 0 16 16" focusable="false">
                <path d="m3.5 8.2 3 3 6-6.4" />
              </svg>
            </span>
            <span className="task-title">{task.title}</span>
          </label>
          <span className="task-status" data-workload={workload}>
            {task.completed ? "Completed" : "In progress"}
          </span>
        </li>
      );
    })}
  </ul>
));

const App = () => {
  const [tasks, setTasks] = useState(createInitialTasks);
  const [activeFilter, setActiveFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  const visibleTasks = useMemo(
    () => filterTasks(tasks, activeFilter),
    [tasks, activeFilter]
  );
  const activeCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.length - activeCount;

  const toggleTask = useCallback((taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  return (
    <div className={`app-shell${darkMode ? " dark-mode" : ""}`}>
      <main className="todo-app">
        <header className="app-header">
          <div className="brand-mark" aria-hidden="true">T</div>
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setDarkMode((currentMode) => !currentMode)}
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
            title={`Switch to ${darkMode ? "light" : "dark"} mode`}
          >
            {darkMode ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.6 8.6 0 1 0 20.2 15.1Z" />
              </svg>
            )}
          </button>
        </header>

        <section className="list-heading" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">YOUR SPACE, IN ORDER</p>
            <h1 id="page-title">The little things<br />get done.</h1>
          </div>
          <div className="task-total" aria-label={`${tasks.length} total tasks`}>
            <span className="total-number">{tasks.length}</span>
            <span className="total-label">tasks<br />in your list</span>
          </div>
        </section>

        <section className="task-section" aria-label="Your tasks">
          <div className="list-toolbar">
            <div className="filter-tabs" role="tablist" aria-label="Filter tasks">
              {FILTERS.map((filter) => {
                const count = filter === "All"
                  ? tasks.length
                  : filter === "Active"
                    ? activeCount
                    : completedCount;

                return (
                  <button
                    aria-selected={activeFilter === filter}
                    className={`filter-tab${activeFilter === filter ? " is-selected" : ""}`}
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    role="tab"
                    type="button"
                  >
                    {filter}<span className="filter-count">{count}</span>
                  </button>
                );
              })}
            </div>
            <span className="list-caption">
              {activeFilter === "All" ? "EVERYTHING, IN ONE PLACE" : `${activeFilter.toUpperCase()} TASKS`}
            </span>
          </div>

          <TaskList tasks={visibleTasks} onToggle={toggleTask} />

          <footer className="list-footer">
            <span><span className="footer-dot" /> {activeCount} things still in motion</span>
            <span>{completedCount} done</span>
          </footer>
        </section>
        <p className="page-note">A little progress is still progress.</p>
      </main>
    </div>
  )
}

export default App
