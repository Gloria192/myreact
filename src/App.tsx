import './App.css'
import { BusProvider } from './context/BusContext'
import { Dashboard } from './components/Dashboard'

function App() {
  const handleLogout = () => {
    // Logout handler for admin
  };

  return (
    <BusProvider>
      <Dashboard onLogout={handleLogout} />
    </BusProvider>
  )
}

export default App
