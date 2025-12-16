
const OPENAI_API_BASE = 'https://api.openai.com/v1';

export interface TranscriptionResponse {
  text: string;
}

export interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class OpenAIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Whisper APIを使用して音声を文字起こし
   */
  async transcribeAudio(audioUri: string, language: string = 'ja'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('APIキーが設定されていません');
    }

    try {
      // Webブラウザとネイティブアプリで処理を分ける
      const isWeb = typeof window !== 'undefined' && audioUri.startsWith('blob:');
      
      const formData = new FormData();
      
      if (isWeb) {
        // Webブラウザの場合: blob URIからBlobを取得
        const response = await fetch(audioUri);
        const blob = await response.blob();
        formData.append('file', blob, 'audio.m4a');
      } else {
        // React Nativeの場合: uri形式でファイルを指定
        formData.append('file', {
          uri: audioUri,
          type: 'audio/m4a',
          name: 'audio.m4a',
        } as any);
      }
      
      formData.append('model', 'whisper-1');
      formData.append('language', language);

      const response = await fetch(`${OPENAI_API_BASE}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          // Content-TypeはFormDataを使用する場合、自動設定されるため指定しない
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('APIエラーレスポンス:', errorText);
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { error: { message: `Unknown error: ${response.status}` } };
        }
        throw new Error(error.error?.message || `API error: ${response.status}`);
      }

      const data: TranscriptionResponse = await response.json();
      return data.text;
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }

  /**
   * GPT APIを使用して文章を修正
   */
  async correctText(text: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('APIキーが設定されていません');
    }

    try {
      const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // gpt-5-miniはまだ存在しないため、gpt-4o-miniを使用
          messages: [
            {
              role: 'system',
              content: 'あなたは文章を自然で正確な日本語に修正するアシスタントです。入力されたテキストを、文法や表現を改善して自然な文章に修正してください。',
            },
            {
              role: 'user',
              content: `以下のテキストを自然な文法に修正してください：\n\n${text}`,
            },
          ],
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
        throw new Error(error.error?.message || `API error: ${response.status}`);
      }

      const data: ChatCompletionResponse = await response.json();
      return data.choices[0]?.message?.content || text;
    } catch (error) {
      console.error('Text correction error:', error);
      throw error;
    }
  }
}

