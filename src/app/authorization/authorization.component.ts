import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms'; 
import { SessiondataService } from '../sessiondata.service';
import * as $ from 'jquery';
import * as SHA256 from 'crypto-js/sha256';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit {


  adminData: FormGroup;
  constructor(public dialogRef: MatDialogRef<AuthorizationComponent>, public sessionData: SessiondataService) { }

  enterSubmit(event) {
    if (event.keyCode === 13) {
      this.authentification();
    }
  }
  authentification() {
    const login = $('#login').val();
    const pass = $('#password').val();
    const pwdHash = SHA256(pass).toString();
    if (this.adminData.invalid) {
      console.log('sorry, data is invalid');
    } else {
      this.sessionData.newBackPostJSONRequest(`auth`, JSON.stringify({"login":`${login}`, "password":`${pwdHash}`})).subscribe((data:any) => {
        this.sessionData.department = data.department;
        this.sessionData.name = data.name;
        this.sessionData.surname = data.surname;
        this.sessionData.patronimyc = data.patronimyc;
        this.sessionData.role = data.role;
        this.sessionData.isAuth = true;
        this.dialogRef.close();
        console.log('Успешно');
      }, (err) => {
        console.log(err.statusText);
        this.sessionData.isAuth = false;
      });
    }
  }

  cleanForm() {
    this.adminData.reset();
  }
 
  ngOnInit(): void {
    this.adminData = new FormGroup({
      loginData: new FormControl('', [Validators.required]),
      passwordData: new FormControl('', [Validators.required])
    })
    this.adminData.statusChanges.subscribe();
  }
  
}
