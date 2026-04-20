import './App.css'
import { Dashboard } from './components/Dashboard'

function App() {
  const handleLogout = () => {
    // Handled by Dashboard
  };

  return <Dashboard onLogout={handleLogout} />
}

export default App