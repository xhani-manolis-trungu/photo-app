
import { CommonModule, provideImageKitLoader } from '@angular/common';
// photo-list.component.ts
import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { IntersectionListenerDirective } from '../directives/intersection-observer.directive';
import { FavoritesState, GetPhotos, UpdatePhotos } from '../favorites-state/state/favorites.state';
import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.scss'],
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, IntersectionListenerDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoListComponent implements OnInit {
  @Select(FavoritesState.getPhotosAndFavorites) photos$!: Observable<any[]>;
  @Select(FavoritesState.getLoader) loading$!: Observable<boolean>;

  isClicked: boolean = false;

  constructor(
    private store: Store,
    private photoService: PhotoService
    ) {}

  ngOnInit(): void {
    this.store.dispatch(new GetPhotos())
  }

  loadMorePhotos() {
    this.store.dispatch(new UpdatePhotos());
  }

  actOnFavorites(photo: {id: string, url: string, isFavorite: boolean}): void {
    // Dispatch the action to add to favorites
    // this.isClicked = !photo.isFavorite

    photo.isFavorite ? this.photoService.removeFromFavorites(photo) : this.photoService.addToFavorites(photo);
  }

  handleLoadMoreData(data: any[]): void {
    // Update the photos array with the newly loaded data

    const newlyLoadedData = [...this.store.selectSnapshot(state => state.favorite.photos), ...data];

  }

  handleLoadMoreError(error: Error): void {
    console.error('Error loading more data:', error);
  }
}
