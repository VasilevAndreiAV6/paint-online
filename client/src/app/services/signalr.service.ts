import { Injectable } from '@angular/core'
import * as signalR from "@microsoft/signalr"
import { GlobalData } from '../data/data.canvas'
import { ElementType, IElement } from '../models/element'
import { Line } from '../models/line'
import { NullElement } from '../models/null.element'

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: signalR.HubConnection

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/elements')
      .build()
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  public newElement = (elementType: ElementType, data: any, color: [number, number, number]) => {
    this.hubConnection.invoke('newElement', elementType, data, color)
      .catch(err => console.error(err))
  }

  public deleteElements = (indices: number[]) => {
    this.hubConnection.invoke('deleteElements', indices)
      .catch(err => console.error(err))
  }

  public restoreElements = (indices) => {
    this.hubConnection.invoke('restoreElements', indices)
      .catch(err => console.error(err))
  }

  public addBroadCastElementListener = () => {
    this.hubConnection.on('newElement', (elementType, data, color) => {
      switch (elementType) {
        case ElementType.Line:
          GlobalData.elements.push(new Line(data, color))
          var canvas = document.getElementById("paint-canvas") as HTMLCanvasElement
          GlobalData.elements.slice(-1)[0].draw(canvas.getContext("2d"))
          break
      }
    })

    this.hubConnection.on('deleteElements', (indices) => {
      indices.forEach((index: number) => {
        GlobalData.elements[index] = new NullElement()
      })

      var canvas = document.getElementById("paint-canvas") as HTMLCanvasElement
      var context = canvas.getContext("2d")
      context.clearRect(0, 0, canvas.width, canvas.height)
      GlobalData.elements.forEach(el => {
        el.draw(context)
      })
    })

    this.hubConnection.on('restoreElements', (res) => {
      GlobalData.elements = []
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
