import { Component, HostListener, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthorizationComponent } from '../authorization/authorization.component';
import { SessiondataService } from '../sessiondata.service';
import { StaffListComponent } from '../staff-list/staff-list.component';
import { ViewportScroller } from '@angular/common';


@Component({
  selector: 'app-phone-directory',
  templateUrl: './phone-directory.component.html',
  styleUrls: ['./phone-directory.component.css']
})
export class PhoneDirectoryComponent implements OnInit {
  pageYoffset = 0;   // скролл страницы
    @HostListener('window:scroll', ['$event']) onScroll(event){
      this.pageYoffset = window.pageYOffset;
    }
  personData = [];
  // personName = [];
  departments = [];
  isSorting = false;
  isLoad = false;
  // pattern: string;
  // editablePhoneInternal: FormControl;
  // editablePhoneExternal: FormControl;
  // editableMobilePhone: FormControl;
  // editableEmail: FormControl;
  // editableRoom: FormControl;
  childData: any;
  constructor(public matDialog : MatDialog, public sessionData: SessiondataService, public scroll: ViewportScroller) {
    this.getData();
    $('.dropdown-string').hide();
    this.viewScrollBtn();
  }

  getData() {  // загрузка и сортировка списка сотрудников 
    this.waiterOnOff('on');
    this.sessionData.newBackGetRequest(`phone_book`).subscribe((db_person_values: any) => {
      db_person_values.sort((a,b) => { 
        if ( a.employee.surname < b.employee.surname ){ return -1; }
        if ( a.employee.surname > b.employee.surname ){ return 1;  }
        return 0;
      });   
      this.personData = db_person_values;
      // вычленяем уникальный список отделов 
      this.departments = db_person_values.map(p => this.getMainDepart(p.employee.employee_numbers)).filter((c, index, array) => array.indexOf(c) == index).sort();
      this.waiterOnOff('off');
    });
  }

  sortingWaiter(target) {
    this.waiterOnOff('on');
    this.sortList(target).then(() => {
      this.waiterOnOff('off');
    })
  }

  async sortList(target) {
    if (this.isSorting) {
      this.personData.sort((a,b) => { 
      if ( a.employee.surname < b.employee.surname ){ return -1; }
      if ( a.employee.surname > b.employee.surname ){ return 1;  }
      return 0;
    });
    $(target).addClass('sort-btn-up');
    this.isSorting = false;
    } else {
      this.personData.sort((a,b) => {
        if ( a.employee.surname > b.employee.surname ){ return -1; }
        if ( a.employee.surname < b.employee.surname ){ return 1;  }
        return 0;
      });
      $(target).removeClass('sort-btn-up');
      this.isSorting = true;
    }
  }

  changeDepartment(value) {
    $('#departmentFilter').val(value);
    $('.person-search').val('');
        if($('#departmentFilter').val() !== 'none') {      
            $('table .table-main .factdepartment-col .factdepartment-text').each((idx, elem) => {  
              if ($(elem).text() == value) {
                $(elem).closest('tr').show();
              } else {
                $(elem).closest('tr').hide();
              }
            })
      } else {
        $('tr.table-main').show();
      }
  }
  findWaiter(target) {
    this.waiterOnOff('on');
      this.surnFilter(target).then(() => {
        this.waiterOnOff('off');
      })
  }

  async surnFilter(value) {
    $('#departmentFilter').val('none');
    if($('.person-search').val().length !== 0) {     
      $('table .table-main .fullname-col').each((idx, elem) => {   
        if ($(elem).text().toLowerCase().indexOf(value.toLowerCase()) > -1) {
          $(elem).closest('tr').show();
        } else {
          $(elem).closest('tr').hide();
        }
      })   
      } else {
        $('tr.table-main').show();
    } 
  }

  editPersonData(personID) {
    this.childData = this.personData.find(elem => elem.employee.id == personID);
    $('#' + personID).fadeToggle(700, 'linear').addClass('active-row');
    $('.dropdown-string:not(' + '#' + personID + ')').fadeOut(700, 'linear').removeClass('active-row');
  }

  openAuthorizationPopup() {
        let dialogConfig = new MatDialogConfig;
        dialogConfig.disableClose = true;
        dialogConfig.id = 'authorization';
        dialogConfig.height = '600';
        dialogConfig.width = '700';
        this.matDialog.open(AuthorizationComponent, dialogConfig);
  }

  addStaff() {
    let dialogConfig = new MatDialogConfig;
        dialogConfig.disableClose = true;
        dialogConfig.id = 'add-staff-dialog';
        dialogConfig.width = '35vw';
        let dialog = this.matDialog.open(StaffListComponent, dialogConfig);
        dialog.afterClosed().subscribe(() => {
          this.getData();
        })
  }

  logOut() {
    this.sessionData.isAuth = false;
    $('.dropdown-string').fadeOut(700, 'linear');
    $('.dropdown-string').removeClass('active-row');
    // this.getData();
  }
  // openFullPhoto(template) {
  //   let dialogConfig = new MatDialogConfig;
  //       dialogConfig.disableClose = true;
  //       dialogConfig.id = 'authorization';
  //       dialogConfig.height = '600';
  //       dialogConfig.width = '700';
  //       let dialog = this.matDialog.open(template, dialogConfig);
  // }

  viewScrollBtn() {
    window.addEventListener('scroll', () => {
      let scrollBtn = $('.up-btn');                 
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        $(scrollBtn).show();
      } else {
        $(scrollBtn).hide();
      }
    })
  }

  getMainDepart (departs) {
    let aa = departs.find(dep => dep.employment_type == 'main') ? departs.find(dep => dep.employment_type == 'main') : departs.find(dep => dep.employment_type == 'external');
    return aa.factdepartment.factdepartment;
  }

  ngOnInit(): void {
  }

  waiterOnOff(onoff) {
      if (onoff == 'on') {
        $('body').addClass('overlay');
        this.isLoad = true;
      } else {
        $('body').removeClass('overlay');
        this.isLoad = false;
      }
  }
}
