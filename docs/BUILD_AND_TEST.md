# ビルドとテスト手順ガイド

このドキュメントでは、Windows/Macでアプリをビルドしてテストするまでの具体的な手順を説明します。

## 📋 目次

1. [前提条件の確認](#前提条件の確認)
2. [プロジェクトの準備](#プロジェクトの準備)
3. [Windowsでのビルドとテスト](#windowsでのビルドとテスト)
4. [macOSでのビルドとテスト](#macosでのビルドとテスト)
5. [トラブルシューティング](#トラブルシューティング)

---

## 前提条件の確認

### Windows

- ✅ **Node.js** (v18以上推奨)
- ✅ **Visual Studio 2022** (Community Edition以上)
  - ワークロード: "Desktop development with C++"
  - コンポーネント: "Windows 10 SDK" (最新版)
- ✅ **Windows 10/11** (開発用PC)
- ✅ **Git** (オプション、推奨)

### macOS

- ✅ **Node.js** (v18以上推奨)
- ✅ **Xcode** (最新版推奨)
  - Command Line Tools: `xcode-select --install`
- ✅ **macOS 10.14以降**
- ✅ **CocoaPods** (iOS/macOS開発用): `sudo gem install cocoapods`

---

## プロジェクトの準備

### ステップ1: 依存関係のインストール

```bash
# プロジェクトのルートディレクトリで実行
npm install
```

### ステップ2: Expo prebuildでネイティブプロジェクトを生成

Expoプロジェクトからネイティブコードを含むプロジェクトを生成します：

```bash
# WindowsとmacOSのネイティブプロジェクトを生成
npx expo prebuild --clean
```

このコマンドで以下が生成されます：
- `windows/` - Windows用のVisual Studioプロジェクト
- `ios/` - iOS用のXcodeプロジェクト（macOSも含む場合あり）

**注意**: macOS専用のプロジェクトが必要な場合は、react-native-macosを追加する必要があります。

### ステップ3: react-native-windows/react-native-macosの追加

#### Windows用

```bash
# react-native-windowsをインストール
npm install react-native-windows

# Windowsプロジェクトを初期化（既にprebuildで生成されている場合はスキップ可能）
npx react-native-windows-init --overwrite
```

#### macOS用

```bash
# react-native-macosをインストール
npm install react-native-macos

# macOSプロジェクトを初期化
npx react-native-macos-init
```

---

## Windowsでのビルドとテスト

### ステップ1: ネイティブモジュールを統合

1. **ファイルをコピー**:
   ```bash
   # WindowsプロジェクトのNativeModulesディレクトリを作成
   mkdir -p windows/AnyVoice/NativeModules
   
   # ネイティブモジュールファイルをコピー
   cp native-modules/windows/WindowManagerModule.cs windows/AnyVoice/NativeModules/
   cp native-modules/windows/WindowManagerPackageProvider.cs windows/AnyVoice/NativeModules/
   ```

2. **Visual Studioでプロジェクトを開く**:
   ```bash
   # Visual Studioでソリューションを開く
   start windows/AnyVoice.sln
   ```
   または、Visual Studioから `windows/AnyVoice.sln` を開く

3. **プロジェクトにファイルを追加**:
   - Visual Studioのソリューションエクスプローラーで `AnyVoice` プロジェクトを右クリック
   - "Add" > "Existing Item..." を選択
   - `NativeModules/WindowManagerModule.cs` と `WindowManagerPackageProvider.cs` を追加

4. **名前空間を確認**:
   - `WindowManagerModule.cs` と `WindowManagerPackageProvider.cs` を開く
   - 名前空間が `AnyVoice.NativeModules` になっているか確認
   - プロジェクト名が異なる場合は、適切に変更

5. **パッケージプロバイダーを登録**:
   - `windows/AnyVoice/MainReactNativeHost.cs` を開く
   - `PackageProviders` に `WindowManagerPackageProvider` を追加:
   ```csharp
   protected override List<IReactPackageProvider> PackageProviders =>
       new List<IReactPackageProvider>
       {
           new MainReactPackageProvider(),
           new WindowManagerPackageProvider(), // 追加
       };
   ```
   - 必要なusingステートメントを追加:
   ```csharp
   using AnyVoice.NativeModules;
   ```

### ステップ2: ビルドと実行

#### 方法1: Visual Studioから実行

1. Visual Studioで `AnyVoice` プロジェクトを選択
2. デバッグモードを選択（Debug/Release）
3. F5キーを押すか、「開始」ボタンをクリック

#### 方法2: コマンドラインから実行

```bash
# Metro bundlerを起動（別のターミナルで）
npm start

# Windowsアプリをビルドして実行
npx react-native run-windows
```

### ステップ3: テスト

1. **アプリが起動することを確認**
2. **設定画面を開く**:
   - アプリ内の「設定」タブをタップ
3. **前面表示機能をテスト**:
   - 「前面への表示」をONにする
   - 他のアプリ（例: ブラウザ、メモ帳）を起動
   - AnyVoiceアプリが前面に表示されることを確認
4. **コンソールログを確認**:
   - Visual Studioの出力ウィンドウでログを確認
   - エラーがないことを確認

---

## macOSでのビルドとテスト

### ステップ1: ネイティブモジュールを統合

1. **Xcodeプロジェクトを開く**:
   ```bash
   open macos/AnyVoice.xcworkspace
   # または
   open macos/AnyVoice.xcodeproj
   ```

2. **Swiftファイルを追加**:
   - Xcodeのプロジェクトナビゲーターで `macos/AnyVoice/` を右クリック
   - "Add Files to AnyVoice..." を選択
   - `native-modules/macos/WindowManagerModule.swift` を選択
   - ✅ "Copy items if needed" にチェック
   - ✅ "Add to targets: AnyVoice" にチェック
   - "Add" をクリック

3. **Objective-Cブリッジファイルを追加**:
   - 同様の手順で `native-modules/macos/WindowManagerModule.m` を追加

4. **Bridging Headerの確認** (必要に応じて):
   - プロジェクトのBuild Settingsを開く
   - "Objective-C Bridging Header" を検索
   - 必要に応じて設定（通常は自動生成される）

### ステップ2: ビルドと実行

#### 方法1: Xcodeから実行

1. Xcodeで実行スキームを選択（AnyVoice > My Mac）
2. Product > Run (⌘R) を選択
3. または、再生ボタンをクリック

#### 方法2: コマンドラインから実行

```bash
# Metro bundlerを起動（別のターミナルで）
npm start

# macOSアプリをビルドして実行
npx react-native run-macos
```

### ステップ3: テスト

1. **アプリが起動することを確認**
2. **設定画面を開く**:
   - アプリ内の「設定」タブをクリック
3. **前面表示機能をテスト**:
   - 「前面への表示」をONにする
   - 他のアプリ（例: Safari、TextEdit）を起動
   - AnyVoiceアプリが前面に表示されることを確認
4. **コンソールログを確認**:
   - Xcodeのコンソールでログを確認
   - エラーがないことを確認

---

## トラブルシューティング

### よくある問題と解決方法

#### 1. "Module not found" エラー

**原因**: ネイティブモジュールが正しく登録されていない

**解決方法**:
- Windows: `MainReactNativeHost.cs` でパッケージプロバイダーが登録されているか確認
- macOS: Xcodeプロジェクトにファイルが追加されているか確認
- プロジェクトをクリーンビルド:
  ```bash
  # Windows
  npx react-native run-windows --reset-cache
  
  # macOS
  npx react-native run-macos --reset-cache
  ```

#### 2. コンパイルエラー

**Windows (C#)**:
- Visual Studioでエラーメッセージを確認
- 必要なusingステートメントが追加されているか確認
- プロジェクトのターゲットフレームワークを確認

**macOS (Swift)**:
- Xcodeでエラーメッセージを確認
- Swiftのバージョンが正しいか確認
- Bridging Headerが正しく設定されているか確認

#### 3. ウィンドウが前面に表示されない

**確認事項**:
- ネイティブモジュールが正しく呼び出されているか（コンソールログで確認）
- 設定画面で「前面への表示」がONになっているか
- 他のアプリが前面表示をブロックしていないか

**デバッグ方法**:
- コンソールログで `Windows: 前面表示を有効にしました` または `macOS: 前面表示を有効にしました` が表示されるか確認
- エラーメッセージがないか確認

#### 4. Metro bundlerのエラー

```bash
# Metro bundlerをリセット
npm start -- --reset-cache

# node_modulesを再インストール
rm -rf node_modules
npm install
```

#### 5. ビルドが失敗する

**Windows**:
- Visual Studioのバージョンが正しいか確認
- Windows SDKがインストールされているか確認
- プロジェクトのターゲットプラットフォームを確認

**macOS**:
- Xcodeのバージョンが最新か確認
- Command Line Toolsがインストールされているか確認: `xcode-select --install`
- CocoaPodsがインストールされているか確認

---

## 次のステップ

ビルドとテストが成功したら：

1. **機能の詳細テスト**:
   - 前面表示のON/OFFを繰り返しテスト
   - アプリを再起動して設定が保持されるか確認
   - 複数のアプリを起動して前面表示が機能するか確認

2. **パフォーマンステスト**:
   - アプリの起動時間
   - 前面表示の切り替え速度
   - メモリ使用量

3. **配布準備**:
   - リリースビルドの作成
   - コード署名の設定
   - インストーラーの作成

---

## 参考資料

- [ネイティブモジュールセットアップガイド](./native-modules-setup.md)
- [ネイティブモジュール実装ガイド](./window-manager-native-implementation.md)
- [react-native-windows ドキュメント](https://microsoft.github.io/react-native-windows/)
- [react-native-macos ドキュメント](https://github.com/microsoft/react-native-macos)
- [Expo prebuild ドキュメント](https://docs.expo.dev/workflow/prebuild/)

---

## クイックリファレンス

### よく使うコマンド

```bash
# 依存関係のインストール
npm install

# ネイティブプロジェクトの生成
npx expo prebuild --clean

# Metro bundlerの起動
npm start

# Windowsアプリの実行
npx react-native run-windows

# macOSアプリの実行
npx react-native run-macos

# クリーンビルド
npx react-native run-windows --reset-cache
npx react-native run-macos --reset-cache
```

### 重要なファイルの場所

- **Windowsネイティブモジュール**: `native-modules/windows/`
- **macOSネイティブモジュール**: `native-modules/macos/`
- **Windowsプロジェクト**: `windows/AnyVoice.sln`
- **macOSプロジェクト**: `macos/AnyVoice.xcworkspace` または `macos/AnyVoice.xcodeproj`
- **設定ファイル**: `app.json`
- **ウィンドウ管理サービス**: `services/window-manager.ts`
