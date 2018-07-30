import { HttpClientModule } from '@angular/common/http';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { jwtOptionsFactory } from '../../../lib/jwt.factory';
import { SharedModule } from '../../shared/shared.module';
import { IndexedDbService } from '../storage/indexed.db.service';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';
import { UserService } from '../user/user.service';

import { CasLoginService } from './cas-login.service';

describe('CasLoginService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [StorageService],
          },
        }), SharedModule, RouterTestingModule, HttpClientModule,
      ],
      providers: [
        IndexedDbService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, UserService, CasLoginService,
      ],
    });
  }));

  it('should be created', async(inject([CasLoginService], (service: CasLoginService) => {
    expect(service).toBeTruthy();
  })));
});
