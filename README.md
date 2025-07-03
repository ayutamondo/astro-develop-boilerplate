# 概要

LP開発用 astro テンプレートです。

## 環境

astro ^5.10.2

node v24.3.0

`npm install`で必要なパッケージをインストールしておきます。

`npm install playwright`でスクリーンショット用のブラウザをインストール。

## Astro 起動コマンド

`npm run astro`

ローカルサーバー http://localhost:4321/ が起動します。

### フォルダ構成

| 第１階層 | 内容                         |
| -------- | ---------------------------- |
| dist     | html生成後のフォルダ         |
| src      | コンパイル前のデータフォルダ |

### 作業用コマンド

`npm run build`：Astroファイルを静的ファイルとしてビルド。独自の形式になります。ちなみに画像は圧縮済みとなります。

`npm run sass`：Scssファイルのcss変換

`npm run format`：Astroファイルも含めてフォーマット

`npm run favicon`：/favicon/favicon.pngをファビコン画像に変換

## Astroの機能

`npm run dev`で起動したページの下の方に開発ツールバーが表示されます。

Auditボタンでアクセシビリティの問題点を指摘してくれます。

## Prettier

VSCodeの拡張機能からPrettierをインストールし、VScodeの設定でdefault formatterをPrettierに設定。

formatOnSaveをオンにすれば保存時にAstro等が自動整形されます。

## NPMリンター機能

| 機能                           | コマンド           | 説明                                                                              |
| ------------------------------ | ------------------ | --------------------------------------------------------------------------------- |
| JSチェック                     | `npm run jslint`   | ESLint を使って JavaScript の構文をチェック                                       |
| JS自動修正                     | `npm run jsfix`    | ESLint を使って自動で修正可能な問題を修正                                         |
| HTMLコードチェック（API）      | `npm run w3c`      | HTMLのオンラインAPIを使った検証（W3C ValidatorのAPI・１日の利用回数制限がある）   |
| HTMLコードチェック（ローカル） | `npm run htmllint` | ローカルでHTMLコードチェック＆BEM形式チェック（.htmlvalidate.jsonで設定変更可能） |

### NPMを利用したリンター機能について

`npm run htmllint`についてはbemルールに則ったリンターとなっています。

不要な場合は`.htmlvalidate.json`の設定を変更してください。

## スクリーンショット機能

```
npm run screenshot
```

screenshotディレクトリに画像が生成されます。

### 動画の圧縮

https://www.videosmaller.com/jp/

動画は非対応なので、無料オンラインサービスで圧縮します
