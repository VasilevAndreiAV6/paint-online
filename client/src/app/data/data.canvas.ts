import { IElement } from "../models/element"
import { Line } from "../models/line"


export class GlobalData {
  public static elements: IElement[] = []
  public static indices: number[][] = []
  public static currentColor: [number, number, number] = [0, 0, 0]
  public static currentWidth: number = 20
  public static zoom: number = 1
  public static position: [number, number] = [0, 0]
  public static tool: string = "pencil"
}