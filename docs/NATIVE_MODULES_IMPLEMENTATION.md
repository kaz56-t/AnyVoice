# ネイティブモジュール実装完了

WindowsとMacで前面に表示する機能のネイティブモジュール実装が完了しました。

## 実装内容

### 1. Windows用ネイティブモジュール（C#）

**ファイル:**
- `native-modules/windows/WindowManagerModule.cs`
- `native-modules/windows/WindowManagerPackageProvider.cs`

**機能:**
- `setAlwaysOnTop(enabled)`: ウィンドウを前面に表示する設定を有効化/無効化
- `bringToFront()`: ウィンドウを即座に前面に表示

**実装方法:**
- Win32 APIの`SetWindowPos`を使用
- `HWND_TOPMOST`フラグでウィンドウを前面に表示
- UWPとWindows App SDK (WinUI 3)の両方に対応

### 2. macOS用ネイティブモジュール（Swift/Objective-C）

**ファイル:**
- `native-modules/macos/WindowManagerModule.swift`
- `native-modules/macos/WindowManagerModule.m`

**機能:**
- `setAlwaysOnTop(enabled)`: ウィンドウを前面に表示する設定を有効化/無効化
- `bringToFront()`: ウィンドウを即座に前面に表示

**実装方法:**
- `NSWindow.Level.floating`を使用してウィンドウを前面に表示
- メインスレッドでUI操作を実行
- 複数のウィンドウ取得方法を実装（フォールバック対応）

### 3. TypeScript型定義

**ファイル:**
- `native-modules/index.ts`

**機能:**
- ネイティブモジュールの型定義
- プラットフォーム検出とモジュールの利用可能性チェック

### 4. ウィンドウ管理サービス

**ファイル:**
- `services/window-manager.ts`（更新済み）

**変更点:**
- 新しい型定義を使用
- ネイティブモジュールの利用可能性をチェック
- エラーハンドリングの改善

### 5. Expo Config Plugin

**ファイル:**
- `plugins/with-window-manager.js`

**機能:**
- ネイティブモジュールファイルを自動的にプロジェクトにコピー
- Expoプロジェクトでの統合を簡素化

## 使用方法

### 基本的な使用

設定画面で「前面への表示」をON/OFFするだけで、自動的にネイティブモジュールが呼び出されます。

```typescript
import { windowManager } from '@/services/window-manager';

// 前面表示を有効化
await windowManager.setAlwaysOnTop(true);

// 前面表示を無効化
await windowManager.setAlwaysOnTop(false);

// ウィンドウを前面に表示
await windowManager.bringToFront();
```

### ネイティブモジュールの直接使用

```typescript
import { WindowManagerModule, isWindowManagerAvailable } from '@/native-modules';

if (isWindowManagerAvailable() && WindowManagerModule) {
  await WindowManagerModule.setAlwaysOnTop(true);
  await WindowManagerModule.bringToFront();
}
```

## 統合手順

### Windows

1. `native-modules/windows/`のファイルをWindowsプロジェクトにコピー
2. 名前空間をプロジェクト名に合わせて変更
3. `MainReactNativeHost.cs`でパッケージプロバイダーを登録

詳細は `native-modules/windows/README.md` を参照してください。

### macOS

1. Xcodeプロジェクトを開く
2. `WindowManagerModule.swift`と`WindowManagerModule.m`を追加
3. 自動リンクによりモジュールが登録される

詳細は `native-modules/macos/README.md` を参照してください。

## 注意事項

### Expoプロジェクトでの使用

Expoプロジェクトでネイティブモジュールを使用するには、通常以下のいずれかが必要です：

1. **Expo Development Build**: カスタムネイティブコードを含む開発ビルドを作成
2. **Bare React Native**: Expoから離れて、react-native-windows/react-native-macosを直接使用

詳細は `docs/native-modules-setup.md` を参照してください。

### プラットフォーム固有の考慮事項

- **Windows**: UWPとWindows App SDK (WinUI 3)で実装方法が異なる場合があります
- **macOS**: ウィンドウレベルを`.floating`から`.modalPanel`に変更することで、より強力な前面表示が可能です

## テスト

1. アプリをビルドして実行
2. 設定画面で「前面への表示」をONにする
3. 他のアプリを起動して、アプリが前面に表示されることを確認
4. コンソールログでエラーがないか確認

## トラブルシューティング

### モジュールが見つからない

- ネイティブモジュールが正しく統合されているか確認
- プロジェクトをクリーンビルド
- プラットフォームがWindowsまたはMacであることを確認

### ウィンドウが前面に表示されない

- ネイティブモジュールが正しく呼び出されているか確認
- コンソールログでエラーメッセージを確認
- プラットフォーム固有の実装を確認

詳細なトラブルシューティング情報は、各プラットフォームのREADMEファイルを参照してください。

## 参考資料

- [ネイティブモジュールセットアップガイド](./native-modules-setup.md)
- [ネイティブモジュール実装ガイド](./window-manager-native-implementation.md)
- [Windows README](../native-modules/windows/README.md)
- [macOS README](../native-modules/macos/README.md)
