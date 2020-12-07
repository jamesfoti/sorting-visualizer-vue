import * as Tone from 'tone'

export default class AudioManager {
    constructor() {
        console.log("Audio Manager Instance Constructed!");
        this.isMute = false;
        this.sortedFreq = 440.00; // Notes: https://pages.mtu.edu/~suits/notefreqs.html
        this.scanningFreq = 146.83;
        this.secondScanningFreq = 100;
        this.freqIncrementScale = 10;
        this.soundDuration = "5hz"; // https://github.com/Tonejs/Tone.js/wiki/Time

        // Instruments
        this.sortedSynth = new Tone.AMSynth().toDestination();
        this.scanningSynth = new Tone.AMSynth().toDestination();
        this.secondScanningSynth = new Tone.AMSynth().toDestination();
        this.sortedSynth.volume.value = -15;
        this.scanningSynth.volume.value = -15;
        this.secondScanningSynth.volume.value = -15;
    }

    playSortedSound(freqIncrement) {
        if (this.isMute) return;
        let frequency = this.sortedFreq + (freqIncrement * this.freqIncrementScale);
        this.sortedSynth.triggerAttackRelease(frequency, this.soundDuration, Tone.now());
    }

    playScanningSound(freqIncrement) {
        if (this.isMute) return;
        let frequency = this.scanningFreq + (freqIncrement * this.freqIncrementScale);
        this.scanningSynth.triggerAttackRelease(frequency, this.soundDuration, Tone.now());
    }

    play2ndScanningSound(freqIncrement) {
        console.log("2nd Scanning Sound Playing!");
        if (this.isMute) return;
        let frequency = this.scanningFreq + (freqIncrement * this.freqIncrementScale);
        this.secondScanningSynth.triggerAttackRelease(frequency, this.soundDuration, Tone.now());
    }
}