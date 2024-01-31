// favorites.component.ts
import { Component } from '@angular/core';
import { PhotoService } from '../photo.service';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent {
  constructor(private store: Store) {

  }

  // Implement your component logic here
}
