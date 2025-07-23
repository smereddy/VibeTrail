import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import CreatePlan from './pages/CreatePlan';
import QlooAPIExplorer from './pages/QlooAPIExplorer';
import Results from './pages/Results';
import CulturalEcosystem from './pages/CulturalEcosystem';
import Plan from './pages/Plan';
import Export from './pages/Export';
import Weekend from './pages/Weekend';
import Insights from './pages/Insights';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/create-plan" element={<Layout><CreatePlan /></Layout>} />
            <Route path="/qloo-explorer" element={<Layout><QlooAPIExplorer /></Layout>} />
            <Route path="/results" element={<Layout><Results /></Layout>} />
            <Route path="/cultural-ecosystem" element={<Layout><CulturalEcosystem /></Layout>} />
            <Route path="/plan" element={<Layout><Plan /></Layout>} />
            <Route path="/export" element={<Layout><Export /></Layout>} />
            <Route path="/weekend" element={<Layout><Weekend /></Layout>} />
            <Route path="/insights" element={<Layout><Insights /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
            <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
            <Route path="/terms" element={<Layout><Terms /></Layout>} />
          </Routes>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;