import { TestBed } from "@angular/core/testing";
import { PhotoService } from "./photo.service";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Store } from "@ngxs/store";

describe('PhotoService', () => {
  let service: PhotoService;
  let httpTestingController: HttpTestingController;
  let storeMock: { dispatch: jest.Mock };

  beforeEach(() => {
    storeMock = { dispatch: jest.fn() };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PhotoService,
        { provide: Store, useValue: storeMock },
      ],
    });

    service = TestBed.inject(PhotoService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch photos from the API', () => {
    const dummyPhotos = [{ /* Your dummy photo data */ }];
    const dummyResponse = { body: dummyPhotos };

    service.getPhotos().subscribe(photos => {
      expect(photos).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne('https://picsum.photos/v2/list?page=1&limit=10');
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should add a photo to favorites', () => {
    const dummyPhoto = { /* Your dummy photo data */ };

    service.addToFavorites(dummyPhoto);

    expect(storeMock.dispatch).toHaveBeenCalledWith(expect.anything());
  });

  it('should remove a photo from favorites', () => {
    const dummyPhoto = { /* Your dummy photo data */ };

    service.removeFromFavorites(dummyPhoto);

    expect(storeMock.dispatch).toHaveBeenCalledWith(expect.anything());
  });
});
