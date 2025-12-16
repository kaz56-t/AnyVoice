import { NativeModules, Platform } from 'react-native';

/**
 * WindowManagerModule の型定義
 */
export interface WindowManagerModuleInterface {
  /**
   * ウィンドウを前面に表示する設定を有効化/無効化
   * @param enabled 前面表示を有効にするかどうか
   * @returns Promise<boolean> 成功した場合true
   */
  setAlwaysOnTop(enabled: boolean): Promise<boolean>;

  /**
   * ウィンドウを前面に表示
   * @returns Promise<boolean> 成功した場合true
   */
  bringToFront(): Promise<boolean>;
}

/**
 * ネイティブモジュールの取得
 * Windows/Macでのみ利用可能
 */
export const WindowManagerModule: WindowManagerModuleInterface | null =
  Platform.OS === 'windows' || Platform.OS === 'macos'
    ? (NativeModules.WindowManagerModule as WindowManagerModuleInterface)
    : null;

/**
 * ネイティブモジュールが利用可能かどうかを確認
 */
export const isWindowManagerAvailable = (): boolean => {
  return WindowManagerModule !== null;
};
