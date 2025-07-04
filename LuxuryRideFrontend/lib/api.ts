const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

if (!API_BASE) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE in .env.local");
}

export default API_BASE;
