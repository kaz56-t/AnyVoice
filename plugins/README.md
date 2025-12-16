# Window Manager Expo Config Plugin

このプラグインは、WindowsとMac用のネイティブモジュールをExpoプロジェクトに統合します。

## 使用方法

`app.json`にプラグインを追加してください：

```json
{
  "expo": {
    "plugins": [
      "./plugins/with-window-manager"
    ]
  }
}
```

## 注意事項

このプラグインは、react-native-windowsとreact-native-macosがプロジェクトに設定されている必要があります。

ExpoプロジェクトでWindows/Macのネイティブモジュールを使用するには、通常、以下のいずれかの方法が必要です：

1. **Expo Development Build**: カスタムネイティブコードを含む開発ビルドを作成
2. **Bare React Native**: Expoから離れて、react-native-windows/react-native-macosを直接使用

## 実装の詳細

ネイティブモジュールの実装については、`docs/window-manager-native-implementation.md`を参照してください。
