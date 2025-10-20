// Minimal shim — re-export the compiled handler from the route file.
// Vercel ESM builds require explicit .js extensions in relative imports.
export { default } from './auth/route.js';
