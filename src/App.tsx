import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Results from './pages/Results';
import Plan from './pages/Plan';
import Export from './pages/Export';
import Weekend from './pages/Weekend';
import Insights from './pages/Insights';
import About from './pages/About';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="results" element={<Results />} />
            <Route path="plan" element={<Plan />} />
            <Route path="export" element={<Export />} />
            <Route path="weekend" element={<Weekend />} />
            <Route path="insights" element={<Insights />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;