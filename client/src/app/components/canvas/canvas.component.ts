import { Component, OnInit, HostListener } from '@angular/core'
import { GlobalData } from 'src/app/data/data.canvas'
import { ElementType } from 'src/app/models/element'
import { Line } from 'src/app/models/line'
import { SignalrService } from 'src/app/services/signalr.service'

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})

export class CanvasComponent implements OnInit {
  xOld = -1
  yOld = -1
  isLeft = false
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  width: number
  oneClickindices: number[] = []

  constructor(public signalRService: SignalrService) { }

  // Initialization function
  ngOnInit(): void {
    // Canvas and context fields set
    this.canvas = document.getElementById("paint-canvas") as HTMLCanvasElement
    this.context = this.canvas.getContext("2d")

    // Set canvas size
    this.canvas.width = (window.innerWidth) - 305
    this.canvas.height = window.innerHeight

    // Draw all elements
    GlobalData.elements.forEach(el => el.draw(this.context))

    // Resize listener
    window.addEventListener('resize', () => {
      this.canvas.width = (window.innerWidth) - 305
      this.canvas.height = window.innerHeight
      GlobalData.elements.forEach(el => el.draw(this.context))
    })

    // Width field set (for cursor size)
    this.width = Math.max(GlobalData.currentWidth, 6)
  }

  // Add and draw new element function
  draw(x1: number, y1: number, x2: number, y2: number): void {
    if (this.isLeft) {
      return
    }
    this.signalRService.newElement(ElementType.Line, [x1, y1, x2, y2, GlobalData.currentWidth], GlobalData.currentColor)
    GlobalData.elements.push(new Line([x1, y1, x2, y2, GlobalData.currentWidth], GlobalData.currentColor))
    GlobalData.elements.slice(-1)[0].draw(this.context)
    this.oneClickindices.push(GlobalData.elements.length - 1)
  }

  // Redraw all elements function
  redraw(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    GlobalData.elements.forEach(el => {
      el.draw(this.context)
    })
  }

  // Cursor leave
  leave(): void {
    document.getElementById("cursor-ball").style.top = 10000 + 'px'
    document.getElementById("cursor-ball").style.left = 10000 + 'px'
  }

  setCursorPos(x: number, y: number): void {
    this.width = Math.max(GlobalData.currentWidth * GlobalData.zoom, 6)
    document.getElementById("cursor-ball").style.top = (y - this.width / 2) + 'px'
    document.getElementById("cursor-ball").style.left = (x - this.width / 2) + 'px'
  }

  // Mouse in canvas
  canvasClick(e): void {
    // Set cursor type
    if (GlobalData.tool === "grab") {
      document.getElementById("cursor-ball").style.display = "none"
      this.canvas.classList.remove('paint')
      this.canvas.classList.add('grabbable')
    }
    else if (GlobalData.tool === 'pencil' || GlobalData.tool === 'eraser') {
      document.getElementById("cursor-ball").style.display = "block"
      this.canvas.classList.remove('grabbable')
      this.canvas.classList.add('paint')
    }
    else {
      this.canvas.classList.remove('grabbable')
      this.canvas.classList.remove('paint')
    }

    // Get x, y
    let rect = e.target.getBoundingClientRect()
    let x = e.clientX - rect.left
    let y = e.clientY - rect.top

    // Set width of line (for cursor size)
    this.setCursorPos(x, y)

    // Do smth if left-button clicked (depends on tool)
    if (e.buttons > 0 && e.button === 0) {
      if (GlobalData.tool === "pencil") {
        this.draw(
          (this.xOld) / GlobalData.zoom - GlobalData.position[0],
          (this.yOld) / GlobalData.zoom - GlobalData.position[1],
          (x) / GlobalData.zoom - GlobalData.position[0],
          (y) / GlobalData.zoom - GlobalData.position[1])
      }
      else if (GlobalData.tool === "grab") {
        GlobalData.position[0] += (x - this.xOld) / GlobalData.zoom
        GlobalData.position[1] += (y - this.yOld) / GlobalData.zoom
        this.redraw()
      }
      else if (GlobalData.tool === "eraser") {
        var col = GlobalData.currentColor
        GlobalData.currentColor = [255, 255, 255]
        this.draw(
          (this.xOld) / GlobalData.zoom - GlobalData.position[0],
          (this.yOld) / GlobalData.zoom - GlobalData.position[1],
          (x) / GlobalData.zoom - GlobalData.position[0],
          (y) / GlobalData.zoom - GlobalData.position[1])
        GlobalData.currentColor = col
      }
    }
    this.xOld = x
    this.yOld = y
    this.isLeft = false
  }

  // Mouse wheel listener function
  @HostListener('wheel', ['$event'])
  zoom($event): void {
    // Get x, y
    let rect = $event.target.getBoundingClientRect()
    let x = $event.clientX - rect.left
    let y = $event.clientY - rect.top

    // Zoom in/out
    var factor = .9
    if ($event.deltaY < 0) {
      factor = 1 / factor
    }
    GlobalData.zoom *= factor
    GlobalData.position[0] -= x / GlobalData.zoom * (factor - 1)
    GlobalData.position[1] -= y / GlobalData.zoom * (factor - 1)

    // Set width of line (for cursor size)
    this.setCursorPos(x, y)

    this.redraw()
  }

  setLines(): void {
    GlobalData.indices.push(this.oneClickindices)
    this.oneClickindices = []
  }
}
