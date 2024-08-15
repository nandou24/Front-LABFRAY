import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(
    private route: Router
  ){}

  logout(){
    localStorage.clear();
    this.route.navigateByUrl('/auth/login')

  }

}
