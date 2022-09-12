import { Component, OnInit } from '@angular/core'
import { GlobalData } from 'src/app/data/data.canvas'
import { NullElement } from 'src/app/models/null.element'
import { SignalrService } from 'src/app/services/signalr.service'

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  colorArray: string[][] = []
  recentColorsArray: string[][] = []
  recentlyDeletedIndices: number[][] = []

  constructor(public signalRService: SignalrService) { }

  // Initialization function
  ngOnInit(): void {
    // Default colors in color picker
    var colors = [
      '#7a1dbd', // purple
      '#1010ff', // blue
      '#10ffff', // cyan
      '#10ff10', // green
      '#ffff10', // yellow
      '#ffb510', // orange
      '#964B00', // brown
      '#ff1010', // red
      '#FFd0dB', // pink
      '#ffffff', // white
      '#808080', // gray
      '#000000', // black
    ]

    // Recent colors array
    var recentColors = [
      [255, 255, 255],
      [255, 255, 255],
      [255, 255, 255],
      [255, 255, 255],
      [255, 255, 255],
      [255, 255, 255],
      [255, 255, 255],
      [255, 255, 255],
      [255, 255, 255],
      [255, 255, 255],
      [255, 255, 255],
      [255, 255, 255],
    ]

    // Add delault colors
    for (let i = 0; i < colors.length; i++) {
      if (i % 6 == 0)
        this.colorArray.push([])
      this.colorArray[Math.floor(i / 6)].push(colors[i]);
    }

    // Add recent colors
    for (let i = 0; i < 12; i++) {
      if (i % 6 == 0)
        this.recentColorsArray.push([])
      this.recentColorsArray[Math.floor(i / 6)].push('rgb(' + recentColors[i][0] + ', ' + + recentColors[i][1] + ', ' + recentColors[i][2] + ')');
    }
  }

  // Push new color function
  pushNewColor(col: string): void {
    var arr = []

    // Get 1-dim array
    this.recentColorsArray.forEach(row => {
      row.forEach(el => {
        arr.push(el)
      })
    })
    // Add element to beginning of array
    arr.unshift(col)
    arr.pop()

    // Convert to 2-dim array
    this.recentColorsArray = []
    for (let i = 0; i < 12; i++) {
      if (i % 6 == 0)
        this.recentColorsArray.push([])
      this.recentColorsArray[Math.floor(i / 6)].push(arr[i]);
    }
  }

  // Change line width function
  changeLineWidth(e: Event): void {
    GlobalData.currentWidth = parseInt((e.target as HTMLInputElement).value)
  }

  // Change color from HTML input element function
  changeColorInput(e: Event) {
    // Convert 'hex-string color' into array of 3 color values
    (e.target as HTMLInputElement).value.match(/[0-9a-fA-F]{2}/g).map((c, i) => {
      GlobalData.currentColor[i] = parseInt(c, 16)
    })
    this.pushNewColor((e.target as HTMLInputElement).value)
  }

  // Change color from default and recent colors function
  changeColor(e: Event): void {
    // Set current color data
    var col = (e.target as HTMLDivElement).style.backgroundColor.split(', ').map(str => { return parseInt(str.replace(/^\D+/g, '')) })
    GlobalData.currentColor[0] = col[0]
    GlobalData.currentColor[1] = col[1]
    GlobalData.currentColor[2] = col[2]

    // Set HTML input color to choosen color
    var stringCol = ''
    GlobalData.currentColor.forEach(v => {
      if (v < 16)
        stringCol += '0' + v.toString(16)
      else
        stringCol += v.toString(16)
    });
    (<HTMLInputElement>document.getElementById('color-input')).value = '#' + stringCol
  }

  //
  // Set tools functions
  //

  // Set pencil function
  setPencil(): void {
    GlobalData.tool = "pencil"
  }

  // Set pencil function
  setGrab(): void {
    GlobalData.tool = "grab"
  }

  // Set pencil function
  setEraser(): void {
    GlobalData.tool = "eraser"
  }

  // Undo last action
  undo(): void {
    if (GlobalData.indices.length == 0) {
      return
    }

    this.signalRService.deleteElements(GlobalData.indices.slice(-1)[0])

    GlobalData.indices.slice(-1)[0].forEach(index => {
      GlobalData.elements[index] = new NullElement
    })

    this.recentlyDeletedIndices.push(GlobalData.indices.pop())

    // Redraw all elements
    var canvas = document.getElementById("paint-canvas") as HTMLCanvasElement
    var context = canvas.getContext("2d")
    context.clearRect(0, 0, canvas.width, canvas.height)
    GlobalData.elements.forEach(el => {
      el.draw(context)
    })
  }

  // Redo last action
  redo(): void {
    if (this.recentlyDeletedIndices.length == 0) {
      return
    }

    GlobalData.indices.push(this.recentlyDeletedIndices.pop())
    this.signalRService.restoreElements(GlobalData.indices.slice(-1)[0])
  }

  getIndexArrayLength() {
    return GlobalData.indices.length
  }
}
