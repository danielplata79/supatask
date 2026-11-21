import { supabase } from "./supabase.js";

// Register a new user
export async function registerUser(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) throw error;

    return data;
}

export async function loginUser(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
}

// Logout
export async function logoutUser() {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
}

// Get current authenticated user
export async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;

    return data.user;
}
