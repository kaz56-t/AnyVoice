# ウィンドウ管理ネイティブモジュール実装ガイド

このドキュメントでは、WindowsとMacでウィンドウを前面に表示する機能を実装するためのネイティブモジュールの実装方法を説明します。

## 概要

`services/window-manager.ts`で定義されたインターフェースを実装するために、各プラットフォーム用のネイティブモジュールを作成する必要があります。

## Windows実装

### 必要な技術
- C# または C++
- Win32 API
- react-native-windows

### 実装方法

#### 1. ネイティブモジュールの作成

`windows/WindowManagerModule.cs` (C#の場合):

```csharp
using Microsoft.ReactNative;
using Windows.UI.Core;
using Windows.UI.Xaml;

namespace YourApp.NativeModules
{
    [ReactModule("WindowManagerModule")]
    internal sealed class WindowManagerModule
    {
        [ReactMethod("setAlwaysOnTop")]
        public void SetAlwaysOnTop(bool enabled, IReactPromise<bool> promise)
        {
            try
            {
                var window = CoreWindow.GetForCurrentThread();
                if (window != null)
                {
                    var appWindow = Windows.UI.WindowManagement.AppWindow.GetFromWindowId(
                        Windows.UI.WindowId.FromInt64(window.CoreWindow.GetWindowId().Value)
                    );
                    
                    // Windows 10/11では、SetWindowPosを使用
                    // 注意: react-native-windowsでは、ネイティブウィンドウハンドルを取得する必要があります
                    
                    // 簡易実装例（実際の実装では、ネイティブウィンドウハンドルが必要）
                    promise.Resolve(true);
                }
                else
                {
                    promise.Reject(new ReactError { Message = "Window not found" });
                }
            }
            catch (Exception ex)
            {
                promise.Reject(new ReactError { Message = ex.Message });
            }
        }
    }
}
```

#### 2. Win32 APIを使用した実装（C++）

より直接的な実装には、Win32 APIを使用します：

```cpp
// WindowManagerModule.h
#pragma once
#include "pch.h"
#include "NativeModules.h"

namespace winrt::YourApp::implementation
{
    REACT_MODULE(WindowManagerModule)
    struct WindowManagerModule
    {
        REACT_INIT(Initialize)
        void Initialize(React::ReactContext const& reactContext) noexcept
        {
            m_reactContext = reactContext;
        }

        REACT_METHOD(SetAlwaysOnTop)
        void SetAlwaysOnTop(bool enabled, React::ReactPromise<bool> promise) noexcept
        {
            try
            {
                auto window = CoreWindow::GetForCurrentThread();
                if (window)
                {
                    HWND hwnd = reinterpret_cast<HWND>(
                        window.CoreWindow().GetWindowId().Value
                    );
                    
                    if (enabled)
                    {
                        SetWindowPos(
                            hwnd,
                            HWND_TOPMOST,
                            0, 0, 0, 0,
                            SWP_NOMOVE | SWP_NOSIZE
                        );
                    }
                    else
                    {
                        SetWindowPos(
                            hwnd,
                            HWND_NOTOPMOST,
                            0, 0, 0, 0,
                            SWP_NOMOVE | SWP_NOSIZE
                        );
                    }
                    
                    promise.Resolve(true);
                }
                else
                {
                    promise.Reject(React::ReactError{ L"Window not found" });
                }
            }
            catch (...)
            {
                promise.Reject(React::ReactError{ L"Failed to set always on top" });
            }
        }

    private:
        React::ReactContext m_reactContext;
    };
}
```

#### 3. React Native側での使用

`services/window-manager.ts`を更新して、ネイティブモジュールを呼び出します：

```typescript
private async setAlwaysOnTopWindows(enabled: boolean): Promise<void> {
  const { NativeModules } = require('react-native');
  const { WindowManagerModule } = NativeModules;
  
  if (!WindowManagerModule) {
    throw new Error('WindowManagerModule is not available');
  }
  
  await WindowManagerModule.setAlwaysOnTop(enabled);
}
```

## macOS実装

### 必要な技術
- Swift または Objective-C
- AppKit
- react-native-macos

### 実装方法

#### 1. ネイティブモジュールの作成

`macos/WindowManagerModule.swift`:

```swift
import Foundation
import AppKit
import React

@objc(WindowManagerModule)
class WindowManagerModule: NSObject {
    
    @objc
    func setAlwaysOnTop(_ enabled: Bool, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            guard let window = NSApplication.shared.mainWindow else {
                rejecter("WINDOW_NOT_FOUND", "Main window not found", nil)
                return
            }
            
            if enabled {
                window.level = .floating
                // または .modalPanel を使用
                // window.level = .modalPanel
            } else {
                window.level = .normal
            }
            
            resolver(true)
        }
    }
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
```

#### 2. ブリッジモジュールの作成

`macos/WindowManagerModule.m` (Objective-Cブリッジ):

```objc
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(WindowManagerModule, NSObject)

RCT_EXTERN_METHOD(setAlwaysOnTop:(BOOL)enabled
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

@end
```

#### 3. React Native側での使用

`services/window-manager.ts`を更新して、ネイティブモジュールを呼び出します：

```typescript
private async setAlwaysOnTopMacOS(enabled: boolean): Promise<void> {
  const { NativeModules } = require('react-native');
  const { WindowManagerModule } = NativeModules;
  
  if (!WindowManagerModule) {
    throw new Error('WindowManagerModule is not available');
  }
  
  await WindowManagerModule.setAlwaysOnTop(enabled);
}
```

## 実装の注意点

### Windows
1. **権限**: 一部のWindows設定では、前面表示機能が制限される場合があります
2. **ウィンドウハンドルの取得**: react-native-windowsのバージョンによって、ウィンドウハンドルの取得方法が異なる場合があります
3. **UWP vs Win32**: UWPアプリとWin32アプリで実装方法が異なります

### macOS
1. **権限**: macOSでは、前面表示機能に特別な権限は不要です
2. **ウィンドウレベル**: 
   - `.floating`: 他のアプリのウィンドウの上に表示されますが、アクティブなアプリのウィンドウの下に表示される場合があります
   - `.modalPanel`: より強力な前面表示ですが、ユーザーインタラクションに影響を与える可能性があります
3. **メインスレッド**: UI操作は必ずメインスレッドで実行する必要があります

## テスト方法

1. ネイティブモジュールが正しく登録されているか確認
2. 前面表示のON/OFFが正しく動作するか確認
3. 他のアプリを起動した状態で、アプリが前面に表示されるか確認
4. 設定を保存して再起動後も設定が維持されるか確認

## トラブルシューティング

### Windows
- ウィンドウハンドルが取得できない場合: `CoreWindow.GetForCurrentThread()`の代わりに、別の方法でウィンドウを取得する必要があるかもしれません
- SetWindowPosが失敗する場合: ウィンドウの状態や権限を確認してください

### macOS
- ウィンドウが前面に表示されない場合: ウィンドウレベルを`.modalPanel`に変更してみてください
- メインウィンドウが取得できない場合: `NSApplication.shared.windows`から適切なウィンドウを選択する必要があるかもしれません
