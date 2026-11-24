import { useEffect, useState } from 'react';

import { registerUser, loginUser, logoutUser, } from './services/auth.js'

import { supabase } from './services/supabase.js';

function App() {
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Listen for authentication changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Handle registration and login
  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      if (isRegistering) {
        const data = await registerUser(email, password);
        if (!data.session) {
          setMessage("Check your email to confirm your account!");
        } else {
          setMessage("Registration succesfull!");
        }
      } else {
        await loginUser(email, password);
        setMessage("Login succesfull");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Handle logout
  async function handleLogout() {
    try {
      await logoutUser();
      setMessage("Loged out succesfully");
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Authenticated user view
  if (user) {
    return (
      <main>
        <h1>Task Manager</h1>
        <h2>Welcome!</h2>
        <p>Logged in as: {user.email}</p>
        <button onClick={handleLogout}>Logout</button>
        <p>{message}</p>
      </main>
    );
  }

  // Authentication form
  return (
    <main>
      <h1>Task Manager</h1>
      <h2>{isRegistering ? "Create Account" : "Login"}</h2>


      <form onSubmit={handleSubmit}>
        <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        <button type='submit' disabled={loading}>
          {loading
            ? "Please wait.."
            : isRegistering ? "Register" : "Login"
          }
        </button>
      </form>

      <button onClick={() => {
        setIsRegistering(!isRegistering);
        setMessage("");
      }}
      >
        {isRegistering
          ? "Already have an account? Login"
          : "Create an Account"
        }
      </button>
      <p>{message}</p>
    </main>
  )
}

export default App;
