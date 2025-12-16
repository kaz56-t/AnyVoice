# ネイティブモジュールセットアップガイド

このドキュメントでは、WindowsとMac用のネイティブモジュールをプロジェクトに統合する方法を説明します。

## プロジェクト構造

```
/workspace/
├── native-modules/
│   ├── windows/
│   │   └── WindowManagerModule.cs    # Windows用C#モジュール
│   ├── macos/
│   │   ├── WindowManagerModule.swift # macOS用Swiftモジュール
│   │   └── WindowManagerModule.m      # Objective-Cブリッジ
│   └── index.ts                       # TypeScript型定義
├── plugins/
│   └── with-window-manager.js         # Expo Config Plugin
└── services/
    └── window-manager.ts              # ウィンドウ管理サービス
```

## Windows実装の統合

### 前提条件

1. **react-native-windows**がインストールされていること
2. Visual Studio 2019以降がインストールされていること
3. Windows 10 SDKがインストールされていること

### 手順

1. **プロジェクトにreact-native-windowsを追加**（まだの場合）:
   ```bash
   npm install react-native-windows
   npx react-native-windows-init --overwrite
   ```

2. **C#モジュールをWindowsプロジェクトに追加**:
   - `windows/YourApp/WindowManagerModule.cs`に`native-modules/windows/WindowManagerModule.cs`の内容をコピー
   - 名前空間をプロジェクトの名前に合わせて変更（`AnyVoice.NativeModules`）

3. **モジュールを登録**:
   - `windows/YourApp/MainReactNativeHost.cs`または適切な場所で、ReactPackageにモジュールを追加
   ```csharp
   protected override List<IReactPackageProvider> PackageProviders =>
       new List<IReactPackageProvider>
       {
           new MainReactPackageProvider(),
           new WindowManagerPackageProvider(), // 追加
       };
   ```

4. **PackageProviderを作成**:
   ```csharp
   public class WindowManagerPackageProvider : IReactPackageProvider
   {
       public void CreatePackage(IReactPackageBuilder packageBuilder)
       {
           packageBuilder.AddModule("WindowManagerModule", () => new WindowManagerModule());
       }
   }
   ```

### 注意事項

- Windows UWPとWindows App SDK (WinUI 3)で実装方法が異なる場合があります
- ウィンドウハンドルの取得方法は、使用しているフレームワークに依存します
- 実際のプロジェクト構造に合わせて、パスと名前空間を調整してください

## macOS実装の統合

### 前提条件

1. **react-native-macos**がインストールされていること
2. Xcodeがインストールされていること
3. macOS 10.14以降

### 手順

1. **プロジェクトにreact-native-macosを追加**（まだの場合）:
   ```bash
   npm install react-native-macos
   npx react-native-macos-init
   ```

2. **Swiftファイルを追加**:
   - XcodeでmacOSプロジェクトを開く
   - `macos/YourApp/WindowManagerModule.swift`に`native-modules/macos/WindowManagerModule.swift`の内容をコピー
   - Xcodeプロジェクトにファイルを追加（"Add Files to YourApp"）

3. **Objective-Cブリッジファイルを追加**:
   - `macos/YourApp/WindowManagerModule.m`に`native-modules/macos/WindowManagerModule.m`の内容をコピー
   - Xcodeプロジェクトにファイルを追加

4. **Bridging Headerを確認**:
   - Swiftファイルを使用する場合、Bridging Headerが必要な場合があります
   - プロジェクトのBuild Settingsで"Objective-C Bridging Header"を確認

### 注意事項

- Swiftファイルを追加する際、Xcodeプロジェクトに正しく追加されていることを確認してください
- Objective-Cブリッジファイル（.m）は、React Nativeのブリッジシステムと連携します
- `requiresMainQueueSetup`が`true`を返すため、メインスレッドで初期化されます

## Expoプロジェクトでの使用

Expoプロジェクトでネイティブモジュールを使用するには、通常以下のいずれかの方法が必要です：

### 方法1: Expo Development Build

1. **開発ビルドを作成**:
   ```bash
   eas build --profile development --platform windows
   eas build --profile development --platform macos
   ```

2. **カスタムネイティブコードを含める**:
   - `app.json`にプラグインを追加
   - ネイティブモジュールファイルを適切な場所に配置

### 方法2: Bare React Nativeに移行

Expoから離れて、react-native-windows/react-native-macosを直接使用する方法：

```bash
npx expo eject
# または
npx expo prebuild
```

その後、上記の手順に従ってネイティブモジュールを統合します。

## テスト

ネイティブモジュールが正しく動作するかテストするには：

1. **アプリをビルド**:
   ```bash
   # Windows
   npx react-native run-windows
   
   # macOS
   npx react-native run-macos
   ```

2. **設定画面で前面表示を有効化**:
   - 設定画面を開く
   - 「前面への表示」をONにする
   - 他のアプリを起動して、アプリが前面に表示されることを確認

3. **コンソールログを確認**:
   - 開発者ツールでログを確認
   - エラーがないことを確認

## トラブルシューティング

### Windows

- **ウィンドウハンドルが取得できない**:
  - 使用しているフレームワーク（UWP vs WinUI 3）を確認
  - `GetWindowHandle`メソッドを調整

- **SetWindowPosが失敗する**:
  - ウィンドウの状態を確認
  - 権限の問題がないか確認

### macOS

- **モジュールが見つからない**:
  - Xcodeプロジェクトにファイルが正しく追加されているか確認
  - Build Phasesでファイルがコンパイル対象に含まれているか確認

- **ウィンドウが前面に表示されない**:
  - ウィンドウレベルを`.modalPanel`に変更してみる
  - `NSApplication.shared.activate(ignoringOtherApps: true)`を呼び出す

## 参考資料

- [react-native-windows ドキュメント](https://microsoft.github.io/react-native-windows/)
- [react-native-macos ドキュメント](https://github.com/microsoft/react-native-macos)
- [Expo Development Build](https://docs.expo.dev/development/introduction/)
- [ネイティブモジュール実装ガイド](./window-manager-native-implementation.md)
