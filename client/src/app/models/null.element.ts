import { ElementType, IElement } from "./element"

export class NullElement implements IElement {
  type = ElementType.NullElement
  data = []
  color = []

  draw(): void { }
}