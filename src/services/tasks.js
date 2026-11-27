import { supabase } from './supabase';

export async function createTask(title, description, priority) {
    const { data, error } = await supabase
        .from('tasks')
        .insert({
            title,
            description,
            priority
        })
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function getTasks() {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', {
            ascending: false
        })

    if (error) throw error;

    return data;
}

export async function updateTasks() {
    const { data, error } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', taskId)
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function deleteTasks(taskId) {
    const { data, error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

    if (error) throw error;
}
