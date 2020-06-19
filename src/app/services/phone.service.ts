import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { FirebaseX } from "@ionic-native/firebase-x/ngx";

@Injectable({
  providedIn: 'root'
})
export class PhoneService {

  constructor(
    private FireBase: FirebaseX
  ) { }

//   sendSmsVerification(phoneNumber): Promise <firebase.auth.UserCredential> {
//     return new Promise((resolve, reject) => {
//         firebase.auth().useDeviceLanguage();
//         var verificationId;
//         var code;
//         const timeOutDuration = 60;
//         const tell = '+54' + phoneNumber;
//         FirebasePlugin.verifyPhoneNumber(tell, timeOutDuration).then(async (credential) => {
//             // alert(credential.instantVerification);
//             if (credential.verificationId) {
//                 console.log("Android credential: ", credential);
//                 verificationId = credential.verificationId;
//             } else {
//                 console.log("iOS credential: ", credential);
//                 verificationId = credential;
//             }
//             if (credential.instantVerification) {
//                 code = credential.code;
//                 this.verifySms(verificationId, code)
//                 .then( resp => {
//                     resolve(resp);
//                 })
//                 .catch( err => {
//                     reject(err);
//                 });
//             } else {
//                 let prompt = await this.alertCtrl.create({
//                     backdropDismiss: false,
//                     header: 'Ingrese el codigo de confirmación del SMS.',
//                     inputs: [{ name: 'confirmationCode', placeholder: 'Código de confirmación' }],
//                     buttons: [
//                         { text: 'Cancelar',
//                         handler: data => { 
//                             console.log('Cancel clicked');
//                             resolve(data);
//                         }
//                         },
//                         { text: 'Verificar',
//                         handler: data => {
//                             code = data.confirmationCode; 
//                             this.verifySms(verificationId,code)
//                             .then( resp => {
//                                 resolve(resp);
//                             })
//                             .catch( err => {
//                                 reject(err);
//                             });                            
//                           }
//                         }
//                     ]
//                 });
//                 prompt.present();
//             }
//         }).catch(error => {
//             console.log('Error! Catch SMSVerificacion', error);
//             reject(error);
//         });
//     })
// }
}