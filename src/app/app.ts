import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarComponent } from './components/sidebar/sidebar';
import { NavbarComponent } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly router = inject(Router);
  mobileOpen = false;
  isLoginPage = this.isAuthenticationPage(this.router.url);

  constructor() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      this.isLoginPage = this.isAuthenticationPage((event as NavigationEnd).urlAfterRedirects);
    });
  }

  private isAuthenticationPage(url: string): boolean {
    return url.startsWith('/login') || url.startsWith('/signup');
  }
}
