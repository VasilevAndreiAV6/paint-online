import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { NgChartsModule } from 'ng2-charts'

import { AppComponent } from './app.component'
import { CanvasComponent } from './components/canvas/canvas.component'
import { PanelComponent } from './components/panel/panel.component'

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    PanelComponent
  ],
  imports: [
    BrowserModule,
    NgChartsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
