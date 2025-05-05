// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import pagefind from 'astro-pagefind';


// https://astro.build/config
export default defineConfig({
    vite: {
      plugins: [tailwindcss(), pagefind()],
    },
  });
