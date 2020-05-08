import { Component } from '@angular/core';
import {LoadingController, ToastController, NavController} from '@ionic/angular';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  users: any;
  products: any;
  constructor(
      private loadingCtrl: LoadingController,
      private toastCtrl: ToastController,
      private firestore: AngularFirestore,
      public afAuth: AngularFireAuth,
      public navCtrl: NavController) {}

  ionViewWillEnter() {
    this.getProducts();
  }

  // logout
  logout() {
    this.afAuth.signOut().then(() => {
      this.navCtrl.navigateRoot('login');
    });
  }

  async getProducts() {
    // show loader
    const loader = this.loadingCtrl.create({
      message: 'Please wait...'
    });
    (await loader).present();

    try {
      this.firestore.collection('products').snapshotChanges().subscribe(data => {
        this.products = data.map(e => {
          return {
            id: e.payload.doc.id,
            name: e.payload.doc.data()['name'],
            type: e.payload.doc.data()['type'],
            price: e.payload.doc.data()['price'],
          };
        });
      });

      // dismiss loader
      (await loader).dismiss();
    } catch (e) {
      this.showToast(e);
    }
  }
  showToast(message: string) {
    this.toastCtrl.create({
      message,
      duration: 3000
    }).then(toastData => toastData.present());
  }

  /*
  async getUsers() {
    // show loader
    const loader = this.loadingCtrl.create({
      message: 'Please wait...'
    });
    (await loader).present();

    try {
      this.firestore.collection('users').snapshotChanges().subscribe(data => {
        this.users = data.map(e => {
          return {
            id: e.payload.doc.id,
            email: e.payload.doc.data()['email'],
            name: e.payload.doc.data()['name'],
            type: e.payload.doc.data()['type'],
            surname: e.payload.doc.data()['surname'],
            category: e.payload.doc.data()['category'],
            other_data: e.payload.doc.data()['other_data']
          };
        });
      });

      // dismiss loader
      (await loader).dismiss();
    } catch (e) {
      this.showToast(e);
    }
  }*/

  /*
  async deleteUser(id: string) {
    //muestra el loader
    let loader = this.loadingCtrl.create({
      message: "Please wait..."
    });
    (await loader).present();

    await this.firestore.doc("users/"+id).delete();

    (await loader).dismiss();
    console.log(id);
  }*/
}
