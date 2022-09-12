import { GlobalData } from "../data/data.canvas"
import { ElementType, IElement } from "./element"

export class Line implements IElement {
  type = ElementType.Line
  data = []
  color: number[]
  width: number
  x1 = 0
  x2 = 0
  y1 = 0
  y2 = 0

  // Line constructor
  constructor([x1, y1, x2, y2, width], color: number[]) {
    // Set class fields
    this.x1 = x1
    this.x2 = x2
    this.y1 = y1
    this.y2 = y2
    this.color = color
    this.width = width
  }

  // Draw line function
  draw(context: CanvasRenderingContext2D) {
    // Set drawing color
    context.strokeStyle = 'rgb(' + this.color[0] + ',' + this.color[1] + ',' + this.color[2] + ')'

    // Draw line
    context.lineCap = "round"
    context.lineWidth = this.width * GlobalData.zoom
    context.beginPath()
    context.moveTo(this.x1 * GlobalData.zoom + GlobalData.position[0] * GlobalData.zoom, this.y1 * GlobalData.zoom + GlobalData.position[1] * GlobalData.zoom)
    context.lineTo(this.x2 * GlobalData.zoom + GlobalData.position[0] * GlobalData.zoom, this.y2 * GlobalData.zoom + GlobalData.position[1] * GlobalData.zoom)
    context.stroke()
  }
}