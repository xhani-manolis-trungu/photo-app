import { bootstrapApplication } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// bootstrapApplication(AppModule)
//   .catch((err) => console.error(err));

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
