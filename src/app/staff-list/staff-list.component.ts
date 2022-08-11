import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SessiondataService } from '../sessiondata.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import * as $ from 'jquery';
import { logging } from 'protractor';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})
export class StaffListComponent implements OnInit {
employeeList = [];
isEmployeeSelected = false;
isLoad = false;
employeeID: String;
employeeData: FormGroup;
  constructor(public sessionData: SessiondataService, public dialogRef: MatDialogRef<StaffListComponent>, public router: Router) {
    this.waiter('on');
     this.sessionData.newBackGetRequest(`employees`).subscribe((employee_data: Array<{}>) => {
       this.sessionData.newBackGetRequest(`phone_book`).subscribe((employee_contact_data: Array<{}>) => {
       for (let person of employee_data) {
         if (employee_data.length !== 0) {
         if (!person['dismissed']) {
          if (!employee_contact_data.find(aa => aa['employee']['id'] == person['id'])) {
            this.employeeList.push(person);
            this.waiter('off');
          }
          }
        } else {
          $('.no-employees').show();
          this.waiter('off');
        }
        }
      })       
     })
   }

  searchStaff(value) {
    if($('#staffSearch').val().length !== 0) {      
      $('table .staff-fullname').each((idx, elem) => {    
        if ($(elem).text().toLowerCase().indexOf(value.toLowerCase()) > -1) {
          $(elem).closest('tr').show();
        } else {
          $(elem).closest('tr').hide();
        }
      })   
      } else {}
  }

  addPhoneData(id) {
    this.isEmployeeSelected = true;
    this.employeeID = id;
    let selectedElem = this.employeeList.find(staffArr => staffArr['id'] == id);
    $('.employee-fullname').text(selectedElem.surname + ' ' + selectedElem.name + ' ' + selectedElem.patronimyc);
  } 
  backToList() {
    this.isEmployeeSelected = false;
    this.employeeData.reset();
    $('.employee-fullname').text('');
  }

  sendData() {
    if (this.employeeData.invalid) {
      console.log('sorry, form is invalid');
    } else {
      this.sessionData.newBackPostJSONRequest(`phone_book`, JSON.stringify({"employee_uid": this.employeeID, "email": this.employeeData.value.emailAddress, "phone_internal": this.employeeData.value.internalNum,
      "phone_external": this.employeeData.value.externalNum, "phone_mobile": this.employeeData.value.mobileNum, "room": this.employeeData.value.roomNum, "description": this.employeeData.value.descriptionData})).subscribe(() => {
        this.dialogRef.close();
      }, (err) => {
        console.log('Ошибка сохранения в БД');
      });
    }
  }
  waiter(status) {
    if (status == 'on') {
      this.isLoad = true;
    } else {
      this.isLoad = false;
    }
}
  ngOnInit(): void {
    this.employeeData = new FormGroup({
      internalNum: new FormControl(''),
      externalNum: new FormControl(''),
      mobileNum: new FormControl('', [Validators.pattern('^[789][0-9]{10}$')]),
      emailAddress: new FormControl('', [Validators.email]),
      roomNum: new FormControl(''),
      descriptionData: new FormControl('')
    });
    this.employeeData.statusChanges.subscribe((status) => {
      console.log(status);
    })
  }

}
