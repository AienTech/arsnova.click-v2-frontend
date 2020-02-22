import { LoginMechanism, Title } from '../app/lib/enums/enums';
import { QuizTheme } from '../app/lib/enums/QuizTheme';
import { IEnvironment } from '../app/lib/interfaces/IEnvironment';

export const environment: IEnvironment = {
  production: false,
  title: Title.Default,
  version: 'VERSION',
  enableCasLogin: true,
  sentryDSN: 'https://f16c02fdefe64c018f5d580d1cf05b56@sentry.io/1819496',
  ssrEndpoint: 'http://localhost:4000',
  serverEndpoint: 'http://localhost:3010',
  httpApiEndpoint: 'http://localhost:3010/api/v1',
  httpLibEndpoint: 'http://localhost:3010/lib',
  stompConfig: {
    endpoint: 'ws://127.0.0.1:15674/ws',
    user: 'arsnova-click',
    password: 'K3BHZQMHsxh6XQ5a',
    vhost: '/',
  },
  leaderboardAmount: 5,
  readingConfirmationEnabled: false,
  confidenceSliderEnabled: false,
  infoAboutTabEnabled: true,
  infoProjectTabEnabled: true,
  infoBackendApiEnabled: true,
  requireLoginToCreateQuiz: false,
  forceQuizTheme: false,
  loginMechanism: [LoginMechanism.UsernamePassword],
  showJoinableQuizzes: true,
  showPublicQuizzes: true,
  persistQuizzes: true,
  availableQuizThemes: [
    QuizTheme.Material,
    QuizTheme.ArsnovaDotClickContrast,
    QuizTheme.Blackbeauty,
    QuizTheme.Elegant,
    QuizTheme.DecentBlue,
    QuizTheme.MaterialHope,
    QuizTheme.MaterialBlue,
    QuizTheme.SpiritualPurple,
    QuizTheme.GreyBlueLime,
  ],
  defaultTheme: QuizTheme.Material,
  darkModeCheckEnabled: true,
  enableTwitter: true,
};

export enum DEVICE_TYPES {
  XS, SM, MD, LG, XLG
}

export enum LIVE_PREVIEW_ENVIRONMENT {
  ANSWEROPTIONS, QUESTION
}
