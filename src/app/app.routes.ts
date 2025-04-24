import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; // Solo RouterModule y Routes
import { SpotifyLoginComponent } from './spotify-login/spotify-login.component';
import { SpotifyMainComponent } from './spotify-main/spotify-main.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: SpotifyLoginComponent },
  { path: 'main', component: SpotifyMainComponent, canActivate: [authGuard] },
];

@NgModule({
  declarations: [SpotifyLoginComponent, SpotifyMainComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
