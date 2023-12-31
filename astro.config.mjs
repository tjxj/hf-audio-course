import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://athenaos.org/',
  integrations: [
    starlight({
      title: 'Hugging Face',
      defaultLocale: 'docs',
      description: 'Athena OS, a new pentesting/cybersecurity linux distribution.',
      logo: {
        light: '/src/assets/athena-light-logo.svg',
        dark: '/src/assets/athena-dark-logo.svg',
      },
      customCss:['./src/fonts/font-face.css',],
      // customCss: process.env.NO_GRADIENTS ?  [	'./src/styles/_global.css'] : ['./src/styles/landing.css', 	'./src/styles/_global.css'],
      social: {
        github: 'https://github.com/tjxj/hf-audio-course',
        youtube: 'https://www.youtube.com/@Changbeihai8759',
        twitter: 'https://twitter.com/Changbeihai',
      },
      editLink: {
        baseUrl: 'https://github.com/tjxj/hf-audio-course',
      },
      lastUpdated: true,
      sidebar: [
        {
          label: 'chapter0',
          autogenerate: { directory: 'chapter0' },
        },
        {
          label: 'chapter1',
          autogenerate: { directory: 'chapter1' },
        },
        {
          label: 'chapter2',
          badge: 'New',
          autogenerate: { directory: 'chapter2' },
        },
      ],
    }),
  ],

  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
