/** Group items that have the same parent in headers
 * @param {Array<Object>} flatListItems The flat list of items that would be groupped by the property
 * @param {String} property The property that will be used to group items
 * @return {Object} Key-value pairs with items groupped where key will be the property value
 */
 export const groupItemsByProperty = (flatListItems, property) => {
   return flatListItems.reduce((acum, item) => {
      const propertyValue = item[property];
      const currentItems = acum[propertyValue] ? acum[propertyValue] : [];
      return {
         ...acum,
         [propertyValue]: [
            ...currentItems,
            item,
         ],
      }
   }, {})
}

/** Generates a random integer between min and max
 * @param {Number} min
 * @param {Number} max 
 * @return {Number}
 */
export const randomInt = (min, max) => {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}
