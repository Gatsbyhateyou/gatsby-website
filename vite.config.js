import { resolve } from 'path';

export default {
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        diary: resolve(__dirname, 'diary.html'),
        galaxy: resolve(__dirname, 'Galaxy.html'),
        skills: resolve(__dirname, 'skills.html'),
        styleGallery: resolve(__dirname, 'style-gallery.html'),
      },
    },
  },
};
