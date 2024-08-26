import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatepickerService {

  constructor() { }

  public loadScript() {
    console.log('preparing to load...')

    let jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js';
    jqueryScript.type = 'text/javascript';
    jqueryScript.async = true;

    let datepickerJq = document.createElement('script');
    datepickerJq.src = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.10.0/js/bootstrap-datepicker.min.js';
    datepickerJq.type = 'text/javascript';
    datepickerJq.async = true;

    let Id_datepicker = document.createElement('script');
    Id_datepicker.src = 'js/id_datepicker.js';
    Id_datepicker.type = 'text/javascript';
    Id_datepicker.async = true;

    let css_datepicker = document.createElement('link');
    css_datepicker.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.10.0/css/bootstrap-datepicker.min.css';
    css_datepicker.rel = 'stylesheet';

    document.getElementsByTagName('head')[0].appendChild(jqueryScript);
    document.getElementsByTagName('head')[0].appendChild(datepickerJq);
    document.getElementsByTagName('head')[0].appendChild(Id_datepicker);
    document.getElementsByTagName('head')[0].appendChild(css_datepicker);
  
  }



}
