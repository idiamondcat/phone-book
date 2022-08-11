import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as $ from 'jquery';
import { SessiondataService } from '../sessiondata.service';

@Component({
  selector: 'app-dropdown-string',
  templateUrl: './dropdown-string.component.html',
  styleUrls: ['./dropdown-string.component.css']
})
export class DropdownStringComponent {

  @Input() model: any;
  @Output() saveNewData = new EventEmitter();
  constructor(public sessionData: SessiondataService) {
  }

   onSelectPhoto(files, id) {
    $('#preview' + id).html('');
      let file = files[0];
        const reader = new FileReader();
        reader.onload = theFile => {
          let canvas = document.createElement('canvas');
          $('#preview' + id).append($(canvas));
          let ctx = canvas.getContext('2d');
          let image = new Image();
          $(image).attr('title', escape(file.name)).attr('src', theFile.target.result);
          $(canvas).attr('id', 'photo-'+id).attr('name', escape(file.name)).addClass('employee-photo').css('display', 'inline').css('text-align', 'center');
          image.onload = () => {
            let imageWidth = image.width;
            let imageHeight = image.height;
            let width = 100;
            let height = 150;
            let perfectProportion = width/height;
            let actualProportion = imageWidth/imageHeight;
            if (actualProportion > perfectProportion) { 
              let widthScale = width/imageWidth;
              canvas.width = width;
              canvas.height = height;
              let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              let data = imgData.data;
              for(let i = 0; i < data.length; i += 4){
                if (data[i+3] < 255) {
                  data[i] = 255;
                  data[i+1] = 255;
                  data[i+2] = 255;
                  data[i+3] = 255;
                }
              }
              ctx.putImageData(imgData, 0, 0);
              ctx.drawImage(image, 0, (height/2) - (imageHeight * widthScale)/2, imageWidth * widthScale, imageHeight * widthScale);
              let dataURL = canvas.toDataURL('image/jpeg', 1);
              $(canvas).attr('data-url', dataURL);
            } else {
              let heightScale = height/imageHeight;
              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(image, (width/2) - (imageWidth * heightScale)/2, 0, imageWidth * heightScale, imageHeight * heightScale);
              let dataURL = canvas.toDataURL('image/jpeg', 1);
              $(canvas).attr('data-url', dataURL);
            }
          }
          $(image).addClass('thumb');
          $('#empty' + id).remove();
        };
        reader.readAsDataURL(file);
  }

  saveData(uid, id) {
    this.sessionData.newBackPatchJSONRequest(`phone_book/${uid}`, JSON.stringify({
    "phone_internal": $('.active-row').find('#editPhoneInternal').val(), 
    "phone_external": $('.active-row').find('#editPhoneExternal').val(),
    "phone_mobile": $('.active-row').find('#editMobilePhone').val(),
    "email": $('.active-row').find('#editEmail').val(), 
    "room": $('.active-row').find('#editRoom').val(),
    "description": $('.active-row').find('#description').val(), 
    "photo": $('#photo-'+id).attr('data-url')
    })).subscribe(() => {
      this.saveNewData.emit();
      $('#' + id).fadeOut(700, 'linear').removeClass('active-row');
    }, (err) => {
      console.log('Ошибка сохранения в БД:  ' + err);
    })
  }

}
