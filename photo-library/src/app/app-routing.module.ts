// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavoritesComponent } from './favorites/favorites.component';
import { PhotoListComponent } from './photo-list/photo-list.component';
import { SinglePhotoComponent } from './single-photo/single-photo.component';

export const routes: Routes = [
  { path: '', component: PhotoListComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'photos/:id', component: SinglePhotoComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
