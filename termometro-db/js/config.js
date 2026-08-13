// El código pide el valor por su nombre; el valor vive en el .env.
// Con Vite, todo lo que empiece por VITE_ llega en import.meta.env.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;