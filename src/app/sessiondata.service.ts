import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class SessiondataService {

  port: string = ':5001';
  new_ip = '172.16.2.237';
  isAuth = false;
  department: number = -11;  //function_department
  name: string = 'default user';
  patronimyc: string = 'default user';
  surname: string = 'default user';
  role: string = 'user';
  // emailValidation = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  // mobilePhoneValidation = new RegExp(/^((8|\+7)[\- ]?)?(\(?\d{3,4}\)?[\- ]?)?[\d\- ]{5,10}/);
  // internalPhoneValidation = new RegExp(/^[0-9]{2}-[0-9]{2}$/);
  // externalPhoneValidation = new RegExp(/^[0-9]{3}-[0-9]{2}-[0-9]{2}$/);
  // roomValidation = new RegExp(/^[0-9]{4}$/);
  constructor(private http: HttpClient) { 
    // if (window.location.port !== '4200' ) {
    //   this.new_ip = window.location.hostname;
    // }
  }
 addHeaders(headers = {}) {
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    })
  };
  for (const key in headers) { httpOptions.headers.set(key, headers[key]); }
  return httpOptions;
}
newBackGetRequest(method: any, params = '') {  // GET запрос
  let a = params != '' ? `${method}?${params}` : `${method}`;
  return this.http.get(`http://${this.new_ip + this.port}/${a}`, this.addHeaders());
}

newBackPostJSONRequest(method, json, params = '') { // POST
    let a = params != '' ? `${method}?${params}` : `${method}`;
    return this.http.post(`http://${this.new_ip + this.port}/${a}`, json, this.addHeaders());
  } 

  newBackPatchJSONRequest(method, json, params = '') {  // PATCH
    let a = params != '' ? `${method}?${params}` : `${method}`;
    return this.http.patch(`http://${this.new_ip + this.port}/${a}`, json, this.addHeaders());
  }

  // fieldsValidator(value: string, type: string) {
  //   let returnValue = false;
  //   switch(type) {
  //     case 'internal': returnValue = this.internalPhoneValidation.test(value);
  //     break;
  //     case 'external': returnValue = this.externalPhoneValidation.test(value);
  //     break;
  //     case 'mobile': returnValue = this.mobilePhoneValidation.test(value);
  //     break;
  //     case 'email': returnValue = this.emailValidation.test(value);
  //     break;
  //     case 'room': returnValue = this.roomValidation.test(value);
  //     break;
  //   }
  //   return returnValue;
  // }
}

