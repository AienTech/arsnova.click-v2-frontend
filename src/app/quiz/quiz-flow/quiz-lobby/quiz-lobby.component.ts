import {Component, OnDestroy, OnInit, SecurityContext} from '@angular/core';
import {FooterBarService} from '../../../service/footer-bar.service';
import {HeaderLabelService} from '../../../service/header-label.service';
import {ThemesService} from '../../../service/themes.service';
import {HttpClient} from '@angular/common/http';
import {DefaultSettings} from '../../../../lib/default.settings';
import {ConnectionService} from '../../../service/connection.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {AttendeeService} from '../../../service/attendee.service';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {Router} from '@angular/router';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActiveQuestionGroupService} from '../../../service/active-question-group.service';
import {IMessage, INickname} from 'arsnova-click-v2-types/src/common';

@Component({
  selector: 'app-quiz-lobby',
  templateUrl: './quiz-lobby.component.html',
  styleUrls: ['./quiz-lobby.component.scss']
})
export class QuizLobbyComponent implements OnInit, OnDestroy {

  get qrCodeContent(): string {
    return this._qrCodeContent;
  }

  set qrCodeContent(value: string) {
    this._qrCodeContent = value;
  }

  get showQrCode(): boolean {
    return this._showQrCode;
  }

  set showQrCode(value: boolean) {
    this._showQrCode = value;
  }

  private _showQrCode = false;
  private _qrCodeContent = '';
  private _nickToRemove: string;
  private _kickMemberModalRef: NgbActiveModal;

  constructor(
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private currentQuizService: CurrentQuizService,
    private themesService: ThemesService,
    private router: Router,
    private http: HttpClient,
    private connectionService: ConnectionService,
    private sanitizer: DomSanitizer,
    public attendeeService: AttendeeService,
    private activeQuestionGroup: ActiveQuestionGroupService,
    private modalService: NgbModal
  ) {

    this.headerLabelService.headerLabel = this.currentQuizService.quiz.hashtag;

    if (this.currentQuizService.isOwner) {
      footerBarService.replaceFooterElements([
        this.footerBarService.footerElemEditQuiz,
        this.footerBarService.footerElemStartQuiz,
        this.footerBarService.footerElemProductTour,
        this.footerBarService.footerElemNicknames,
        this.footerBarService.footerElemSound,
        this.footerBarService.footerElemReadingConfirmation,
        this.footerBarService.footerElemTheme,
        this.footerBarService.footerElemFullscreen,
        this.footerBarService.footerElemQRCode,
        this.footerBarService.footerElemResponseProgress,
        this.footerBarService.footerElemConfidenceSlider,
      ]);
      this.qrCodeContent = `${document.location.origin}/quiz/${encodeURIComponent(this.currentQuizService.quiz.hashtag.toLowerCase())}`;
      this.footerBarService.footerElemStartQuiz.onClickCallback = () => {
        if (!this.attendeeService.attendees.length) {
          return;
        }
        const target = currentQuizService.quiz.sessionConfig.readingConfirmationEnabled ?
                       'reading-confirmation' : 'start';
        this.http.post(`${DefaultSettings.httpApiEndpoint}/quiz/${target}`, {
          quizName: this.currentQuizService.quiz.hashtag
        }).subscribe((data: IMessage) => {
          this.currentQuizService.readingConfirmationRequested = data.step === 'QUIZ:READING_CONFIRMATION_REQUESTED';
          this.router.navigate(['/quiz', 'flow', 'results']);
        });
      };
      this.footerBarService.footerElemQRCode.onClickCallback = () => {
        const classList = document.getElementsByClassName('qr-code-element').item(0).classList;
        classList.toggle('d-none');
        classList.toggle('d-flex');
      };
      this.footerBarService.footerElemEditQuiz.onClickCallback = () => {
        if (currentQuizService.quiz) {
          activeQuestionGroup.activeQuestionGroup = currentQuizService.quiz;
          currentQuizService.cleanUp();
          attendeeService.cleanUp();
          connectionService.cleanUp();
        }
        this.router.navigate(['/quiz', 'manager', 'overview']);
      };
    } else {
      footerBarService.replaceFooterElements([
        this.footerBarService.footerElemBack
      ]);
    }

    this.connectionService.initConnection().then(() => {
      if (this.currentQuizService.isOwner) {
        this.connectionService.authorizeWebSocketAsOwner(this.currentQuizService.quiz.hashtag);
      } else {
        this.connectionService.authorizeWebSocket(this.currentQuizService.quiz.hashtag);
      }
      this.handleMessages();
    });
  }

  private handleMessages() {
    if (!this.attendeeService.attendees.length) {
      this.connectionService.sendMessage({status: 'STATUS:SUCCESSFUL', step: 'LOBBY:GET_PLAYERS', payload: {
        quizName: this.currentQuizService.quiz.hashtag
      }});
    }
    this.connectionService.socket.subscribe((data: IMessage) => {
      switch (data.step) {
        case 'LOBBY:INACTIVE':
          setTimeout(this.handleMessages, 500);
          break;
        case 'LOBBY:ALL_PLAYERS':
          data.payload.members.forEach((elem: INickname) => {
            this.attendeeService.addMember(elem);
          });
          break;
        case 'MEMBER:ADDED':
          this.attendeeService.addMember(data.payload.member);
          break;
        case 'MEMBER:REMOVED':
          this.attendeeService.removeMember(data.payload.name);
          break;
      }
      this.currentQuizService.isOwner ? this.handleMessagesForOwner(data) : this.handleMessagesForAttendee(data);
    });
  }

  private handleMessagesForOwner(data: IMessage) {
    switch (data.step) {
      case 'LOBBY:ALL_PLAYERS':
        this.footerBarService.footerElemStartQuiz.isActive = !!this.attendeeService.attendees.length;
        break;
      case 'MEMBER:ADDED':
        this.footerBarService.footerElemStartQuiz.isActive = true;
        break;
      case 'MEMBER:REMOVED':
        if (!this.attendeeService.attendees.length) {
          this.footerBarService.footerElemStartQuiz.isActive = false;
        }
        break;
    }
  }

  private handleMessagesForAttendee(data: IMessage) {
    switch (data.step) {
      case 'QUIZ:NEXT_QUESTION':
        this.currentQuizService.questionIndex = data.payload.questionIndex;
        break;
      case 'QUIZ:START':
        this.router.navigate(['/quiz', 'flow', 'voting']);
        break;
      case 'QUIZ:READING_CONFIRMATION_REQUESTED':
        this.router.navigate(['/quiz', 'flow', 'reading-confirmation']);
        break;
      case 'MEMBER:REMOVED':
        const existingNickname = window.sessionStorage.getItem(`config.nick`);
        if (existingNickname === data.payload.name) {
          this.router.navigate(['/']);
        }
        break;
      case 'LOBBY:CLOSED':
        this.router.navigate(['/']);
        break;
    }
  }

  openKickMemberModal(content: string, name: string): void {
    this._kickMemberModalRef = this.modalService.open(content);
    this._nickToRemove = name;
  }

  kickMember(name: string): void {
    this._kickMemberModalRef.close();
    const quizName = this.currentQuizService.quiz.hashtag;
    this.http.delete(`${DefaultSettings.httpApiEndpoint}/member/${quizName}/${name}`)
        .subscribe(
          (data: IMessage) => {
            if (data.status !== 'STATUS:SUCCESSFUL') {
              console.log(data);
            }
          }
        );
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  transformForegroundColor(rgbObj: {r: string, g: string, b: string}): string {
    const o = Math.round(((parseInt(rgbObj.r, 10) * 299) + (parseInt(rgbObj.g, 10) * 587) + (parseInt(rgbObj.b, 10) * 114)) / 1000);
    return o < 125 ? 'ffffff' : '000000';
  }

  sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, `${value}`);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.footerBarService.footerElemStartQuiz.restoreClickCallback();
  }

}
