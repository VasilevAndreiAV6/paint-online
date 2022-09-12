namespace paint.online.server.Models
{
    public enum ElementType
    {
        NullElement,
        Line,
    }

    public class ElementModel
    {
        public ElementType Type { get; set; }
        public float[] data { get; set; }
        public int[] color { get; set; }

        public ElementModel (ElementType type, float[] data, int[] color)
        {
            this.Type = type;
            this.data = data;
            this.color = color;
        }
    }
}
