using Microsoft.AspNetCore.SignalR;
using paint.online.server.DataStorage;
using paint.online.server.Models;
using System;

namespace paint.online.server.HubConfig
{
    public class ElementsHub : Hub
    {
        public async Task NewElement(ElementType type, float[] data, int[] color)
        {
            DataManager.elements.Add(new ElementModel(type, data, color));
            await Clients.Others.SendAsync("newElement", type, data, color);
        }

        public async Task RestoreElements(int[] indices)
        {
            if (indices == null)
                return;

            foreach (int index in indices)
            {
                DataManager.elements[index] = DataManager.recentlyDeletedElements[index];
                DataManager.recentlyDeletedElements[index] = new ElementModel(ElementType.NullElement, new float[0], new int[0]);
            }

            await Clients.All.SendAsync("restoreElements", DataManager.elements);
        }

        public async Task DeleteElements(int[] indices)
        {
            if (indices == null)
                return;

            int size = DataManager.recentlyDeletedElements.Count;

            if (size < indices[indices.Length - 1])
            {
                for (int i = 0; i <= indices[indices.Length - 1] - size; i++)
                {
                    DataManager.recentlyDeletedElements.Add(new ElementModel(ElementType.NullElement, new float[0], new int[0]));
                }
            }

            foreach (int index in indices)
            {
                DataManager.recentlyDeletedElements[index] = DataManager.elements[index];
                DataManager.elements[index] = new ElementModel(ElementType.NullElement, new float[0], new int[0]);
            }
            await Clients.Others.SendAsync("deleteElements", indices);
        }

    }
}
