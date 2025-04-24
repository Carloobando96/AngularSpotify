import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';

import { AuthServicSpotify } from '../services/spotify-auth.service';

@Component({
  selector: 'app-spotify-login',
  standalone: false,
  templateUrl: './spotify-login.component.html',
  styleUrl: './spotify-login.component.scss',
})
export class SpotifyLoginComponent {
  constructor(
    private spotifyService: SpotifyService,
    private authServiceSpotify: AuthServicSpotify
  ) {}

  loginWithSpotify() {
    this.spotifyService.getToken().subscribe({
      next: (response) => {
        console.log('Token:', response);
        this.authServiceSpotify.loginWithSpotify();
      },
      error: (error) => {
        console.error('Error getting token:', error);
      },
    });
  }
}
