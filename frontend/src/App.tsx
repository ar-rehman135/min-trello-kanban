import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import KanbanBoard from './pages/kanban';
import WelcomeScreen from './pages/welcome';

import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/kanban" element={<KanbanBoard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
