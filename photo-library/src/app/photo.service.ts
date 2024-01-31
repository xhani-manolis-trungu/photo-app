// services/photo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AddToFavorites, Photos, RemoveFromFavorites } from './favorites-state/state/favorites.state';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private apiUrl = 'https://picsum.photos/v2/list?page=1&limit=10';

  constructor(private store: Store, private http: HttpClient) {}

  private handleApiError(error: any): void {
    // Handle API error (e.g., log, display error message)
    console.error('API error:', error);
  }

  private dispatchFavoritesAction(action: any): void {
    this.store.dispatch(action)
      .pipe(
        catchError((error) => {
          this.handleApiError(error);
          return of(null);
        })
      )
      .subscribe();
  }

  // Example method to fetch photos from an external API
  getPhotos(page?: number | null): Observable<{ headers: HttpResponse<any>, photos: Photos[] }> {
    const url = `https://picsum.photos/v2/list?page=${page}&limit=10`
    return this.http.get(url, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => ({
        headers: response,
        photos: response.body,
      })),
      catchError((error) => {
        this.handleApiError(error);
        return of({} as {headers: HttpResponse<any>, photos: Photos[]});
      })
    );
  }

  addToFavorites(photo: any): void {
    this.dispatchFavoritesAction(new AddToFavorites(photo));
  }

  removeFromFavorites(photo: any): void {
    this.dispatchFavoritesAction(new RemoveFromFavorites(photo));
  }
}
