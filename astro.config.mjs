// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages sirve el sitio bajo /portfolio mientras el repo se llame así.
// Si algún día mueves esto a un repo usuario (davidgcalles.github.io) o a
// dominio propio, pon base: '/'.
export default defineConfig({
  site: 'https://davidgcalles.github.io',
  base: '/portfolio',
});
