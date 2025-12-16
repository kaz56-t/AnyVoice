import { Platform } from 'react-native';
import { WindowManagerModule, isWindowManagerAvailable } from '@/native-modules';

/**
 * ウィンドウ管理サービス
 * WindowsとMacでウィンドウを前面に表示する機能を提供
 */
export class WindowManager {
  private static instance: WindowManager;
  private isAlwaysOnTop: boolean = false;

  private constructor() {}

  static getInstance(): WindowManager {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager();
    }
    return WindowManager.instance;
  }

  /**
   * プラットフォームがWindowsまたはMacかどうかを判定
   */
  isDesktopPlatform(): boolean {
    return Platform.OS === 'windows' || Platform.OS === 'macos';
  }

  /**
   * ウィンドウを前面に表示する設定を有効化/無効化
   * @param enabled 前面表示を有効にするかどうか
   */
  async setAlwaysOnTop(enabled: boolean): Promise<void> {
    if (!this.isDesktopPlatform()) {
      console.warn('前面表示機能はWindows/Macでのみ利用可能です');
      return;
    }

    this.isAlwaysOnTop = enabled;

    try {
      if (Platform.OS === 'windows') {
        await this.setAlwaysOnTopWindows(enabled);
      } else if (Platform.OS === 'macos') {
        await this.setAlwaysOnTopMacOS(enabled);
      }
    } catch (error) {
      console.error('前面表示の設定に失敗しました:', error);
      throw error;
    }
  }

  /**
   * 現在の前面表示設定を取得
   */
  getAlwaysOnTop(): boolean {
    return this.isAlwaysOnTop;
  }

  /**
   * Windowsでウィンドウを前面に表示する
   * ネイティブモジュールを使用して実装
   */
  private async setAlwaysOnTopWindows(enabled: boolean): Promise<void> {
    try {
      if (isWindowManagerAvailable() && WindowManagerModule) {
        // ネイティブモジュールが利用可能な場合
        await WindowManagerModule.setAlwaysOnTop(enabled);
        console.log(`Windows: 前面表示を${enabled ? '有効' : '無効'}にしました`);
      } else {
        // ネイティブモジュールがまだ実装されていない場合
        console.warn(
          'WindowManagerModuleが利用できません。' +
          'ネイティブモジュールの実装が必要です。' +
          '詳細は docs/window-manager-native-implementation.md を参照してください。'
        );
        // モック実装として、設定のみ保存
        console.log(`Windows: 前面表示設定を${enabled ? '有効' : '無効'}に設定しました（モック）`);
      }
    } catch (error) {
      console.error('Windows前面表示設定エラー:', error);
      // エラーが発生しても、設定は保存されているので続行
      throw error;
    }
  }

  /**
   * macOSでウィンドウを前面に表示する
   * ネイティブモジュールを使用して実装
   */
  private async setAlwaysOnTopMacOS(enabled: boolean): Promise<void> {
    try {
      if (isWindowManagerAvailable() && WindowManagerModule) {
        // ネイティブモジュールが利用可能な場合
        await WindowManagerModule.setAlwaysOnTop(enabled);
        console.log(`macOS: 前面表示を${enabled ? '有効' : '無効'}にしました`);
      } else {
        // ネイティブモジュールがまだ実装されていない場合
        console.warn(
          'WindowManagerModuleが利用できません。' +
          'ネイティブモジュールの実装が必要です。' +
          '詳細は docs/window-manager-native-implementation.md を参照してください。'
        );
        // モック実装として、設定のみ保存
        console.log(`macOS: 前面表示設定を${enabled ? '有効' : '無効'}に設定しました（モック）`);
      }
    } catch (error) {
      console.error('macOS前面表示設定エラー:', error);
      // エラーが発生しても、設定は保存されているので続行
      throw error;
    }
  }

  /**
   * ウィンドウを前面に表示（即座に実行）
   */
  async bringToFront(): Promise<void> {
    if (!this.isDesktopPlatform()) {
      return;
    }

    try {
      if (Platform.OS === 'windows') {
        await this.bringToFrontWindows();
      } else if (Platform.OS === 'macos') {
        await this.bringToFrontMacOS();
      }
    } catch (error) {
      console.error('ウィンドウを前面に表示できませんでした:', error);
    }
  }

  private async bringToFrontWindows(): Promise<void> {
    try {
      if (isWindowManagerAvailable() && WindowManagerModule) {
        await WindowManagerModule.bringToFront();
      } else {
        console.log('Windows: ウィンドウを前面に表示しました（モック）');
      }
    } catch (error) {
      console.error('Windows: ウィンドウを前面に表示できませんでした:', error);
    }
  }

  private async bringToFrontMacOS(): Promise<void> {
    try {
      if (isWindowManagerAvailable() && WindowManagerModule) {
        await WindowManagerModule.bringToFront();
      } else {
        console.log('macOS: ウィンドウを前面に表示しました（モック）');
      }
    } catch (error) {
      console.error('macOS: ウィンドウを前面に表示できませんでした:', error);
    }
  }
}

export const windowManager = WindowManager.getInstance();
