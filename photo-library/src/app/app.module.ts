// app.module.ts
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsModule } from '@ngxs/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FavoritesState } from './favorites-state/state/favorites.state';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    NgxsModule.forRoot([FavoritesState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot()
  ],
  providers: [
    /**
       * Here we have a problem with the deserialization of the Set<Favorite> , needs a way around this issue .
       *
       * */
    // {
    //   provide: NGXS_PLUGINS,
    // useValue: persistPlugin,
    // multi: true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
