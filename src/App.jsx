import {
  Routes,
  Route,
  Navigate
} from 'react-router';

import { useAuth } from './components/AuthContext';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Checking Authentication...</p>;
  }

  return (
    <Routes>
      <Route path='/' element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />

      <Route path='/login' element={
        user ? <Navigate to='/dashboard' replace /> : <Login />
      } />

      <Route path='./register' element={
        user ? <Navigate to='/dashboard' replace /> : <Register />
      } />

      <Route path="/dashboard" element={
        user ? <Dashboard /> : <Navigate to="/login" replace />
      } />

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}

export default App;
