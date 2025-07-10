import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// 支援 Angular localize
import '@angular/localize/init';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
