import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; // Solo RouterModule y Routes
import { SpotifyLoginComponent } from './spotify-login/spotify-login.component';
import { SpotifyMainComponent } from './spotify-main/spotify-main.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from './guards/auth.guard';
import { SpotifyCallbackComponent } from './spotify-callback/spotify-callback.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: SpotifyLoginComponent },
  { path: 'callback', component: SpotifyCallbackComponent },
  { path: 'main', component: SpotifyMainComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [SpotifyLoginComponent, SpotifyMainComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
