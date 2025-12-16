import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export class RecordingService {
  private recording: Audio.Recording | null = null;
  private audioUri: string | null = null;

  /**
   * 録音を開始
   */
  async startRecording(): Promise<void> {
    try {
      // マイクの権限をリクエスト
      const permissionResponse = await Audio.requestPermissionsAsync();
      if (!permissionResponse.granted) {
        throw new Error('マイクの権限が許可されていません');
      }

      // オーディオモードを設定
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // 録音を開始（M4A形式で保存）
      const { recording } = await Audio.Recording.createAsync(
        {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
          android: {
            extension: '.m4a',
            outputFormat: Audio.AndroidOutputFormat.MPEG_4,
            audioEncoder: Audio.AndroidAudioEncoder.AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
          ios: {
            extension: '.m4a',
            outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
            audioQuality: Audio.IOSAudioQuality.HIGH,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
          web: {
            mimeType: 'audio/mp4',
            bitsPerSecond: 128000,
          },
        }
      );

      this.recording = recording;
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  /**
   * 録音を停止してファイルURIを返す
   */
  async stopRecording(): Promise<string> {
    if (!this.recording) {
      throw new Error('録音が開始されていません');
    }

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      
      if (!uri) {
        throw new Error('録音ファイルのURIを取得できませんでした');
      }

      // Webブラウザの場合は、blob URIをそのまま使用
      // ネイティブアプリの場合は、一時ディレクトリにコピー
      const isWeb = typeof window !== 'undefined' && uri.startsWith('blob:');
      
      if (isWeb) {
        // Webブラウザではblob URIをそのまま使用
        this.audioUri = uri;
      } else {
        // ネイティブアプリでは一時ディレクトリにコピー
        const fileName = `recording_${Date.now()}.m4a`;
        const documentDir = (FileSystem as any).documentDirectory;
        const fileUri = documentDir ? `${documentDir}${fileName}` : uri;
        
        if (documentDir && fileUri !== uri) {
          try {
            await FileSystem.copyAsync({
              from: uri,
              to: fileUri,
            });
            this.audioUri = fileUri;
          } catch (error) {
            // コピーに失敗した場合は元のURIを使用
            console.warn('Failed to copy file, using original URI:', error);
            this.audioUri = uri;
          }
        } else {
          // documentDirectoryが利用できない場合は元のURIを使用
          this.audioUri = uri;
        }
      }

      this.recording = null;

      return this.audioUri;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      throw error;
    }
  }

  /**
   * 録音中かどうかを確認
   */
  isRecording(): boolean {
    return this.recording !== null;
  }

  /**
   * 録音をクリーンアップ
   */
  async cleanup(): Promise<void> {
    if (this.recording) {
      try {
        await this.recording.stopAndUnloadAsync();
      } catch (error) {
        console.error('Error cleaning up recording:', error);
      }
      this.recording = null;
    }

    // 一時ファイルを削除
    if (this.audioUri) {
      try {
        await FileSystem.deleteAsync(this.audioUri, { idempotent: true });
      } catch (error) {
        console.error('Error deleting audio file:', error);
      }
      this.audioUri = null;
    }
  }
}

