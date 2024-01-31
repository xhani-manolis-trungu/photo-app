import { PhotoService } from './../../photo.service';
// favorites.state.ts
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, finalize, merge, switchMap, tap, throwError } from 'rxjs';

// Define actions
export class AddToFavorites {
  static readonly type = '[Favorites] Add to Favorites';
  constructor(public payload: {id: string, url: string}) {}
}

export class RemoveFromFavorites {
  static readonly type = '[Favorites] Remove from Favorites';
  constructor(public payload: {id: string, url: string}) {}
}

export class GetPhotos {
  static readonly type = '[Favorites] Get Photos';
}

export class UpdatePhotos {
  static readonly type = '[Favorites] Update Photos';
}

interface Favorite {
  id: string;
  url: string;
  isFavorite: boolean;
}

export interface Photos {
  author: string;
  download_url: string;
  height: number;
  width: number;
  id: string;
  url: string;
  isFavorite: boolean;
}

export interface FavoritesStateModel {
  favorites: Set<Favorite>;
  photos: Photos[];
  nextPage: number;
  loading: boolean;
}

// Define the state
@State<FavoritesStateModel>({
  name: 'favorites',
  defaults: {
    favorites: new Set<Favorite>(),
    photos: [],
    nextPage: 1,
    loading: false
  }
})
@Injectable()
export class FavoritesState {
  constructor(private photoService: PhotoService) {}
  @Selector()
  static getFavorites(state: FavoritesStateModel): Set<Favorite> {
    return state.favorites;
  }

  @Selector()
  static getPhotos(state: FavoritesStateModel): any[] {
    return state.photos;
  }

  @Selector()
  static getNextPage(state: FavoritesStateModel): number | null {
    return state.nextPage;
  }

  @Selector()
  static getLoader(state: FavoritesStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static getPhotosAndFavorites(state: FavoritesStateModel): any[] {
    const favorites = Array.from(state.favorites);
    const mergedArray = mergeArrays(state.photos, favorites);
    return mergedArray;
  }

  @Action(AddToFavorites)
  addToFavorites(ctx: StateContext<FavoritesStateModel>, action: AddToFavorites) {
    const state = ctx.getState();

    const updatedFavorites = new Set(state.favorites);

    const idExists = Array.from(updatedFavorites).some(fav => fav.id === action.payload.id);

    if (!idExists) {
      updatedFavorites.add({ id: action.payload.id, url: action.payload.url, isFavorite: true });
    }

    ctx.patchState({
      favorites: updatedFavorites
    });
  }

  @Action(RemoveFromFavorites)
  removeFromFavorites(ctx: StateContext<FavoritesStateModel>, action: RemoveFromFavorites) {
    const state = ctx.getState();
    const updatedFavorites = new Set(state.favorites);
    // Find the Favorite with the matching URL and toggle isFavorite
    updatedFavorites.forEach(favorite => {
      if (favorite.url === action.payload.url && favorite.isFavorite) {
        favorite.isFavorite = false; // Toggle the isFavorite property
      }
    });
    const itemToRemove = Array.from(updatedFavorites).find(favorite => favorite.url === action.payload.url);

    if (itemToRemove) {
      updatedFavorites.delete(itemToRemove);
    }

    ctx.patchState({
      favorites: updatedFavorites
    });
  }

  @Action(GetPhotos)
  getPhotos(ctx: StateContext<FavoritesStateModel>): Observable<any> {
    ctx.patchState({ loading: true });
    const { nextPage } = ctx.getState();
    return this.photoService.getPhotos().pipe(
      delay(300),
      tap(({headers, photos}) => {

        // Extract Link header from the headers
        const linkHeader = headers.headers.get('Link');

        // Parse the Link header to get the next page URL
        const nextPageUrl = parseLinkHeader(linkHeader ?? '') ?? nextPage;

        const transformedPhotos = photos.map(photo => {
          return {
            ...photo,
            isFavorite: false
          }
        });

        ctx.patchState({ photos: transformedPhotos, nextPage: nextPageUrl });
        return photos;
      }),
      catchError(error => {
        // Handle errors if needed
        return throwError(() => new Error(error));
      }),
      finalize(() => {
        ctx.patchState({ loading: false }); // Set loading to false after the call (success or error)
      })
    );
  }

  @Action(UpdatePhotos)
  updatePhotos(ctx: StateContext<FavoritesStateModel>): Observable<any> {
    ctx.patchState({ loading: true });
    const { nextPage } = ctx.getState();

    return this.photoService.getPhotos(nextPage).pipe(
      delay(300),
      tap(({headers, photos}) => {

        // Extract Link header from the headers
        const linkHeader = headers.headers.get('Link');

        // Parse the Link header to get the next page URL
        const nextPageUrl = parseLinkHeader(linkHeader ?? '')

        const state = ctx.getState();
        const updatedPhotos = [...state.photos, ...photos];

        ctx.patchState({
          photos: updatedPhotos,
          nextPage: nextPageUrl !== null ? nextPageUrl : nextPage
        });
      }),
      catchError(error => {
        // Handle errors if needed
        return throwError(() => new Error(error));
      }),
      finalize(() => {
        ctx.patchState({ loading: false }); // Set loading to false after the call (success or error)
      })
    );
  }
}

// Helper function to parse the Link header and extract the next page URL
function parseLinkHeader(linkHeader: string): number | null {
  if (!linkHeader) {
    return null;
  }

  const links = linkHeader.split(', ');
  const nextPageLink = links.find(link => link.includes('rel="next"'));

  if (!nextPageLink) {
    return null;
  }

  const match = nextPageLink.match(/page=(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function generateUniqueId(): string {
  // A function to generate a random hex string of given length
  const getRandomHexString = (length: number): string => {
    const characters = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
  };

  // Generate a timestamp-based string
  const timestamp = new Date().getTime().toString(16);

  // Generate a random string
  const randomPart = getRandomHexString(8);

  // Combine timestamp and random string to create the unique ID
  const uniqueId = timestamp + randomPart;

  return uniqueId;
}

function mergeArrays(mainArray: any[], secondaryArray: any[]) {
  const secondaryIndex = new Map(secondaryArray.map(item => [item.id, item]));

  return mainArray.map(mainItem => {
    const matchingItem = secondaryIndex.get(mainItem.id);

    if (matchingItem) {
      // Merge properties from the matching item
      return { ...mainItem, ...matchingItem };
    }

    // If no match found, return the original item
    return mainItem;
  });
}

