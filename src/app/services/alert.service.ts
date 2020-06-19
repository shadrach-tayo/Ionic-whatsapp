import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';


// this handel for the error massage outout
const errorMessages = {
  // Alert Service
  // This is the Service class for most of the success and error messages in the app.
  // i control the all alert in this content 
  // Firebase Error Messages
  // for the error connection failed

  connectionFailed: {
    header: "Connection failed",
    message: "A network error such as timeout, interrupted connection or unreachable."
  },
  invalideNumber: {
    header: "Invalide",
    messages: "The SMS verification code used to create the phone auth credential is invalid. Resend the verification code SMS, and be sure to use the verification code provided by the user."
  },
  missingPhoneNumber: {
    header: "Missing",
    messages: "To send verification codes, provide a phone number for the recipient."
  },
  missingVerifyCode: {
    header: "Missing code",
    messages: "The phone auth credential was created with an empty verification ID."
  },
  invalideVerifyCode: {
    header: "Invalide",
    messages: "The verification ID used to create the phone auth credential is invalid."
  },
  invalideVerifyId: {
    header: "Invalide",
    messages: "The verification ID used to create the phone auth credential is invalid."
  },
  codeExpired: {
    header: "Expired",
    messages: "The SMS code has expired. Re-send the verification code to try again."
  },
  captcha: {
    header: "reCAPTCHA",
    messages: "The reCAPTCHA response token provided is either invalid, expired, already used, or the domain associated with it do not match the list of whitelisted domains."
  },
  exceeded: {
    header: "EXCEEDED",
    messages: "The phone verification quota for this project has been exceeded."
  }
}


@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alert;
  private toast;

  constructor(
    private alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) { }

  // Show error messages depending on the code
  // If you added custom error codes on top, make sure to add a case block for it.

  async showErrorMessage(code) {
    switch (code) {
      case "auth/invalid-phone-number":
        this.alert = await this.alertCtrl.create({
          header: errorMessages.invalideNumber.header,
          message: errorMessages.invalideNumber.messages,
          buttons: ["OK"],
        });
        this.alert.present();
        break;

      case "auth/missing-phone-number":
        this.alert = await this.alertCtrl.create({
          header: errorMessages.missingPhoneNumber.header,
          message: errorMessages.missingPhoneNumber.messages,
          buttons: ["OK"],
        });
        this.alert.present();
        break;

      case "auth/missing-verification-code":
        this.alert = await this.alertCtrl.create({
          header: errorMessages.missingVerifyCode.header,
          message: errorMessages.missingVerifyCode.messages,
          buttons: ["OK"],
        });
        this.alert.present();
        break;

      case "auth/invalid-verification-code":
        this.alert = await this.alertCtrl.create({
          header: errorMessages.invalideVerifyCode.header,
          message: errorMessages.invalideVerifyCode.messages,
          buttons: ["OK"],
        });
        this.alert.present();
        break;

      case "auth/invalid-verification-id":
        this.alert = await this.alertCtrl.create({
          header: errorMessages.invalideVerifyId.header,
          message: errorMessages.invalideVerifyId.messages,
          buttons: ["OK"],
        });
        this.alert.present();
        break;

      case "auth/code-expired":
        this.alert = await this.alertCtrl.create({
          header: errorMessages.codeExpired.header,
          message: errorMessages.codeExpired.messages,
          buttons: ["OK"],
        });
        this.alert.present();
        break;

      case "auth/captcha-check-failed":
        this.alert = await this.alertCtrl.create({
          header: errorMessages.captcha.header,
          message: errorMessages.captcha.messages,
          buttons: ["OK"],
        });
        this.alert.present();
        break;

      case "auth/quota-exceeded":
        this.alert = await this.alertCtrl.create({
          header: errorMessages.captcha["header"],
          message: errorMessages.captcha["messages"],
          buttons: ["OK"],
        });
        this.alert.present();
        break;

      case "auth/network-request-failed":
        this.toast = await this.toastCtrl.create({
          message: errorMessages.connectionFailed["message"],
          duration: 3000,
          position: 'top'
        })
        this.toast.present();
        break;


    }

  }
}
