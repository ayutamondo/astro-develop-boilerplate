# 概要

通常開発用 gulp テンプレートです。

## 環境

gulp v4.0.2

node v16.15.0

`npm install`で必要なパッケージをインストールしておきます。

`npm install playwright`でスクリーンショット用のブラウザをインストール。

## astro 起動コマンド

`npm run astro`

ローカルサーバー http://localhost:3000/ が起動し、ファイルの変更があると自動で以下のコンパイルが行われます。

| 内容                     | 変更フォルダ | 生成フォルダ      |
| ------------------------ | ------------ | ----------------- |
| scss ファイルの css 変換 | src/scss     | dist/assets/css   |
| ejs ファイルの html 変換 | src/ejs      | product           |
| 画像の圧縮               | src/image    | dist/assets/image |

※変換後のファイルは自動で上書きされてしまうため直接触らないようにしましょう。

### フォルダ構成

| 第１階層 | 内容                         |
| -------- | ---------------------------- |
| dist     | html生成後のフォルダ         |
| src      | コンパイル前のデータフォルダ |

### gulp 単独作業コマンド

`npm run sass`：scss ファイルの変換

`npm run format`：Astroファイルも含めたフォーマット

`npm run favicon`：/favicon/favicon.pngをファビコン画像に変換

## 静的ファイルとしてビルド

`npm run build`：画像は圧縮済みとなります。

## リンター機能

| 機能                           | コマンド           | 説明                                                                              |
| ------------------------------ | ------------------ | --------------------------------------------------------------------------------- |
| JSチェック                     | `npm run jslint`   | ESLint を使って JavaScript の構文をチェック                                       |
| JS自動修正                     | `npm run jsfix`    | ESLint を使って自動で修正可能な問題を修正                                         |
| HTMLコードチェック（API）      | `npm run w3c`      | HTMLのオンラインAPIを使った検証（W3C ValidatorのAPI・１日の利用回数制限がある）   |
| HTMLコードチェック（ローカル） | `npm run htmllint` | ローカルでHTMLコードチェック＆BEM形式チェック（.htmlvalidate.jsonで設定変更可能） |

## スクリーンショット機能

```
npm run screenshot
```

screenshotディレクトリに画像が生成されます。

### 動画の圧縮

https://www.videosmaller.com/jp/

動画は非対応なので、無料オンラインサービスで圧縮します
