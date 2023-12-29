import starlightPlugin from '@astrojs/starlight-tailwind';
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // 你喜欢的强调色。Indigo 是最接近 Starlight 默认的。
        accent: colors.indigo,
        // 你喜欢的灰色。Zinc 是最接近 Starlight 默认的。
        gray: colors.zinc,
      },
      fontFamily: {
		'cn-fontsource-lxgw-wen-kai-screen-r': ['LXGW WenKai Screen R'], 
      },
    },
  },
  plugins: [starlightPlugin()],
};