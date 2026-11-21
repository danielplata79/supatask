import { useEffect, useState } from 'React';

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

    return () => subscription.unsusbscribe();
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
          setMessage("Check your email to confirm your account.");
        } else {
          await loginUser(email, password);
          setMessage("Login succesfull!");
        }
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    }
  }
}
