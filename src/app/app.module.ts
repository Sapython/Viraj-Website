import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import {
  provideAnalytics,
  getAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideAuth, getAuth, setPersistence, browserLocalPersistence } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { connectFirestoreEmulator } from '@firebase/firestore';
import { AuthenticationService } from './services/authentication.service';
import { DatabaseService } from './services/database.service';
import { DataProvider } from './providers/data.provider';
import { UserDataService } from './services/user-data.service';
import { AlertsAndNotificationsService } from './services/uiService/alerts-and-notifications.service';
import { BlurSiteService } from './services/blur-site.service';
import { DateService } from './services/date.service';
import { VoiceRecognitionService } from './services/voice-recognition.service';
@NgModule({
  declarations: [AppComponent,],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideFirestore(() => getFirestore()),
    provideAuth(() => {
      const auth = getAuth();
      setPersistence(auth, browserLocalPersistence);
      return auth;
    }),
    provideFunctions(() => getFunctions()),
    providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),
    BrowserAnimationsModule,
    MatSnackBarModule,
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    AuthenticationService,
    DatabaseService,
    DataProvider,
    UserDataService,
    AlertsAndNotificationsService,
    BlurSiteService,
    DateService,
    VoiceRecognitionService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
