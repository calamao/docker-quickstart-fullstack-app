using System.Collections.Generic;
using System.Linq;

namespace HMI.API.DataAccess.Models
{
    #region ItemEntityType

    /// <summary>
    /// The item.
    /// </summary>
    public class Item
    {

        /// <summary>
        /// The Id.
        /// </summary>
        private readonly int Id;

        /// <summary>
        /// The tags.
        /// </summary>
        private readonly List<Tag> tags = new List<Tag>();


        /// <summary>
        /// Initializes a new instance of the <see cref="Item"/> class.
        /// </summary>
        /// <param name="name">The name.</param>
        public Item(string name)
        {
            this.Name = name;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Item"/> class.
        /// </summary>
        /// <param name="id">
        /// The Id.
        /// </param>
        /// <param name="name">
        /// The name.
        /// </param>
        private Item(int id, string name)
        {
            this.Id = id;
            this.Name = name;
        }

        /// <summary>
        /// Gets the name.
        /// </summary>
        public string Name { get; }

        /// <summary>
        /// The tags.
        /// </summary>
        public IReadOnlyList<Tag> Tags => this.tags;


        /// <summary>
        /// The add tag.
        /// </summary>
        /// <param name="label">The label.</param>
        /// <returns>The <see cref="Tag"/>.</returns>
        public Tag AddTag(string label)
        {
            var tag = this.tags.FirstOrDefault(t => t.Label == label);

            if (tag == null)
            {
                tag = new Tag(label);
                this.tags.Add(tag);
            }

            tag.Count++;

            return tag;
        }

    }
    #endregion
}