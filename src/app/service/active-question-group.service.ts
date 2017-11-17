import {Injectable} from '@angular/core';
import {questionGroupReflection} from 'arsnova-click-v2-types/src/questions/questionGroup_reflection';
import {IQuestionGroup} from 'arsnova-click-v2-types/src/questions/interfaces';
import {SettingsService} from './settings.service';
import {FooterBarService} from './footer-bar.service';
import {TranslateService} from '@ngx-translate/core';
import {DefaultSettings} from '../../lib/default.settings';

@Injectable()
export class ActiveQuestionGroupService {

  get activeQuestionGroup(): IQuestionGroup {
    return this._activeQuestionGroup;
  }

  set activeQuestionGroup(value: IQuestionGroup) {
    this._activeQuestionGroup = value;
    if (value) {
      this.updateFooterElementsState();
      this.persistForSession();
    }
  }

  private _activeQuestionGroup: IQuestionGroup;

  constructor(
    private translateService: TranslateService,
    private footerBarService: FooterBarService,
    private settingsService: SettingsService
  ) {
    if (window.sessionStorage.getItem('config.active_question_group')) {
      const serializedObject = window.sessionStorage.getItem('config.active_question_group');
      const parsedObject = JSON.parse(serializedObject);
      this.activeQuestionGroup = questionGroupReflection[parsedObject.TYPE](parsedObject);
    }
  }

  private dec2hex(dec) {
    return ('0' + dec.toString(16)).substr(-2);
  }

  public generatePrivateKey(length?: number) {
    const arr = new Uint8Array((length || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, this.dec2hex).join('');
  }

  public cleanUp(): void {
    this.activeQuestionGroup = null;
    window.sessionStorage.removeItem('config.active_question_group');
  }

  persistForSession() {
    window.sessionStorage.setItem('config.active_question_group', JSON.stringify(this.activeQuestionGroup.serialize()));
  }

  persist() {
    this.persistForSession();
    window.localStorage.setItem(this.activeQuestionGroup.hashtag, JSON.stringify(this.activeQuestionGroup.serialize()));
    const questionList = JSON.parse(window.localStorage.getItem('config.owned_quizzes')) || [];
    if (questionList.indexOf(this.activeQuestionGroup.hashtag) === -1) {
      questionList.push(this.activeQuestionGroup.hashtag);
      window.localStorage.setItem('config.owned_quizzes', JSON.stringify(questionList));
    }
  }


  public updateFooterElementsState() {
    if (this.activeQuestionGroup) {
      if (this.activeQuestionGroup.sessionConfig.nicks.restrictToCasLogin) {
        this.footerBarService.footerElemEnableCasLogin.isActive = true;
      }
      if (this.activeQuestionGroup.sessionConfig.nicks.blockIllegalNicks) {
        this.footerBarService.footerElemBlockRudeNicknames.isActive = true;
      }
      if (window.localStorage.getItem('config.cache_assets') === 'true') {
        this.footerBarService.footerElemSaveAssets.isActive = true;
      }
      this.footerBarService.footerElemEnableCasLogin.onClickCallback = () => {
        const newState = !this.footerBarService.footerElemEnableCasLogin.isActive;
        this.footerBarService.footerElemEnableCasLogin.isActive = newState;
        this.activeQuestionGroup.sessionConfig.nicks.restrictToCasLogin = newState;
        this.persist();
      };
      this.footerBarService.footerElemBlockRudeNicknames.onClickCallback = () => {
        const newState = !this.footerBarService.footerElemBlockRudeNicknames.isActive;
        this.footerBarService.footerElemBlockRudeNicknames.isActive = newState;
        this.activeQuestionGroup.sessionConfig.nicks.blockIllegalNicks = newState;
        this.persist();
      };
      this.footerBarService.footerElemSaveAssets.onClickCallback = () => {
        const newState = !this.footerBarService.footerElemSaveAssets.isActive;
        this.footerBarService.footerElemSaveAssets.isActive = newState;
        this.settingsService.serverSettings.cacheQuizAssets = newState;
        window.localStorage.setItem('config.cache_assets', `${newState}`);
      };
      this.footerBarService.footerElemExport.onClickCallback = () => {
        const link = `${DefaultSettings.httpApiEndpoint}/quiz/export/${this.activeQuestionGroup.hashtag}/${window.localStorage.getItem(
          'config.private_key')}/${this.activeQuestionGroup.sessionConfig.theme}/${this.translateService.currentLang}`;
        window.open(link);
      };
    }
  }
}
