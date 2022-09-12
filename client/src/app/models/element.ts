// Element type enum
export enum ElementType {
  NullElement,
  Line,
}

// Element Interface
export interface IElement {
  type: ElementType
  data: number[]
  color: number[]
  draw(context)
}
