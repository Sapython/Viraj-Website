import { Injectable } from '@angular/core';
import {
  Firestore,
  DocumentReference,
  doc,
  getDoc,
  docData,
} from '@angular/fire/firestore';
import {
  Auth,
  authState,
  signInAnonymously,
  signOut,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  UserCredential,
  GithubAuthProvider,
} from '@angular/fire/auth';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertsAndNotificationsService } from './uiService/alerts-and-notifications.service';
import { UserDataService } from './user-data.service';
import { DataProvider } from '../providers/data.provider';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  userDoc: DocumentReference | undefined;
  checkerUserDoc: DocumentReference | undefined;
  private loggedIn: boolean = false;
  constructor(
    private auth: Auth,
    private userData: UserDataService,
    private alertify: AlertsAndNotificationsService,
    private firestore: Firestore,
    private router: Router,
    private dataProvider: DataProvider
  ) {
    if (auth) {
      // console.log("Auth is not null");
      this.user = authState(this.auth);
      this.setDataObserver(this.user);
      this.userDisposable = authState(this.auth)
        .pipe(map((u) => !!u))
        .subscribe((isLoggedIn) => {
          this.loggedIn = isLoggedIn;
          this.dataProvider.loggedIn = isLoggedIn;
        });
    } else {
      this.loggedIn = false;
      this.dataProvider.loggedIn = false;
      console.log('Auth is null');
    }
  }
  private userServerSubscription: Subscription | undefined = undefined;
  private readonly userDisposable: Subscription | undefined;
  public readonly user: Observable<User | null> = EMPTY;

  // Read functions start
  public get isLoggedIn(): boolean {
    return this.loggedIn;
  }

  public get getUser(): Observable<User | null> {
    return this.user;
  }
  // Read functions end
  // Sign in functions start
  public signInWithGoogle() {
    this.dataProvider.pageSetting.blur = true;
    this.dataProvider.pageSetting.lastRedirect = '';
    let data = signInWithPopup(this.auth, new GoogleAuthProvider())
      .then(async (credentials: UserCredential) => {
        if (
          !(
            await getDoc(doc(this.firestore, 'users/' + credentials.user.uid))
          ).exists()
        ) {
          if (credentials.user.phoneNumber == null) {
            await this.userData.setGoogleUserData(credentials.user, {
              phoneNumber: '',
            });
          } else {
            await this.userData.setGoogleUserData(credentials.user, {
              phoneNumber: credentials.user.phoneNumber,
            });
          }
        } else {
          this.dataProvider.pageSetting.blur = false;
          this.alertify.presentToast('You have logged in.', 'info', 5000);
          this.router.navigate(['']);
        }
      })
      .catch((error) => {
        this.dataProvider.pageSetting.blur = false;
        if (error.code === 'auth/popup-closed-by-user') {
          this.alertify.presentToast('Login cancelled.', 'error', 5000);
        } else {
          this.alertify.presentToast(error.message, 'error', 5000);
        }
      });
  }
  public signInWithFacebook() {
    this.dataProvider.pageSetting.blur = true;
    this.dataProvider.pageSetting.lastRedirect = '';
    let data = signInWithPopup(this.auth, new FacebookAuthProvider())
      .then(async (credentials: UserCredential) => {
        console.log(credentials);
        // if (!(await getDoc(doc(this.firestore,'users/'+credentials.user.uid))).exists()){
        //   if (credentials.user.phoneNumber == null){
        //     await this.userData.setGoogleUserData(credentials.user,{phoneNumber:''});
        //   } else {
        //     await this.userData.setGoogleUserData(credentials.user,{phoneNumber:credentials.user.phoneNumber});
        //   }
        // } else {
        //   this.dataProvider.pageSetting.blur = false;
        //   this.alertify.presentToast('Logging you in.','info',5000);
        //   this.router.navigate(['']);
        // }
      })
      .catch((error) => {
        this.dataProvider.pageSetting.blur = false;
        if (error.code === 'auth/popup-closed-by-user') {
          this.alertify.presentToast('Login cancelled.', 'error', 5000);
        } else {
          this.alertify.presentToast(error.message, 'error', 5000);
        }
      });
  }
  public signInWithGithub() {
    this.dataProvider.pageSetting.blur = true;
    this.dataProvider.pageSetting.lastRedirect = '';
    let data = signInWithPopup(this.auth, new GithubAuthProvider())
      .then(async (credentials: UserCredential) => {
        console.log(credentials);
        // if (!(await getDoc(doc(this.firestore,'users/'+credentials.user.uid))).exists()){
        //   if (credentials.user.phoneNumber == null){
        //     await this.userData.setGoogleUserData(credentials.user,{phoneNumber:''});
        //   } else {
        //     await this.userData.setGoogleUserData(credentials.user,{phoneNumber:credentials.user.phoneNumber});
        //   }
        // } else {
        //   this.dataProvider.pageSetting.blur = false;
        //   this.alertify.presentToast('Logging you in.','info',5000);
        //   this.router.navigate(['']);
        // }
      })
      .catch((error) => {
        this.dataProvider.pageSetting.blur = false;
        if (error.code === 'auth/popup-closed-by-user') {
          this.alertify.presentToast('Login cancelled.', 'error', 5000);
        } else {
          this.alertify.presentToast(error.message, 'error', 5000);
        }
      });
  }
  public async loginAnonymously() {
    let data = signInAnonymously(this.auth).then(
      (credentials: UserCredential) => {
        console.log('Credentials', credentials);
      }
    );
    // this.router.navigate(['']);
  }

  public async loginEmailPassword(email: string, password: string) {
    this.dataProvider.pageSetting.blur = true;
    this.dataProvider.pageSetting.lastRedirect = '';
    let data = await signInWithEmailAndPassword(this.auth, email, password)
      .then((credentials: UserCredential) => {
        this.router.navigate(['']);
        this.dataProvider.pageSetting.blur = false;
      })
      .catch((error) => {
        this.dataProvider.pageSetting.blur = false;
        if (error.code === 'auth/user-not-found') {
          this.alertify.presentToast('User not found.', 'error', 5000);
        } else if (error.code === 'auth/wrong-password') {
          this.alertify.presentToast('Wrong password.', 'error', 5000);
        } else {
          this.alertify.presentToast(error.message, 'error', 5000);
        }
      });
    this.dataProvider.pageSetting.blur = false;
  }
  public signUpWithEmailAndPassword(
    email: string,
    password: string,
    username: string
  ) {
    console.log('Signing Up');
    this.dataProvider.pageSetting.blur = true;
    this.dataProvider.pageSetting.lastRedirect = '';
    let data = createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (credentials: UserCredential) => {
        await this.userData.setEmailUserData(credentials.user, {
          displayName: username,
          phoneNumber: '',
          photoURL: '',
        });
      })
      .catch((error) => {
        this.dataProvider.pageSetting.blur = false;
        if (error.code === 'auth/weak-password') {
          this.alertify.presentToast('Password is weak.', 'error', 5000);
        } else if (error.code === 'auth/email-already-in-use') {
          this.alertify.presentToast('Email already in use.', 'error', 5000);
        } else {
          this.alertify.presentToast(error.message, 'error', 5000);
        }
      });
  }
  // Sign in functions end
  // Sign out functions start
  public async logout() {
    if (confirm('Are you sure you want to logout?')){
      this.alertify.presentToast('You have been logged out.')
      return await signOut(this.auth);
    }
  }
  private setDataObserver(user: Observable<User | null>) {
    // console.log('Starting data observer')
    if (user) {
      // console.log('Setting data observer')
      user.subscribe((u) => {
        if (u) {
          // alert('User logged in');
          this.dataProvider.loggedIn = true;
          this.dataProvider.gettingUserData = true;
          this.dataProvider.userID = u.uid;
          // console.log('User is logged in')
          this.userDoc = doc(this.firestore, 'users/' + u.uid);
          if (this.userServerSubscription != undefined) {
            this.userServerSubscription.unsubscribe();
          }
          if (u.isAnonymous) {
            this.dataProvider.gettingUserData = false;
          } else {
            this.userServerSubscription = docData(this.userDoc).subscribe(
              (data: any) => {
                this.dataProvider.userData = data;
                this.dataProvider.gettingUserData = false;
              }
            );
          }
        }
      });
    } else {
      if (this.userServerSubscription != undefined) {
        this.userServerSubscription.unsubscribe();
      }
    }
  }
}
