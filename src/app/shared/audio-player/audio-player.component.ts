import {AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {DefaultSettings} from '../../../lib/default.settings';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit, AfterViewInit {
  public static TYPE = 'AudioPlayerComponent';

  get randomUUID(): string {
    return this._randomUUID;
  }

  get loop(): boolean {
    return this._loop;
  }

  get volume(): number {
    return this._volume;
  }

  get apiUrl(): string {
    return this._apiUrl;
  }

  get src(): string {
    return this._src;
  }

  @Input()
  set loop(value: boolean) {
    if (typeof value === 'undefined') {
      value = true;
    }
    this._loop = value ? true : null;
  }

  @Input()
  set src(value: string) {
    this._src = value;
  }

  @Input()
  set original_volume(value: number) {
    this._original_volume = value;
    this._volume = this._original_volume;
    if (this.getAudioElement()) {
      this._audioElement.volume = this._volume / 100;
    }
  }

  @Input() private _original_volume: number;
  @Input() target: string;
  @Input() autostart: boolean;

  @Output() volumeChange = new EventEmitter();

  private _src: string;
  private _loop = true;
  private _apiUrl = `${DefaultSettings.httpApiEndpoint}/files/sound/`;
  private _volume = 1;
  private _randomUUID = `audio-player-${Math.random()}`;
  private _audioElement: HTMLAudioElement;
  private _isPlaying = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  private getAudioElement() {
    if (isPlatformBrowser(this.platformId) && !this._audioElement) {
      this._audioElement = <HTMLAudioElement>document.getElementById(this._randomUUID);
    }
    return this._audioElement;
  }

  playMusic() {
    this.getAudioElement();
    if (this._audioElement.ended) {
      this._audioElement.currentTime = 0;
    }
    this._audioElement.play();
    this._isPlaying = true;
  }

  pauseMusic() {
    this.getAudioElement();
    this._audioElement.pause();
    this._isPlaying = false;
  }

  stopMusic() {
    this.getAudioElement();
    this._audioElement.pause();
    this._audioElement.currentTime = 0;
    this._isPlaying = false;
  }

  isStopped(): boolean {
    if (!this.getAudioElement()) {
      return true;
    }
    return (!this._audioElement.currentTime && this._audioElement.paused) || this._audioElement.ended;
  }

  emitVolumeChange($event) {
    this._volume = parseInt((<HTMLInputElement>$event.target).value, 10);
    this.volumeChange.emit(this._volume);
    this.getAudioElement();
    this._audioElement.volume = this._volume / 100;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.getAudioElement();
    this._audioElement.volume = this._volume / 100;
  }

}
