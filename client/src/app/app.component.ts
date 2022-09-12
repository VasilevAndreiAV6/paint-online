import { Component, OnInit } from '@angular/core'
import { SignalrService } from './services/signalr.service'
import { HttpClient } from '@angular/common/http'
import { GlobalData } from './data/data.canvas'
import { ElementType, IElement } from './models/element'
import { Line } from './models/line'
import { NullElement } from './models/null.element'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public signalRService: SignalrService, private http: HttpClient) { }

  ngOnInit() {
    this.signalRService.startConnection()
    this.signalRService.addBroadCastElementListener()
    this.startHttpRequest()
  }

  private startHttpRequest = () => {
    this.http.get('https://localhost:5001/api/elements')
      .subscribe(res => {
        var els = res as Array<IElement>
        els.forEach(el => {
          switch (el.type) {
            case ElementType.Line:
              var data = el.data as [any, any, any, any, any]
              GlobalData.elements.push(new Line(data, el.color))
              var canvas = document.getElementById("paint-canvas") as HTMLCanvasElement
              GlobalData.elements.slice(-1)[0].draw(canvas.getContext("2d"))
              break
            case ElementType.NullElement:
              GlobalData.elements.push(new NullElement())
              break
          }
        })
      })
  }
}
