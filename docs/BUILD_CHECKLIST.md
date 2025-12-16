# ビルド前チェックリスト

ビルドを開始する前に、以下の項目を確認してください。

## ✅ 環境の確認

### Windows

- [ ] Node.js v18以上がインストールされている
  ```bash
  node --version
  ```
- [ ] Visual Studio 2022がインストールされている
- [ ] "Desktop development with C++" ワークロードがインストールされている
- [ ] Windows 10 SDKがインストールされている
- [ ] Gitがインストールされている（推奨）

### macOS

- [ ] Node.js v18以上がインストールされている
  ```bash
  node --version
  ```
- [ ] Xcodeがインストールされている
- [ ] Command Line Toolsがインストールされている
  ```bash
  xcode-select --install
  ```
- [ ] CocoaPodsがインストールされている（必要に応じて）
  ```bash
  sudo gem install cocoapods
  ```

## ✅ プロジェクトの準備

- [ ] プロジェクトのルートディレクトリにいる
- [ ] 依存関係がインストールされている
  ```bash
  npm install
  ```
- [ ] Gitリポジトリがクリーンな状態（オプション、推奨）

## ✅ ビルド手順

### Windows

- [ ] `npx expo prebuild --clean` を実行した
- [ ] `npm install react-native-windows` を実行した
- [ ] ネイティブモジュールファイルをコピーした
  - `native-modules/windows/WindowManagerModule.cs`
  - `native-modules/windows/WindowManagerPackageProvider.cs`
- [ ] Visual Studioでプロジェクトを開いた
- [ ] ファイルをプロジェクトに追加した
- [ ] 名前空間を確認・修正した
- [ ] `MainReactNativeHost.cs` でパッケージプロバイダーを登録した

### macOS

- [ ] `npx expo prebuild --clean` を実行した
- [ ] `npm install react-native-macos` を実行した
- [ ] Xcodeでプロジェクトを開いた
- [ ] Swiftファイルを追加した
  - `native-modules/macos/WindowManagerModule.swift`
- [ ] Objective-Cブリッジファイルを追加した
  - `native-modules/macos/WindowManagerModule.m`

## ✅ テスト

- [ ] アプリが正常に起動する
- [ ] 設定画面が開ける
- [ ] 「前面への表示」のトグルボタンが表示される
- [ ] トグルをONにできる
- [ ] 他のアプリを起動しても、アプリが前面に表示される（Windows/Macのみ）
- [ ] コンソールにエラーが表示されない

## ⚠️ 問題が発生した場合

- [ ] エラーメッセージを確認した
- [ ] [BUILD_AND_TEST.md](./BUILD_AND_TEST.md#トラブルシューティング) のトラブルシューティングセクションを確認した
- [ ] ログを確認した
- [ ] プロジェクトをクリーンビルドした

## 📚 参考ドキュメント

- [ビルドとテスト手順ガイド](./BUILD_AND_TEST.md) - 完全な手順
- [クイックスタートガイド](./QUICK_START.md) - 簡潔な手順
- [ネイティブモジュールセットアップガイド](./native-modules-setup.md) - 詳細な統合方法
