import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-spotify-callback',
  standalone: false,
  templateUrl: './spotify-callback.component.html',
  styleUrl: './spotify-callback.component.scss',
})
export class SpotifyCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      const verifier =
        typeof window !== 'undefined'
          ? localStorage.getItem('code_verifier')
          : null;

      if (!code || !verifier) return;

      const body = new HttpParams()
        .set('grant_type', 'authorization_code')
        .set('code', code)
        .set('redirect_uri', 'http://127.0.0.1:4200/callback')
        .set('client_id', '40dc119251ed46739f3e1704378c76dd')
        .set('code_verifier', verifier);

      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      });

      this.http
        .post('https://accounts.spotify.com/api/token', body.toString(), {
          headers,
        })
        .subscribe({
          next: (response: any) => {
            localStorage.setItem('spotify_token', response.access_token);
            this.router.navigate(['/main']);
          },
          error: (err) => {
            console.error('Error al obtener token:', err);
          },
        });
    });
  }
}
