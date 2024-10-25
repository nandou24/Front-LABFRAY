import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const hamBurger = document.querySelector(".toggle-btn");
    const sidebar = document.querySelector("#sidebar");

    if (hamBurger instanceof HTMLElement && sidebar instanceof HTMLElement) {
        hamBurger.addEventListener("click", () => {
        sidebar.classList.toggle("expand");
      });
    } else {
      console.error("No se pudo encontrar el elemento con clase 'toggle-btn' o el '#sidebar'");
    }
  }


}
