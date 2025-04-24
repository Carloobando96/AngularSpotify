import { Injectable } from '@angular/core';

/**
 * Servicio de autenticación para Spotify utilizando Authorization Code Flow con PKCE.
 * Se encarga de generar los parámetros necesarios para el login seguro
 * y redirigir al usuario al flujo de autorización de Spotify.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthServicSpotify {
  /** ID del cliente registrado en Spotify Developer Console */
  private clientId = '40dc119251ed46739f3e1704378c76dd';

  /** URI de redirección definida en la configuración de la app en Spotify */
  private redirectUri = 'http://127.0.0.1:4200/callback';

  /** Scopes necesarios para las funcionalidades requeridas por la app */
  private scopes =
    'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private';

  /**
   * Genera un string aleatorio de longitud especificada.
   * Se utiliza como `code_verifier` en el flujo PKCE.
   *
   * @param length Longitud del string a generar
   * @returns String aleatorio
   */
  generateRandomString(length: number): string {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }

  /**
   * Codifica un ArrayBuffer en formato Base64 URL seguro.
   * Utilizado para transformar el digest del `code_verifier` en `code_challenge`.
   *
   * @param input ArrayBuffer a codificar
   * @returns String codificado en base64 URL
   */
  base64UrlEncode(input: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  /**
   * Genera un `code_challenge` codificado desde un `code_verifier` utilizando SHA-256.
   *
   * @param verifier Código aleatorio generado previamente
   * @returns Promise con el código `code_challenge` codificado
   */
  async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return this.base64UrlEncode(digest);
  }

  /**
   * Inicia el proceso de autenticación con Spotify redirigiendo al usuario
   * al endpoint de autorización con los parámetros necesarios para el flujo PKCE.
   */
  async loginWithSpotify(): Promise<void> {
    const verifier = this.generateRandomString(128);
    const challenge = await this.generateCodeChallenge(verifier);

    // Guarda el code_verifier para usarlo más adelante al obtener el token
    localStorage.setItem('code_verifier', verifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scopes,
      code_challenge_method: 'S256',
      code_challenge: challenge,
    });

    // Redirige al usuario al login de Spotify
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }
}
