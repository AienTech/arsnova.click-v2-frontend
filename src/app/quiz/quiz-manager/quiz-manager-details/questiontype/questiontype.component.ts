import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActiveQuestionGroupService} from '../../../../service/active-question-group.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {FooterBarService} from '../../../../service/footer-bar.service';
import {Subscription} from 'rxjs/Subscription';
import {questionReflection} from '../../../../../lib/questions/question_reflection';
import {IQuestion} from '../../../../../lib/questions/interfaces';

@Component({
  selector: 'app-questiontype',
  templateUrl: './questiontype.component.html',
  styleUrls: ['./questiontype.component.scss']
})
export class QuestiontypeComponent implements OnInit, OnDestroy {
  get questionTypes(): Array<IQuestion> {
    return this._questionTypes;
  }

  private _routerSubscription: Subscription;
  private _question: IQuestion;
  private _questionIndex: number;
  private _questionTypes: Array<IQuestion> = [];
  private _questionType: string;

  constructor(
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private footerBarService: FooterBarService) {
    this.footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
      this.footerBarService.footerElemNicknames,
      this.footerBarService.footerElemSaveAssets,
      this.footerBarService.footerElemProductTour
    ]);
    for (const type in questionReflection) {
      if (questionReflection.hasOwnProperty(type)) {
        this._questionTypes.push(questionReflection[type]({}));
      }
    }
  }

  isActiveQuestionType(type) {
    return type === this._questionType;
  }

  morphToQuestionType(type) {
    this._question = questionReflection[type](this._question.serialize());
    this._questionType = type;
    this.activeQuestionGroupService.activeQuestionGroup.removeQuestion(this._questionIndex);
    this.activeQuestionGroupService.activeQuestionGroup.addQuestion(this._question, this._questionIndex);
    this.activeQuestionGroupService.persist();
  }

  ngOnInit() {
    this._routerSubscription = this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
      this._question = this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex];
      this._questionType = this._question.TYPE;
    });
  }

  ngOnDestroy() {
    this._routerSubscription.unsubscribe();
  }

}
