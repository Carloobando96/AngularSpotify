import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-spotify-main',
  standalone: false,
  templateUrl: './spotify-main.component.html',
  styleUrl: './spotify-main.component.scss',
})
export class SpotifyMainComponent implements OnInit {
  /**
   * Cadena ingresada por el usuario para buscar artistas.
   */
  searchQuery: string = '';

  /**
   * Lista de artistas obtenidos de la búsqueda.
   */
  artistList: any[] = [];

  /**
   * Lista de álbumes del artista seleccionado.
   */
  albumList: any[] = [];

  /**
   * Lista de canciones del álbum seleccionado.
   */
  trackList: any[] = [];

  /**
   * Indicador para mostrar los resultados de la búsqueda.
   */
  searchLabel = false;

  /**
   * Nombre del artista seleccionado.
   */
  artistSelect = null;

  /**
   * Nombre del álbum seleccionado.
   */
  albumSelect = null;

  /**
   * URL de la imagen del álbum seleccionado.
   */
  albumImage = null;

  /**
   * Inyecta el servicio de Spotify para consumir su API.
   * @param spotifyService Servicio para interactuar con Spotify
   */
  constructor(private spotifyService: SpotifyService, private router: Router) {}

  ngOnInit(): void {
    console.log('el token', localStorage.getItem('spotify_token'));
    this.spotifyService.getUserPlaylists().subscribe({
      next: (playlist) => {
        console.log('las plays', playlist);
      },
      error: (error) => {
        console.error('Error al obtener las playlist:', error);
      },
    });
  }
  /**
   * Realiza la búsqueda de artistas en Spotify utilizando la consulta ingresada.
   * Si la búsqueda está vacía, no realiza la solicitud.
   */
  searchArtist(): void {
    if (!this.searchQuery.trim()) {
      this.searchLabel = false;
      return;
    }

    this.spotifyService.searchArtistByName(this.searchQuery.trim()).subscribe({
      next: (result) => {
        this.artistList = result.artists.items;
        this.searchLabel = true;
      },
      error: (error) => {
        console.error('Error en la búsqueda:', error);
      },
    });
  }

  /**
   * Busca los álbumes de un artista seleccionado.
   * @param artist Objeto del artista seleccionado que contiene su ID.
   */
  searchAlbum(artist: any): void {
    this.spotifyService.getAlbumsByArtistId(artist.id).subscribe({
      next: (albums) => {
        this.albumList = albums.items;
        this.artistSelect = artist.name;
      },
      error: (error) => {
        console.error('Error obteniendo álbumes:', error);
      },
    });
  }

  /**
   * Busca las canciones del álbum seleccionado.
   * @param album Objeto del álbum seleccionado que contiene su ID.
   */
  searchTrack(album: any): void {
    this.spotifyService.getTracksByAlbumId(album.id).subscribe({
      next: (tracks) => {
        this.trackList = tracks.items;
        this.albumSelect = album.name;
        this.albumImage = album.images[0]?.url;
      },
      error: (error) => {
        console.error('Error al obtener las canciones:', error);
      },
    });
  }

  /**
   * Reinicia la selección del artista y borra los álbumes y canciones mostrados.
   */
  resetArtist(): void {
    this.artistSelect = null;
    this.albumSelect = null;
    this.albumList = [];
    this.trackList = [];
  }

  /**
   * Reinicia la selección del álbum y borra la lista de canciones mostradas.
   */
  resetAlbum(): void {
    this.albumSelect = null;
    this.trackList = [];
  }

  /**
   * Formatea la duración de una canción desde milisegundos a formato mm:ss.
   * @param ms Duración de la canción en milisegundos.
   * @returns Cadena de texto con la duración formateada.
   */
  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  /**
   * Metodo de salida o logout que remueve el token de usuario
   */
  logOut() {
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('code_verifier');
    localStorage.removeItem('spotify_user');
    this.router.navigate(['/login']);
  }
}
