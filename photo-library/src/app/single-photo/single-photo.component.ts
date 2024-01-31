// single-photo.component.ts
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-single-photo',
  templateUrl: './single-photo.component.html',
  styleUrls: ['./single-photo.component.scss']
})
export class SinglePhotoComponent {
  constructor(private route: ActivatedRoute, private photoService: PhotoService) {}

  // Implement your component logic here
}
