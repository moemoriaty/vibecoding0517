import React from 'react';
import Header from './components/Header';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import ColorPicker from './components/ColorPicker';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <aside className="left-panel">
          <Toolbar />
        </aside>
        <section className="canvas-section">
          <Canvas />
        </section>
        <aside className="right-panel">
          <ColorPicker />
        </aside>
      </main>
    </div>
  );
};

export default App;
