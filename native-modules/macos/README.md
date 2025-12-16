# macOS ネイティブモジュール

## ファイル構成

- `WindowManagerModule.swift`: メインのSwift実装
- `WindowManagerModule.m`: Objective-Cブリッジファイル

## 統合方法

### 1. Xcodeプロジェクトを開く

```bash
open macos/YourApp.xcworkspace
# または
open macos/YourApp.xcodeproj
```

### 2. Swiftファイルを追加

1. Xcodeで、プロジェクトナビゲーターで`macos/YourApp/`フォルダを右クリック
2. "Add Files to YourApp..."を選択
3. `WindowManagerModule.swift`を選択して追加
4. "Copy items if needed"にチェックを入れる
5. "Add to targets"でYourAppにチェックを入れる

### 3. Objective-Cブリッジファイルを追加

同様の手順で`WindowManagerModule.m`を追加します。

### 4. Bridging Headerの確認

Swiftファイルを使用する場合、Bridging Headerが必要な場合があります。プロジェクトのBuild Settingsで以下を確認：

- "Objective-C Bridging Header"が設定されているか
- 必要に応じて、`YourApp-Bridging-Header.h`を作成

### 5. モジュールの自動登録

React Nativeの自動リンク機能により、モジュールは自動的に登録されます。手動で登録する必要はありません。

## 実装の詳細

### ウィンドウレベルの設定

macOSでは、`NSWindow.Level`を使用してウィンドウの表示順序を制御します：

- `.normal`: 通常のウィンドウレベル
- `.floating`: 他のアプリのウィンドウの上に表示（推奨）
- `.modalPanel`: より強力な前面表示（ユーザーインタラクションに影響する可能性あり）

現在の実装では`.floating`を使用していますが、より強力な前面表示が必要な場合は`.modalPanel`に変更できます。

### メインスレッドでの実行

UI操作は必ずメインスレッドで実行する必要があるため、`DispatchQueue.main.async`を使用しています。

### ウィンドウの取得

以下の順序でウィンドウを取得しようとします：

1. `NSApplication.shared.mainWindow`（メインウィンドウ）
2. `NSApplication.shared.keyWindow`（キーウィンドウ）
3. `NSApplication.shared.windows.first`（最初のウィンドウ）

## トラブルシューティング

### モジュールが見つからない

- Xcodeプロジェクトにファイルが正しく追加されているか確認
- Build Phases > Compile Sourcesにファイルが含まれているか確認
- クリーンビルドを実行（Product > Clean Build Folder）

### ウィンドウが前面に表示されない

- ウィンドウレベルを`.modalPanel`に変更してみる
- `NSApplication.shared.activate(ignoringOtherApps: true)`を追加
- 他のアプリが前面表示をブロックしていないか確認

### コンパイルエラー

- Swiftのバージョンを確認（Xcodeのバージョンに依存）
- React Nativeのバージョンと互換性があるか確認
- Bridging Headerが正しく設定されているか確認

## 参考資料

- [react-native-macos ドキュメント](https://github.com/microsoft/react-native-macos)
- [NSWindow Class Reference](https://developer.apple.com/documentation/appkit/nswindow)
- [NSWindow.Level](https://developer.apple.com/documentation/appkit/nswindow/level)
