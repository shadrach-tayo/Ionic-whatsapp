import { BroadcastComponent } from './component/broadcast/broadcast.component';
import { AudioService } from './services/audio.service';
import { WebrtcService } from './services/webrtc.service';
import { GroupoptComponent } from './component/groupopt/groupopt.component';
import { ImageService } from './services/image.service';
import { UserService } from './services/user.service';
import { ChatmoreComponent } from './component/chatmore/chatmore.component';
import { StatusService } from './services/status.service';
import { EventService } from './services/event.service';
import { ChatService } from './services/chat.service';
import { LoadingService } from './services/loading.service';
import { LoginService } from './services/login.service';
import { AlertService } from './services/alert.service';
import { PhoneService } from './services/phone.service';
import { SettingComponent } from './component/setting/setting.component';
import { CameraPageModule } from './pages/camera/camera.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SuperTabs } from '@ionic-super-tabs/angular';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { CallPageModule } from './pages/call/call.module';
import { ChatPageModule } from './pages/chat/chat.module';
import { StatusPageModule } from './pages/status/status.module';

// firebase autheentication module 
import { AngularFireModule } from '@angular/fire'
import { AngularFireAuthModule, } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment.prod';
import * as firebase from 'firebase';
import { DataService } from './services/data.service';
import { Camera } from '@ionic-native/camera/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Network } from '@ionic-native/network/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { IonicHeaderParallaxModule } from 'ionic-header-parallax';
import { Media } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
// import Peer from 'peerjs';
import { CallNumber } from '@ionic-native/call-number/ngx';




// for the camera site user to be provider
firebase.initializeApp(environment.firebaseConfig)
@NgModule({
  declarations: [AppComponent, SettingComponent, ChatmoreComponent, GroupoptComponent, BroadcastComponent],
  entryComponents: [],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    BrowserModule,
    IonicHeaderParallaxModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SuperTabsModule.forRoot(),
    CallPageModule,
    ChatPageModule,
    StatusPageModule,
    CameraPageModule,
  ],
  providers: [
    AngularFireAuthModule,
    AngularFireModule,
    AngularFireAuth,
    PhoneService,
    AlertService,
    LoginService,
    WebrtcService,
    AudioService,
    // Peer,
    UserService,
    Base64,
    ChatService,
    Media,
    NativeAudio,
    CallNumber,
    File,
    StreamingMedia,
    ImageService,
    FileChooser,
    FilePath,
    FileOpener,
    EventService,
    StatusService,
    LoadingService,
    DataService,
    StatusBar,
    Camera,
    Network,
    SocialSharing,
    SplashScreen,
    SuperTabs,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
