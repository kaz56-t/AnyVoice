# クイックスタートガイド

このガイドでは、最短でアプリをビルドしてテストする手順を説明します。

## 🚀 5分で始める

### ステップ1: 環境の確認 (1分)

```bash
# Node.jsのバージョンを確認
node --version  # v18以上推奨

# npmのバージョンを確認
npm --version
```

### ステップ2: 依存関係のインストール (2分)

```bash
# プロジェクトのルートディレクトリで実行
npm install
```

### ステップ3: ネイティブプロジェクトの生成 (2分)

```bash
# WindowsとmacOSのネイティブプロジェクトを生成
npx expo prebuild --clean
```

### ステップ4: プラットフォーム別の手順

#### Windowsの場合

```bash
# react-native-windowsを追加
npm install react-native-windows

# ネイティブモジュールを統合（手動でファイルをコピー）
# 詳細は docs/BUILD_AND_TEST.md を参照

# アプリを実行
npx react-native run-windows
```

#### macOSの場合

```bash
# react-native-macosを追加
npm install react-native-macos

# ネイティブモジュールを統合（Xcodeでファイルを追加）
# 詳細は docs/BUILD_AND_TEST.md を参照

# アプリを実行
npx react-native run-macos
```

## 📚 詳細な手順

より詳細な手順が必要な場合は、以下を参照してください：

- **[ビルドとテスト手順ガイド](./BUILD_AND_TEST.md)** - 完全な手順とトラブルシューティング
- **[ネイティブモジュールセットアップガイド](./native-modules-setup.md)** - ネイティブモジュールの統合方法
- **[ネイティブモジュール実装ガイド](./window-manager-native-implementation.md)** - 実装の詳細

## ⚠️ 注意事項

- WindowsではVisual Studio 2022が必要です
- macOSではXcodeが必要です
- 初回ビルドには時間がかかります（5-10分程度）

## 🆘 問題が発生した場合

1. **エラーメッセージを確認**: コンソールに表示されるエラーを確認
2. **トラブルシューティングを参照**: [BUILD_AND_TEST.md](./BUILD_AND_TEST.md#トラブルシューティング)
3. **ログを確認**: 開発者ツールのコンソールでエラーを確認

## 📖 次のステップ

ビルドが成功したら：

1. 設定画面で「前面への表示」をONにする
2. 他のアプリを起動して、アプリが前面に表示されることを確認
3. 機能をテストする
