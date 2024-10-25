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

    let datepickerLan = document.createElement('script');
    datepickerLan.src = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.10.0/locales/bootstrap-datepicker.es.min.js';
    datepickerLan.type = 'text/javascript';
    datepickerLan.async = true;

    let Id_datepicker = document.createElement('script');
    Id_datepicker.src = 'js/id_datepicker.js';
    Id_datepicker.type = 'text/javascript';
    Id_datepicker.async = true;

    let css_datepicker = document.createElement('link');
    css_datepicker.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.10.0/css/bootstrap-datepicker3.standalone.min.css';
    css_datepicker.rel = 'stylesheet';

    document.body.appendChild(jqueryScript);
    document.body.appendChild(datepickerJq);
    document.body.appendChild(datepickerLan);
    document.body.appendChild(css_datepicker);
    document.body.appendChild(Id_datepicker);
  
  }



}
