/**
 * Web Speech API helper for reading eBook recipes and texts aloud.
 */

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState = false;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isSupported(): boolean {
    return Boolean(this.synth);
  }

  public speak(
    text: string,
    lang: "es-ES" | "es-MX" | "pt-BR" | "en-US" = "es-ES",
    onEnd?: () => void,
    onError?: () => void
  ) {
    if (!this.synth) return;

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95; // comfortable reading speed
    utterance.pitch = 1.0;

    // Pick best matching voice if available
    const voices = this.synth.getVoices();
    const matchingVoice = voices.find((v) => v.lang.startsWith(lang.slice(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      this.isSpeakingState = true;
    };

    utterance.onend = () => {
      this.isSpeakingState = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeakingState = false;
      this.currentUtterance = null;
      if (onError) onError();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeakingState = false;
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return Boolean(this.synth && this.synth.speaking);
  }
}

export const speechService = new SpeechService();
