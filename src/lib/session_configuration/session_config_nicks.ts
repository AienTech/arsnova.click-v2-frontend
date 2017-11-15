import {DefaultSettings} from '../default.settings';
import {INickSessionConfiguration} from './interfaces';

export class NickSessionConfiguration implements INickSessionConfiguration {
  get selectedNicks(): Array<string> {
    return this._selectedNicks;
  }

  set selectedNicks(value: Array<string>) {
    this._selectedNicks = value;
  }

  get blockIllegalNicks(): boolean {
    return this._blockIllegalNicks;
  }

  set blockIllegalNicks(value: boolean) {
    this._blockIllegalNicks = value;
  }

  get restrictToCasLogin(): boolean {
    return this._restrictToCasLogin;
  }

  set restrictToCasLogin(value: boolean) {
    this._restrictToCasLogin = value;
  }

  private _selectedNicks: Array<string>;
  private _blockIllegalNicks: boolean;
  private _restrictToCasLogin: boolean;

  constructor({
    selectedNicks = Array<string>(),
    blockIllegalNicks = DefaultSettings.defaultSettings.nicks.blockIllegalNicks,
    restrictToCasLogin = DefaultSettings.defaultSettings.nicks.restrictToCasLogin
  }) {
    this.selectedNicks = selectedNicks;
    this.blockIllegalNicks = blockIllegalNicks;
    this.restrictToCasLogin = restrictToCasLogin;
  }

  serialize(): Object {
    return {
      selectedNicks: this.selectedNicks,
      blockIllegalNicks: this.blockIllegalNicks,
      restrictToCasLogin: this.restrictToCasLogin
    };
  }

  equals(value: INickSessionConfiguration): boolean {
    return this.selectedNicks === value.selectedNicks &&
           this.blockIllegalNicks === value.blockIllegalNicks &&
           this.restrictToCasLogin === value.restrictToCasLogin;
  }

  hasSelectedNick(nickname: string): boolean {
    return this.selectedNicks.indexOf(nickname) !== -1;
  }

  toggleSelectedNick(nickname: string): void {
    if (this.hasSelectedNick(nickname)) {
      this.removeSelectedNickByName(nickname);
    } else {
      this.addSelectedNick(nickname);
    }
  }

  addSelectedNick(newSelectedNick: string): void {
    if (this.hasSelectedNick(newSelectedNick)) {
      return;
    }
    this.selectedNicks.push(newSelectedNick);
  }

  removeSelectedNickByName(selectedNick: string): void {
    const index = this.selectedNicks.indexOf(selectedNick);
    if (index === -1) {
      return;
    }
    this.selectedNicks.splice(index, 1);
  }
}
