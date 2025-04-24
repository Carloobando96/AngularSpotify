import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  /**
   * Client ID de la aplicación registrada en Spotify Developer Dashboard.
   * @private
   */
  private clientId = '40dc119251ed46739f3e1704378c76dd'; // ⚠️ Reemplazar por un ID seguro en producción

  /**
   * Client Secret de la aplicación registrada. ⚠️ No se debe exponer en producción.
   * @private
   */
  private clientSecret = 'ff3491bdc9394e418822114313441379';

  /**
   * URL para obtener el token de acceso de Spotify.
   * @private
   */
  private authUrl = 'https://accounts.spotify.com/api/token';

  /**
   * URL base de la API pública de Spotify.
   * @private
   */
  private apiUrl = 'https://api.spotify.com/v1';

  /**
   * Constructor que inyecta el servicio HttpClient para realizar peticiones HTTP.
   * @param http Servicio de Angular para realizar llamadas HTTP.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene un token de acceso desde Spotify utilizando el flujo Client Credentials.
   * @returns Observable con el token de acceso (access_token y token_type).
   */
  getToken(): Observable<any> {
    const body = new HttpParams().set('grant_type', 'client_credentials');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`),
    });

    return this.http.post(this.authUrl, body.toString(), { headers });
  }

  /**
   * Busca artistas en Spotify utilizando su nombre.
   * Realiza primero la obtención del token y luego la búsqueda.
   *
   * @param artistName Nombre del artista a buscar.
   * @returns Observable con los datos de los artistas encontrados.
   */
  searchArtistByName(artistName: string): Observable<any> {
    return this.getToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `${token.token_type + ' ' + token.access_token}`,
        });

        const params = new HttpParams()
          .set('q', artistName)
          .set('type', 'artist');

        return this.http.get(`${this.apiUrl}/search`, { headers, params });
      }),
      catchError((error) => {
        console.error(
          'Error en el servicio Spotify (searchArtistByName):',
          error
        );
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene los álbumes de un artista específico por su ID.
   * Incluye álbumes y sencillos por defecto.
   *
   * @param artistId ID del artista en Spotify.
   * @returns Observable con la lista de álbumes del artista.
   */
  getAlbumsByArtistId(artistId: string): Observable<any> {
    return this.getToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `${token.token_type + ' ' + token.access_token}`,
        });

        const params = new HttpParams().set('include_groups', 'album,single');

        return this.http.get(`${this.apiUrl}/artists/${artistId}/albums`, {
          headers,
          params,
        });
      }),
      catchError((error) => {
        console.error(
          'Error en el servicio Spotify (getAlbumsByArtistId):',
          error
        );
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene las canciones (tracks) de un álbum específico por su ID.
   *
   * @param albumId ID del álbum en Spotify.
   * @returns Observable con la lista de canciones del álbum.
   */
  getTracksByAlbumId(albumId: string): Observable<any> {
    return this.getToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `${token.token_type + ' ' + token.access_token}`,
        });

        return this.http.get(`${this.apiUrl}/albums/${albumId}/tracks`, {
          headers,
        });
      }),
      catchError((error) => {
        console.error(
          'Error en el servicio Spotify (getTracksByAlbumId):',
          error
        );
        return throwError(() => error);
      })
    );
  }
}
