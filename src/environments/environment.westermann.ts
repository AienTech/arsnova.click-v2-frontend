import { LoginMechanism, Title } from '../app/lib/enums/enums';
import { QuizTheme } from '../app/lib/enums/QuizTheme';
import { IEnvironment } from '../app/lib/interfaces/IEnvironment';

export const environment: IEnvironment = {
  production: true,
  title: Title.Westermann,
  version: '__VERSION__',
  serverEndpoint: '/backend',
  stompConfig: {
    endpoint: '/rabbitmq/ws',
    user: 'arsnova-click',
    password: 'K3BHZQMHsxh6XQ5a',
    vhost: '/',
  },
  leaderboardAmount: 5,
  enableBonusToken: false,
  readingConfirmationEnabled: false,
  confidenceSliderEnabled: false,
  infoAboutTabEnabled: false,
  infoProjectTabEnabled: false,
  infoBackendApiEnabled: false,
  requireLoginToCreateQuiz: true,
  forceQuizTheme: true,
  loginMechanism: [LoginMechanism.UsernamePassword, LoginMechanism.Token],
  showLoginButton: true,
  showJoinableQuizzes: false,
  showPublicQuizzes: false,
  persistQuizzes: false,
  availableQuizThemes: [QuizTheme.WestermannBlue, QuizTheme.Blackbeauty],
  defaultTheme: QuizTheme.WestermannBlue,
  darkModeCheckEnabled: false,
  enableTwitter: false,
  enableQuizPool: false,
  showInfoButtonsInFooter: true,
  vapidPublicKey: 'BFy8kQxiV2p43Z8Xqs6isn7QRVDEvkqreDH3wH0QlDLDn8cZkbM41iOWwxUBsw_R0Y4Bv8AkI9sKj82P18q41z0',
  markdownFilePostfix: 'westermann',
  loginButtonLabelConfiguration: 'login',
};
