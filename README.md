# AnyVoice - 音声入力アプリ

WindowsとMacで動作する高速な音声入力・文章修正アプリです。

## 🚀 クイックスタート

### 基本的なセットアップ

1. 依存関係のインストール

   ```bash
   npm install
   ```

2. アプリの起動

   ```bash
   npx expo start
   ```

### Windows/Macでビルドしてテストする

**Windows/Macでネイティブアプリとしてビルドする場合は、以下のドキュメントを参照してください：**

- **[📖 クイックスタートガイド](./docs/QUICK_START.md)** - 最短で始める手順
- **[🔧 ビルドとテスト手順ガイド](./docs/BUILD_AND_TEST.md)** - 詳細な手順とトラブルシューティング

### 主要な機能

- 🎤 音声入力と文字起こし（Whisper API）
- ✏️ 文章の自動修正（GPT API）
- 📋 クリップボードへの自動コピー
- 🪟 前面表示機能（Windows/Mac）
- ⌨️ グローバルショートカット（実装予定）

## 📚 ドキュメント

- **[クイックスタート](./docs/QUICK_START.md)** - 5分で始める
- **[ビルドとテスト手順](./docs/BUILD_AND_TEST.md)** - 完全なビルド手順
- **[ネイティブモジュールセットアップ](./docs/native-modules-setup.md)** - ネイティブモジュールの統合方法
- **[実装仕様書](./docs/specs.md)** - アプリの仕様と機能要件
- **[テストガイド](./docs/TESTING.md)** - テスト方法

## 🛠️ 開発

このプロジェクトは [Expo](https://expo.dev) を使用しています。

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
