// services/userService.ts
import supabase from '../../utils/supabaseClient';

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

export const fetchUsers = async (page: number, perPage: number) => {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
    .range(from, to);

  if (error) {
    throw error;
  }

  return { data, count };
};