import { Component, OnInit } from '@angular/core';
import {Product} from '../models/product.model';
import {ActivatedRoute} from '@angular/router';
import {LoadingController} from '@ionic/angular';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
})
export class EditProductPage implements OnInit {
  product = {} as Product;
  id: any;

  constructor(
      private actRoute: ActivatedRoute,
      private loadingCtrl: LoadingController,
      private firestore: AngularFirestore,
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getProductById(this.id);
  }

  async getProductById(id: string){
    let loader = this.loadingCtrl.create({
      message: 'Please wait...'
    });
    (await loader).present();

    this.firestore.doc('products/' + id).valueChanges().subscribe(data => {
      this.product.name = data["name"];
      this.product.price = data["price"];
      this.product.type = data["type"];
    });
    (await loader).dismiss();
  }
}
