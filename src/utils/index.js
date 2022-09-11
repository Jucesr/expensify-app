import moment from 'moment';

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

export const addOrRemove = (arr, item) => arr.includes(item) ? arr.filter(i => i !== item) : [ ...arr, item ];

export const convertArrayToObject = (array, property = 'id') => {
   return array.reduce((current, item) => {
      const id = item[property];
      current[id] = item;
      return current
   }, {})
};

export const replaceAll = (text = '', search, replacement) => {
   //for (var x in obj) {
   if (text == null || typeof text !== 'string')
      return '';
   text = text.replace(new RegExp(search, 'g'), replacement);

   return text;
};

export const formatValue = (format, value) => {

   const type = typeof format === 'string' ? format : format.type;
   const decimals = typeof format === 'string' ? 2 : format.decimals;

   const transform = function (org, n, x, s, c) {
      const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
         num = org.toFixed(Math.max(0, ~~n));

      return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
   };
   switch (type) {
      case 'currency':
         return !isNaN(value) ? (
            `$${transform(parseFloat(value), decimals, 3, ',', '.')}`
         ) : value;
      case 'number':
         return !isNaN(value) ? (
            `${transform(parseFloat(value), decimals, 3, ',', '.')}`
         ) : value;
      case 'percentage':
         return !isNaN(value) ? (
            `${transform(parseFloat(value), decimals, 3, ',', '.')}%`
         ) : value;
      case 'date':
         if (!value) {
            return '';
         }
         return moment(value).format('DD MMMM YYYY');
      case 'datemonth':
         if (!value) {
            return '';
         }
         return capitalize(moment(value).format('MMMM YYYY'));
      case 'datetime':
         if (!value) {
            return '';
         }
         return moment(value).format('DD MMMM YYYY, HH:mm');
      case 'time':
         if (!value) {
            return '';
         }
         return moment(`2021-04-04 ${value}`).format('hh:mm A');
      case 'timeonly':
         if (!value) {
            return '';
         }
         return moment(value).format('hh:mm A');
      default:
         return value
   }
};

export const capitalize = (s) => {
   if (typeof s !== 'string') return ''
   return s.charAt(0).toUpperCase() + s.slice(1)
}

export const sortByDate = (property, desc = false) => {
   return (a, b) => {
      const compareId = (alternative) => {
         if (a.id != null && b.id != null) return a.id > b.id;
         else
            switch (alternative) {
               case 'after':
                  return moment(a[property]).isAfter(b[property]);
               case 'before':
                  return moment(a[property]).isBefore(b[property]);

               default:
                  break;
            }
      };

      const isSame = moment(a[property]).isSame(b[property]);
      const isAfter = isSame
         ? compareId('after')
         : moment(a[property]).isAfter(b[property]);
      const isBefore = isSame
         ? compareId('before')
         : moment(a[property]).isBefore(b[property]);

      if (desc ? isAfter : isBefore) {
         return -1;
      } else {
         return 1;
      }
   };
};

