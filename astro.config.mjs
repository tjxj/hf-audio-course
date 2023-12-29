import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://athenaos.org/',
  integrations: [starlight({
    title: 'Athena OS',
    defaultLocale: 'docs',
    description: 'Athena OS, a new pentesting/cybersecurity linux distribution.',
    logo: {
      light: '/src/assets/athena-light-logo.svg',
      dark: '/src/assets/athena-dark-logo.svg'
    },
    customCss: process.env.NO_GRADIENTS ? [	'./src/styles/_global.css'] : ['./src/styles/landing.css', 	'./src/styles/_global.css'],
    social: {
      github: 'https://github.com/Athena-OS',
      instagram: 'https://www.instagram.com/athenaos_sec',
      discord: 'https://discord.gg/athena-os-977645785170714644'
    },
    editLink: {
      baseUrl: 'https://github.com/Athena-OS/athena-docs/tree/main/'
    },
    lastUpdated: true,
    sidebar: [{
      label: 'chapter0',
      autogenerate: {
        directory: 'chapter0'
      }
    }, {
      label: 'chapter1',
      autogenerate: {
        directory: 'chapter1'
      }
    }, {
      label: 'chapter2',
      badge: 'New',
      autogenerate: {
        directory: 'chapter2'
      }
    }, {
      label: 'chapter3',
      autogenerate: {
        directory: 'chapter3'
      }
    }, {
      label: 'chapter4',
      autogenerate: {
        directory: 'chapter4'
      }
    }, {
      label: 'chapter5',
      badge: 'New',
      autogenerate: {
        directory: 'chapter5'
      }
    }, {
      label: 'chapter6',
      autogenerate: {
        directory: 'chapter6'
      }
    }, {
      label: 'chapter7',
      autogenerate: {
        directory: 'chapter7'
      }
    }, {
      label: 'chapter8',
      badge: 'New',
      autogenerate: {
        directory: 'chapter8'
      }
    }]
  }), ],
  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  }
});