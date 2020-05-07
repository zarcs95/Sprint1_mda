import { Component } from '@angular/core';
import {LoadingController, ToastController, NavController} from '@ionic/angular';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: 'carro.page.html',
  styleUrls: ['carro.page.scss'],
})
export class CarroPage {
  users: any;
  products: any=[{price:5,name:"coca cola"}];
  cantidades:any=[1];
  total:number=0;
  constructor(
      private loadingCtrl: LoadingController,
      private toastCtrl: ToastController,
      private firestore: AngularFirestore,
      public afAuth: AngularFireAuth,
      public navCtrl: NavController) {}

  ionViewWillEnter() {
    this.precioTotal();
  }
  // logout
  logout() {
    this.afAuth.signOut().then(() => {
      this.navCtrl.navigateRoot('login');
    });
  }
  precioTotal(){
    var total=0;
    for(let indice=0;indice<this.products.length;indice++){
      total+=this.cantidades[indice]*this.products[indice].price;
    }
    this.total=total;
  }
  anadirCantidad(i:number){
    this.cantidades[i]++;
    this.precioTotal();
  }
  restarCantidad(i:number){
    if(this.cantidades[i]==1){
      if (confirm("Se eliminara el producto. ¿Desea eliminar el producto)?")) {
        alert("El producto fue eliminado del carrito");
        this.products.splice(i,1);
        this.cantidades.splice(i,1);
      }else {
        
      }
    }else{
      this.cantidades[i]--;
    }
    this.precioTotal();
    
  }
  añadirProducto(i){
    this.cantidades[i]--;
  }
  showToast(message: string) {
    this.toastCtrl.create({
      message,
      duration: 3000
    }).then(toastData => toastData.present());
  }
}
