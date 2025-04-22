import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Classrooms from './pages/Classrooms';
import Assignments from './pages/Assignments';
import Analytics from './pages/Analytics';
import AI from './pages/AI';
import Admin from './pages/Admin';

// CODEX-STYLE APP ENTRY
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Layout><Dashboard/></Layout>} />
        <Route path="/classrooms" element={<Layout><Classrooms/></Layout>} />
        <Route path="/assignments" element={<Layout><Assignments/></Layout>} />
        <Route path="/analytics" element={<Layout><Analytics/></Layout>} />
        <Route path="/ai" element={<Layout><AI/></Layout>} />
        {/* ADMIN PANEL: Accessible at LAN only (port 1488) - restrict via backend/proxy */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
