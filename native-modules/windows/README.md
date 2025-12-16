# Windows ネイティブモジュール

## ファイル構成

- `WindowManagerModule.cs`: メインのネイティブモジュール実装
- `WindowManagerPackageProvider.cs`: React Nativeパッケージプロバイダー

## 統合方法

### 1. ファイルをコピー

Windowsプロジェクトの適切な場所（例: `windows/YourApp/NativeModules/`）にファイルをコピーします。

### 2. 名前空間の調整

プロジェクト名に合わせて、名前空間を変更してください：

```csharp
namespace YourApp.NativeModules  // YourAppを実際のプロジェクト名に変更
```

### 3. パッケージプロバイダーを登録

`MainReactNativeHost.cs`または適切な場所で、パッケージプロバイダーを追加：

```csharp
protected override List<IReactPackageProvider> PackageProviders =>
    new List<IReactPackageProvider>
    {
        new MainReactPackageProvider(),
        new WindowManagerPackageProvider(), // 追加
    };
```

### 4. 必要なusingステートメント

以下のusingステートメントが含まれていることを確認：

```csharp
using Microsoft.ReactNative;
using System;
using System.Runtime.InteropServices;
using Windows.UI.Core;
using Windows.UI.Xaml;
```

## 実装の詳細

### ウィンドウハンドルの取得

Windowsでは、UWPとWindows App SDK (WinUI 3)でウィンドウハンドルの取得方法が異なります。現在の実装では、複数の方法を試行しています：

1. AppWindowを使用（WinUI 3）
2. CoreWindowを使用（UWP）
3. Window IDから直接取得（フォールバック）

実際のプロジェクトに合わせて、`GetWindowHandle`メソッドを調整してください。

### SetWindowPos API

Win32 APIの`SetWindowPos`を使用して、ウィンドウを前面に表示します：

- `HWND_TOPMOST`: ウィンドウを常に前面に表示
- `HWND_NOTOPMOST`: 通常のウィンドウレベルに戻す

## トラブルシューティング

### ウィンドウハンドルが取得できない

- 使用しているフレームワーク（UWP vs WinUI 3）を確認
- `GetWindowHandle`メソッドをデバッグして、どの方法が成功するか確認
- プロジェクトの設定で、適切なAPIが有効になっているか確認

### SetWindowPosが失敗する

- ウィンドウが既に破棄されていないか確認
- 権限の問題がないか確認
- エラーコードを確認して、原因を特定

## 参考資料

- [react-native-windows ドキュメント](https://microsoft.github.io/react-native-windows/)
- [Win32 API - SetWindowPos](https://docs.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setwindowpos)
