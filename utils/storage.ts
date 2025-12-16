import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  API_KEY: 'openai_api_key',
  LANGUAGE: 'transcription_language',
  ALWAYS_ON_TOP: 'always_on_top',
  SHORTCUT_KEY: 'shortcut_key',
} as const;

export interface AppSettings {
  apiKey: string;
  language: string;
  alwaysOnTop: boolean;
  shortcutKey: string;
}

export const defaultSettings: AppSettings = {
  apiKey: '',
  language: 'ja',
  alwaysOnTop: false,
  shortcutKey: 'Ctrl+Shift+S',
};

export const storage = {
  async getApiKey(): Promise<string> {
    return (await AsyncStorage.getItem(STORAGE_KEYS.API_KEY)) || '';
  },

  async setApiKey(key: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.API_KEY, key);
  },

  async getLanguage(): Promise<string> {
    return (await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE)) || defaultSettings.language;
  },

  async setLanguage(language: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  },

  async getAlwaysOnTop(): Promise<boolean> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ALWAYS_ON_TOP);
    return value === 'true';
  },

  async setAlwaysOnTop(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ALWAYS_ON_TOP, enabled.toString());
  },

  async getShortcutKey(): Promise<string> {
    return (await AsyncStorage.getItem(STORAGE_KEYS.SHORTCUT_KEY)) || defaultSettings.shortcutKey;
  },

  async setShortcutKey(shortcut: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.SHORTCUT_KEY, shortcut);
  },

  async getAllSettings(): Promise<AppSettings> {
    return {
      apiKey: await this.getApiKey(),
      language: await this.getLanguage(),
      alwaysOnTop: await this.getAlwaysOnTop(),
      shortcutKey: await this.getShortcutKey(),
    };
  },
};

