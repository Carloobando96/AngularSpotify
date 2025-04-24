import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';
import { AuthService } from '../guards/auth.guard';

@Component({
  selector: 'app-spotify-login',
  standalone: false,
  templateUrl: './spotify-login.component.html',
  styleUrl: './spotify-login.component.scss',
})
export class SpotifyLoginComponent {
  constructor(
    private spotifyService: SpotifyService,
    private router: Router,
    private authService: AuthService
  ) {}

  loginWithSpotify() {
    this.spotifyService.getToken().subscribe({
      next: (response) => {
        console.log('Token:', response);
        this.authService.setLogin(true);
        this.router.navigate(['/main']);
      },
      error: (error) => {
        console.error('Error getting token:', error);
      },
    });
  }
}
