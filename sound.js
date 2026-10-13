// Campus Canteen Pro - Zero-Dependency Web Audio API Sound Synthesizer
class CanteenSoundEngine {
  constructor() {
    this.audioCtx = null;
    this.muted = false;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // Quick bubbly pop sound when adding dish to cart
  playPop() {
    if (this.muted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(840, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }

  // Melodic two-chord chime for placing an order successfully
  playOrderSuccess() {
    if (this.muted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);

        gain.gain.setValueAtTime(0.22, ctx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.09);
        osc.stop(ctx.currentTime + idx * 0.09 + 0.35);
      });
    } catch (e) {}
  }

  // Authentic double-bell dining counter ring for Kitchen order ready: "Ding-Dong!"
  playOrderReady() {
    if (this.muted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const bells = [
        { freq: 880, start: 0, dur: 0.5 },
        { freq: 1174.66, start: 0.16, dur: 0.7 }
      ];

      bells.forEach((b) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(b.freq, ctx.currentTime + b.start);

        gain.gain.setValueAtTime(0.3, ctx.currentTime + b.start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + b.start + b.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + b.start);
        osc.stop(ctx.currentTime + b.start + b.dur);
      });
    } catch (e) {}
  }

  // Subtle tap sound for buttons
  playTap() {
    if (this.muted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  }
}

const sounds = new CanteenSoundEngine();
