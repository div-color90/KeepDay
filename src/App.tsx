import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Performance } from './pages/Performance';
import { Calendar } from './pages/Calendar';
import { Subjects } from './pages/Subjects';
import { Teachers } from './pages/Teachers';
import { Organization } from './pages/Organization';
import { useTasks } from './hooks/useTasks';
import { usePomodoro } from './hooks/usePomodoro';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const {
    tasks,
    addTask,
    toggleComplete,
    toggleUrgent,
    deleteTask,
    incrementPomodoro,
  } = useTasks();

  const {
    timeLeft,
    isActive,
    isPaused,
    isFocusMode,
    focusTime,
    breakTime,
    totalPomodoros,
    totalFocusTime,
    setFocusTime,
    setBreakTime,
    start,
    pause,
    resume,
    reset,
    skip,
    formatTime,
  } = usePomodoro();

  useEffect(() => {
    if (isFocusMode) {
      document.title = `${formatTime(timeLeft)} - KeepDay`;
    } else {
      document.title = 'KeepDay - Pomodoro & Study Log';
    }
  }, [timeLeft, isFocusMode, formatTime]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            tasks={tasks}
            timeLeft={timeLeft}
            isActive={isActive}
            isPaused={isPaused}
            isFocusMode={isFocusMode}
            focusTime={focusTime}
            breakTime={breakTime}
            formatTime={formatTime}
            onStart={start}
            onPause={pause}
            onResume={resume}
            onReset={reset}
            onSkip={skip}
            onFocusTimeChange={setFocusTime}
            onBreakTimeChange={setBreakTime}
          />
        );
      case 'tasks':
        return (
          <Tasks
            tasks={tasks}
            onAddTask={addTask}
            onToggleComplete={toggleComplete}
            onToggleUrgent={toggleUrgent}
            onDeleteTask={deleteTask}
          />
        );
      case 'performance':
        return (
          <Performance
            tasks={tasks}
            totalPomodoros={totalPomodoros}
            totalFocusTime={totalFocusTime}
          />
        );
      case 'calendar':
        return <Calendar />;
      case 'subjects':
        return <Subjects />;
      case 'teachers':
        return <Teachers />;
      case 'organization':
        return (
          <Organization
            onStartPomodoro={start}
            focusMinutes={focusTime}
            breakMinutes={breakTime}
            pomodoroState={{
              timeLeft,
              isActive,
              isPaused,
              isFocusMode,
              formatTime,
              start,
              pause,
              resume,
              reset,
              skip,
            }}
          />
        );
      default:
        return (
          <Dashboard
            tasks={tasks}
            timeLeft={timeLeft}
            isActive={isActive}
            isPaused={isPaused}
            isFocusMode={isFocusMode}
            focusTime={focusTime}
            breakTime={breakTime}
            formatTime={formatTime}
            onStart={start}
            onPause={pause}
            onResume={resume}
            onReset={reset}
            onSkip={skip}
            onFocusTimeChange={setFocusTime}
            onBreakTimeChange={setBreakTime}
          />
        );
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
