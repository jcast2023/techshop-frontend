import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
  imports: [
    NavbarComponent
  ]
})
export class ShopComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
}
