import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthServicSpotify {
  private clientId = '40dc119251ed46739f3e1704378c76dd';
  private redirectUri = 'http://127.0.0.1:4200/callback';
  private scopes =
    'user-read-private user-read-email playlist-read-private playlist-read-collaborative';

  // Genera string aleatorio
  generateRandomString(length: number): string {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }

  // Codifica en base64url
  base64UrlEncode(input: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  // Hashea con SHA256
  async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return this.base64UrlEncode(digest);
  }

  // Inicia el login
  async loginWithSpotify(): Promise<void> {
    const verifier = this.generateRandomString(128);
    const challenge = await this.generateCodeChallenge(verifier);

    localStorage.setItem('code_verifier', verifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scopes,
      code_challenge_method: 'S256',
      code_challenge: challenge,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }
}
