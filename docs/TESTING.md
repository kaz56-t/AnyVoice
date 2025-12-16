# テスト方法ガイド

## 🌐 Webブラウザでテスト（推奨：最も簡単）

### 1. 開発サーバーを起動

```bash
npm run web
```

または

```bash
npx expo start --web
```

### 2. ブラウザで確認

自動的にブラウザが開き、`http://localhost:8081` でアプリが表示されます。

### ⚠️ Webでの制限事項

- **マイク録音**: ブラウザではHTTPS接続が必要です（`http://localhost`は通常許可されます）
- **ファイルシステム**: Webでは一部のファイル操作が制限される可能性があります
- **クリップボード**: ブラウザのセキュリティポリシーにより、一部の操作が制限される場合があります

### Webでの動作確認ポイント

1. ✅ UIの表示確認
2. ✅ 設定画面でのAPIキー入力・保存
3. ✅ 言語選択
4. ⚠️ マイク録音（ブラウザの権限が必要）
5. ✅ テキスト表示
6. ⚠️ クリップボードコピー（ブラウザの権限が必要）

---

## 🪟 Windowsネイティブアプリとしてテスト

Windowsネイティブアプリとして実行するには、`react-native-windows`の設定が必要です。

### 前提条件

- Windows 10/11
- Visual Studio 2022（C++開発ツールを含む）
- Node.js 18以上
- Windows SDK 10.0.19041.0以上

### セットアップ手順

#### 1. react-native-windowsをインストール

```bash
npm install react-native-windows
```

#### 2. Windowsプロジェクトを初期化

```bash
npx react-native-windows-init --overwrite
```

#### 3. Visual Studioでビルド

```bash
cd windows
npx react-native run-windows
```

または、Visual Studioで `windows/AnyVoice.sln` を開いてビルド・実行

### ⚠️ 注意事項

- Expoプロジェクトで`react-native-windows`を使用する場合、一部のExpoモジュールがWindowsでサポートされていない可能性があります
- ネイティブモジュールの追加が必要な場合があります

---

## 🚀 推奨テストフロー

1. **まずWebでテスト** → UIと基本機能を確認
2. **API連携をテスト** → OpenAI APIの動作確認
3. **必要に応じてWindowsネイティブ** → ネイティブ機能（グローバルショートカットなど）の実装時

---

## 🔧 トラブルシューティング

### Webでマイクが動作しない場合

1. ブラウザの設定でマイクの権限を確認
2. HTTPS接続を使用（`https://localhost`）
3. ブラウザのコンソールでエラーを確認

### Windowsネイティブでビルドエラーが発生する場合

1. Visual StudioのC++開発ツールがインストールされているか確認
2. Windows SDKのバージョンを確認
3. `npm install`を再実行

