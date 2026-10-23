import { defineConfig, type DefaultTheme } from 'vitepress';
import {
  groupIconMdPlugin,
  groupIconVitePlugin
} from 'vitepress-plugin-group-icons';

import { fileURLToPath } from 'node:url';

import pkg from '../../package.json' with { type: 'json' };
import typedocSidebar from '../api/typedoc-sidebar.json' with { type: 'json' };

import darkTheme from './shiki/accessible-aa-dark-shiki.json' with { type: 'json' };
import lightTheme from './shiki/accessible-aa-light-shiki.json' with { type: 'json' };

const URL_SITE = 'https://phun-ky.net/angle/';
const URL_REPO = 'https://github.com/phun-ky/angle';
const TITLE = 'angle';
const DESCRIPTION =
  'A JavaScript function to calculate the angle between two coordinates';

export default defineConfig({
  base: '/angle/',
  lang: 'en-GB',
  title: TITLE,
  description: DESCRIPTION,
  head: [
    // head links aren't prefixed with base, so they carry /angle/
    [
      'link',
      { rel: 'icon', type: 'image/svg+xml', href: '/angle/favicon.svg' }
    ],
    ['meta', { property: 'og:url', content: URL_SITE }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: TITLE }],
    ['meta', { property: 'og:description', content: DESCRIPTION }],
    ['meta', { property: 'og:locale', content: 'en_GB' }]
  ],
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  themeConfig: {
    search: {
      provider: 'local'
    },
    editLink: {
      pattern: `${URL_REPO}/edit/main/docs/:path`
    },
    siteTitle: TITLE,
    logo: { src: '/favicon.svg', alt: '' },
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Reference', link: '/api/' },
      {
        text: pkg.version,
        items: [
          { text: 'Changelog', link: `${URL_REPO}/blob/main/CHANGELOG.md` },
          {
            text: 'Contributing',
            link: `${URL_REPO}/blob/main/CONTRIBUTING.md`
          },
          { text: 'Security', link: `${URL_REPO}/blob/main/SECURITY.md` }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: URL_REPO },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@phun-ky/angle' }
    ],
    footer: {
      message:
        'Released under the <a href="https://github.com/phun-ky/angle/blob/main/LICENSE">MIT License</a>.',
      copyright:
        'Copyright © 2024-present <a href="https://phun-ky.net/">Alexander Vassbotn Røyne-Helgesen</a>'
    },
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting started', link: '/guide/' },
            { text: 'Usage', link: '/guide/usage' },
            { text: 'Errors and edge cases', link: '/guide/errors' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'Reference',
          items: (typedocSidebar as DefaultTheme.SidebarItem[]).map((item) => ({
            ...item,
            collapsed: false
          }))
        }
      ]
    }
  },
  vite: {
    plugins: [groupIconVitePlugin()],
    resolve: {
      alias: [
        {
          find: /^.*\/VPSwitchAppearance\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/ToggleDarkMode.vue', import.meta.url)
          )
        }
      ]
    }
  },
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin);
    },
    theme: {
      // The accessible themes are TextMate JSON, which Shiki accepts as is
      dark: darkTheme as never,
      light: lightTheme as never
    }
  }
});
