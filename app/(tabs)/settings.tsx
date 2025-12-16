
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { storage } from '@/utils/storage';
import { Picker } from '@react-native-picker/picker';

import { windowManager } from '@/services/window-manager';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';


const LANGUAGES = [
  { label: '日本語', value: 'ja' },
  { label: '英語', value: 'en' },
  { label: '中国語', value: 'zh' },
  { label: '韓国語', value: 'ko' },
  { label: 'スペイン語', value: 'es' },
  { label: 'フランス語', value: 'fr' },
  { label: 'ドイツ語', value: 'de' },
];

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [apiKey, setApiKey] = useState('');
  const [language, setLanguage] = useState('ja');
  const [alwaysOnTop, setAlwaysOnTop] = useState(false);
  const [shortcutKey, setShortcutKey] = useState('Ctrl+Shift+S');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await storage.getAllSettings();
      setApiKey(settings.apiKey);
      setLanguage(settings.language);
      setAlwaysOnTop(settings.alwaysOnTop);
      setShortcutKey(settings.shortcutKey);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleAlwaysOnTopToggle = async () => {
    const newValue = !alwaysOnTop;
    setAlwaysOnTop(newValue);
    
    // ウィンドウ管理サービスを使用して前面表示を設定
    try {
      await windowManager.setAlwaysOnTop(newValue);
      // 設定を即座に保存
      await storage.setAlwaysOnTop(newValue);
    } catch (error) {
      // エラーが発生した場合は元に戻す
      setAlwaysOnTop(!newValue);
      Alert.alert('エラー', '前面表示の設定に失敗しました');
      console.error('Always on top error:', error);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      Alert.alert('エラー', 'APIキーを入力してください');
      return;
    }

    setIsSaving(true);
    try {
      await storage.setApiKey(apiKey);
      await storage.setLanguage(language);
      await storage.setAlwaysOnTop(alwaysOnTop);
      await storage.setShortcutKey(shortcutKey);
      
      // 前面表示設定を適用
      await windowManager.setAlwaysOnTop(alwaysOnTop);
      
      Alert.alert('保存完了', '設定を保存しました');
    } catch (error) {
      Alert.alert('エラー', '設定の保存に失敗しました');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const theme = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            設定
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            OpenAI APIキー
          </ThemedText>
          <ThemedText type="default" style={styles.description}>
            OpenAI APIキーを入力してください。APIキーは安全に保存されます。
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
                color: colorScheme === 'dark' ? '#fff' : '#000',
                borderColor: theme.tint,
              },
            ]}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="sk-..."
            placeholderTextColor={colorScheme === 'dark' ? '#888' : '#999'}
            secureTextEntry
            autoCapitalize="none"
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            文字起こし言語
          </ThemedText>
          <ThemedText type="default" style={styles.description}>
            音声の文字起こしに使用する言語を選択してください。
          </ThemedText>
          <View
            style={[
              styles.pickerContainer,
              {
                backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
                borderColor: theme.tint,
              },
            ]}>
            <Picker
              selectedValue={language}
              onValueChange={setLanguage}
              mode="dropdown"
              dropdownIconColor={colorScheme === 'dark' ? '#fff' : '#000'}
              style={[
                styles.picker,
                {
                  color: colorScheme === 'dark' ? '#fff' : '#000',
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
                },
              ]}
              itemStyle={{
                color: colorScheme === 'dark' ? '#fff' : '#000',
                backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
              }}>
              {LANGUAGES.map((lang) => (
                <Picker.Item
                  key={lang.value}
                  label={lang.label}
                  value={lang.value}
                  color={colorScheme === 'dark' ? '#fff' : '#000'}
                />
              ))}
            </Picker>
          </View>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            前面への表示
          </ThemedText>
          <ThemedText type="default" style={styles.description}>
            {windowManager.isDesktopPlatform()
              ? '他のアプリを起動中でも常に前面に表示します（Windows/Macのみ）'
              : 'この機能はWindows/Macでのみ利用可能です'}
          </ThemedText>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              {
                backgroundColor: alwaysOnTop ? theme.tint : '#ddd',
                opacity: windowManager.isDesktopPlatform() ? 1 : 0.5,
              },
            ]}
            onPress={handleAlwaysOnTopToggle}
            disabled={!windowManager.isDesktopPlatform()}>
            <ThemedText
              type="defaultSemiBold"
              style={[
                styles.toggleButtonText,
                { color: alwaysOnTop ? '#fff' : '#000' },
              ]}>
              {alwaysOnTop ? 'ON' : 'OFF'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            ショートカットキー
          </ThemedText>
          <ThemedText type="default" style={styles.description}>
            録音開始/終了のショートカットキー（実装予定）
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
                color: colorScheme === 'dark' ? '#fff' : '#000',
                borderColor: theme.tint,
              },
            ]}
            value={shortcutKey}
            onChangeText={setShortcutKey}
            placeholder="Ctrl+Shift+S"
            placeholderTextColor={colorScheme === 'dark' ? '#888' : '#999'}
          />
        </ThemedView>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.tint }]}
          onPress={handleSave}
          disabled={isSaving}>
          <ThemedText type="defaultSemiBold" style={styles.saveButtonText}>
            {isSaving ? '保存中...' : '設定を保存'}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    marginBottom: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 12,
    fontSize: 14,
    opacity: 0.7,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  toggleButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
  toggleButtonText: {
    fontSize: 16,
  },
  saveButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

