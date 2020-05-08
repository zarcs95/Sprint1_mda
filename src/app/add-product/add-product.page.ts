import { Component, OnInit } from '@angular/core';
import {Product} from '../models/product.model';
import {LoadingController, NavController, ToastController} from '@ionic/angular';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import {Observable} from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

export interface MyData {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
product = {} as Product;
// Upload Task
  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;

  //Uploaded Image List
  images: Observable<MyData[]>;

  //File details
  fileName: string;
  fileSize: number;

  //Status check
  isUploading: boolean;
  isUploaded: boolean;

private imageCollection: AngularFirestoreCollection<MyData>
  constructor(private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private navCtrl: NavController,
              private afAuth: AngularFireAuth,
              private firestore: AngularFirestore,
              private storage: AngularFireStorage, private database: AngularFirestore) {
    this.isUploading = false;
    this.isUploaded = false;
    this.imageCollection = database.collection<MyData>('foodImages');
    this.images = this.imageCollection.valueChanges();
  }

  ngOnInit() {}

  async createProduct(product: Product) {

    if (this.formValidation()) {
      // show loader
      const loader = this.loadingCtrl.create({
        message: 'Please wait...'
      });
      (await loader).present();

      try {
        await this.firestore.collection('products').add(product);
      } catch (e) {
        this.showToast(e);
      }

      // dismiss loader
      (await loader).dismiss();

      // redirect to home page
      this.navCtrl.navigateRoot('home');
    }
  }

  uploadFile(event: FileList) {


    // The File object
    const file = event.item(0)

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ')
      return;
    }

    this.isUploading = true;
    this.isUploaded = false;


    this.fileName = file.name;

    // The storage path
    const path = `freakyStorage/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'Freaky Image Upload Demo' };

    //File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(

        finalize(() => {
          // Get uploaded file storage path
          this.UploadedFileURL = fileRef.getDownloadURL();

          this.UploadedFileURL.subscribe(resp=>{
            this.addImagetoDB({
              name: file.name,
              filepath: resp,
              size: this.fileSize
            });
            this.isUploading = false;
            this.isUploaded = true;
          },error=>{
            console.error(error);
          })
        }),
        tap(snap => {
          this.fileSize = snap.totalBytes;
        })
    )
  }

  addImagetoDB(image: MyData) {
    //Create an ID for document
    const id = this.database.createId();

    //Set document id with value in database
    this.imageCollection.doc(id).set(image).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log("error " + error);
    });
  }

  formValidation() {
    if (!this.product.name) {
      this.showToast('Enter name');
      return false;
    }

    if (!this.product.type) {
      this.showToast('Enter type');
      return false;
    }

    if (!this.product.price) {
      this.showToast('Enter price');
      return false;
    }
    return true;
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message,
      duration: 3000
    }).then(toastData => toastData.present());
  }
}
