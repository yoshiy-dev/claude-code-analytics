# Claude Code Analytics

[English](#english) · [日本語](#日本語)

## English

A prototype dashboard for developers and teams exploring how to review Claude Code activity. It brings usage trends, report summaries, discussion topics, and suggested actions into one interface.

### What you can explore

- A dashboard showing report KPIs, topics, issue categories, and suggested actions.
- Usage analytics views for sessions, hours, daily and hourly trends, and project distribution.
- Screens for report browsing, uploads, and team rankings.

### Current implementation

This repository contains prototype UI and backend integration code, rather than a ready-to-use analytics service.

- On `/dashboard`, selecting a ZIP file generates sample results from its filename. This flow does **not** unpack or analyze the selected archive.
- The usage analytics screen falls back to sample data when its API requests fail. Displayed values may therefore be demonstration data.
- Separate analysis code integrates with Google Gemini. Its ZIP extraction helper currently decodes bytes as UTF-8 instead of decompressing the archive.
- Generated estimates and scores are exploratory outputs, not validated measures of productivity or learning.

### Local development

The repository uses Next.js 15, React 19, TypeScript, Tailwind CSS, and Recharts, with a pnpm lockfile.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to explore the dashboard. These commands start the development server; they do not provision backend services.

Backend-dependent features require separate configuration. See [PostgREST configuration](src/lib/postgrest.ts), [SQL definitions](app.sql), [authentication SQL](auth/), and [Gemini integration](src/lib/gemini-analyzer.ts). The corresponding settings include `POSTGREST_URL`, `POSTGREST_SCHEMA`, `POSTGREST_API_KEY`, and `GEMINI_API_KEY`; authentication and other integrations have their own requirements.

Use synthetic data when exploring the prototype. The Gemini integration sends a content preview to Google's API when invoked.

### Code guide

| Path | Purpose |
| --- | --- |
| [src/app/dashboard](src/app/dashboard/) | Dashboard pages |
| [src/components/dashboard](src/components/dashboard/) | Reports, charts, and upload UI |
| [src/lib/sample-data.ts](src/lib/sample-data.ts) | Sample report generation |
| [src/app/next_api](src/app/next_api/) | API routes and integrations |

## 日本語

Claude Codeの利用を振り返りたい開発者・チーム向けに、利用傾向や分析レポートを一画面で確認するためのダッシュボードの試作です。利用状況、会話のトピック、課題、次のアクションをどう見せるかを検討するプロジェクトです。

### 確認できる画面

- レポートの指標、トピック、課題カテゴリ、推奨アクションを表示するダッシュボード
- セッション数・利用時間・日別／時間帯別の傾向・プロジェクト別の内訳を表示する分析画面
- レポート一覧、アップロード、チームランキングの画面

### 現在の実装範囲

UIの試作とバックエンド連携コードを含みます。すぐに実データの分析サービスとして使える状態を示すものではありません。

- `/dashboard`のZIP選択では、ファイル名からサンプル結果を生成します。この処理では、選択したZIPの展開・内容解析は行いません。
- 利用状況の分析画面では、API取得に失敗するとサンプルデータを表示します。画面の数値が実測値とは限りません。
- 別の解析コードにはGoogle Gemini連携があります。ただし、ZIPのテキスト抽出ヘルパーは現状、圧縮ファイルを展開せずUTF-8として読み取る実装です。
- 推定値やスコアは検討用の出力であり、生産性や学習効果を検証した指標ではありません。

### ローカル開発

Next.js 15・React 19・TypeScript・Tailwind CSS・Rechartsを使用し、pnpmのロックファイルを含みます。

```bash
pnpm install
pnpm dev
```

[http://localhost:3000/dashboard](http://localhost:3000/dashboard)でダッシュボードを開きます。上記は開発サーバーの起動手順であり、バックエンドの構築は別途必要です。

バックエンドを使う機能は、[PostgREST設定](src/lib/postgrest.ts)、[SQL定義](app.sql)、[認証用SQL](auth/)、[Gemini連携](src/lib/gemini-analyzer.ts)を参照してください。関連設定には`POSTGREST_URL`・`POSTGREST_SCHEMA`・`POSTGREST_API_KEY`・`GEMINI_API_KEY`があり、認証などの連携には追加設定が必要です。

試す際はダミーデータを使用してください。Gemini連携の実行時には、内容の一部がGoogleのAPIに送信されます。

### コードの入口

| パス | 内容 |
| --- | --- |
| [src/app/dashboard](src/app/dashboard/) | ダッシュボードの各ページ |
| [src/components/dashboard](src/components/dashboard/) | レポート・グラフ・アップロード画面 |
| [src/lib/sample-data.ts](src/lib/sample-data.ts) | サンプルレポート生成 |
| [src/app/next_api](src/app/next_api/) | APIルートと外部連携 |
