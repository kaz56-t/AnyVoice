import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { OpenAIService } from '@/services/openai';
import { RecordingService } from '@/services/recording';
import { storage } from '@/utils/storage';
import Clipboard from '@react-native-clipboard/clipboard';
import { useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalText, setOriginalText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [language, setLanguage] = useState('ja');

  const recordingService = React.useRef(new RecordingService()).current;

  // 画面がフォーカスされたときに設定を再読み込み
  useFocusEffect(
    React.useCallback(() => {
      loadSettings();
    }, [])
  );

  const loadSettings = async () => {
    try {
      const settings = await storage.getAllSettings();
      setApiKey(settings.apiKey);
      setLanguage(settings.language);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleToggleRecording = async () => {
    if (isProcessing) {
      return;
    }

    if (isRecording) {
      // 録音を停止
      await stopRecording();
    } else {
      // 録音を開始
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      await recordingService.startRecording();
      setIsRecording(true);
      setOriginalText('');
      setCorrectedText('');
    } catch (error: any) {
      console.error('録音開始エラー:', error);
      Alert.alert('エラー', error.message || '録音の開始に失敗しました');
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setIsProcessing(true);

      // 録音を停止してファイルURIを取得
      const audioUri = await recordingService.stopRecording();

      if (!apiKey) {
        console.error('APIキーが設定されていません');
        Alert.alert('エラー', 'APIキーが設定されていません。設定画面でAPIキーを入力してください。');
        setIsProcessing(false);
        return;
      }

      // Whisper APIで文字起こし
      const openAIService = new OpenAIService(apiKey);
      const transcribedText = await openAIService.transcribeAudio(audioUri, language);
      setOriginalText(transcribedText);

      // GPT APIで文章修正
      const corrected = await openAIService.correctText(transcribedText);
      setCorrectedText(corrected);

      // クリップボードに自動コピー
      try {
        await Clipboard.setString(corrected);
        Alert.alert('完了', '修正済みテキストをクリップボードにコピーしました');
      } catch (clipboardError) {
        console.warn('クリップボードコピー失敗:', clipboardError);
        Alert.alert('完了', '文章の修正が完了しました（クリップボードへのコピーに失敗しました）');
      }

      // 一時ファイルをクリーンアップ
      await recordingService.cleanup();
      setIsProcessing(false);
    } catch (error: any) {
      console.error('Recording error:', error);
      Alert.alert('エラー', error.message || '処理中にエラーが発生しました');
      setIsProcessing(false);
      await recordingService.cleanup();
    }
  };

  const handleCopyToClipboard = () => {
    if (correctedText) {
      Clipboard.setString(correctedText);
      Alert.alert('コピー完了', 'クリップボードにコピーしました');
    }
  };

  const theme = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            AnyVoice
          </ThemedText>
          {!apiKey && (
            <ThemedText type="default" style={styles.warning}>
              ⚠️ APIキーが設定されていません
            </ThemedText>
          )}
        </ThemedView>

        <ThemedView style={styles.recordingSection}>
          <TouchableOpacity
            style={[
              styles.recordButton,
              {
                backgroundColor: isRecording ? '#ff4444' : theme.tint,
                opacity: isProcessing ? 0.5 : 1,
              },
            ]}
            onPress={handleToggleRecording}
            disabled={isProcessing}>
            {isProcessing ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <IconSymbol
                name={isRecording ? 'mic.fill' : 'mic'}
                size={48}
                color="#fff"
              />
            )}
          </TouchableOpacity>
          <ThemedText type="default" style={styles.recordButtonLabel}>
            {isRecording
              ? '録音中... タップして停止'
              : isProcessing
              ? '処理中...'
              : 'タップして録音開始'}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.textSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            修正前テキスト
          </ThemedText>
          <ThemedView style={styles.textBox}>
            <ThemedText type="default" style={styles.textContent}>
              {originalText || '録音して文字起こしすると、ここに表示されます'}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.textSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            最終結果
          </ThemedText>
          <ThemedView style={styles.textBox}>
            <ThemedText type="default" style={styles.textContent}>
              {correctedText || '修正済みテキストがここに表示されます'}
            </ThemedText>
          </ThemedView>
          {correctedText && (
            <TouchableOpacity
              style={[styles.copyButton, { backgroundColor: theme.tint }]}
              onPress={handleCopyToClipboard}>
              <IconSymbol name="doc.on.clipboard" size={20} color="#fff" />
              <ThemedText
                type="defaultSemiBold"
                style={[styles.copyButtonText, { color: '#fff' }]}>
                クリップボードにコピー
              </ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
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
    alignItems: 'center',
  },
  title: {
    marginBottom: 10,
  },
  warning: {
    color: '#ff8800',
    marginTop: 10,
  },
  recordingSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recordButtonLabel: {
    textAlign: 'center',
  },
  textSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  textBox: {
    minHeight: 120,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  textContent: {
    lineHeight: 24,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    gap: 8,
  },
  copyButtonText: {
    // 色はインラインスタイルで動的に設定
  },
});
