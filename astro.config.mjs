import { defineConfig } from 'astro/config'
import viteImagemin from 'vite-plugin-imagemin'
import relativeLinks from 'astro-relative-links'

export default defineConfig({
  // 出力ディレクトリ（デフォルトは "dist"）
  outDir: 'dist',
  compressHTML: false, // HTMLを圧縮しない場合
  vite: {
    server: {
      port: 4321, // スクリーンショットスクリプトと揃える
      open: true,
    },
    // SCSSなど別途loader設定したい場合
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "/src/styles/reset.scss" as *;
            @use "/src/styles/_variables.scss" as *;
            @use "/src/styles/_mixin.scss" as *;
          `,
        },
      },
    },
    integrations: [relativeLinks()],
    build: {
      inlineStylesheets: 'never', // CSSを常に外部ファイルとして出力
      minify: false,
      cssMinify: false,
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            const fileName = assetInfo?.names
            if (fileName && Array.isArray(fileName)) {
              const extType = fileName[0].split('.').at(-1)
              if (extType === 'css') {
                return 'assets/css/[name][extname]'
              }
            }
            return `assets/images/[name][extname]`
          },
        },
      },
    },
    plugins: [
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 80,
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 1,
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
              active: false,
            },
            {
              name: 'removeEmptyAttrs',
              active: false,
            },
          ],
        },
      }),
    ],
  },
})
