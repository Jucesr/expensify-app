const tickets = [
   {
      id: 't1',
      sucursal: 'MEXICALI',
      fecha: '09/08/2026',
      hora: '08:12:00 PM',
      metodo_pago: 'TC COSTCO',
      articulos_totales: 3,
      total: 444.00,
      productos: [
         {articulo: '638212', descripcion: 'HUEVO GALLINA LIBR', precio: 349.00},
         {articulo: '782796', descripcion: 'KS AGUA 40/500ML', precio: 105.00},
         {articulo: '999', descripcion: 'Cupon de descuento', precio: -10.00},
      ],
   },
   {
      id: 't2',
      sucursal: 'MEXICALI',
      fecha: '01/08/2026',
      hora: '02:10:00 PM',
      metodo_pago: 'TC COSTCO',
      articulos_totales: 2,
      total: 464.00,
      productos: [
         {articulo: '638212', descripcion: 'HUEVO GALLINA LIBR', precio: 349.00},
         {articulo: '597354', descripcion: 'WEBERS PAN 2/567G', precio: 115.00},
      ],
   },
   {
      id: 't3',
      sucursal: 'MEXICALI',
      fecha: '20/06/2026',
      hora: '06:15:00 PM',
      metodo_pago: 'TC COSTCO',
      articulos_totales: 1,
      total: 105.00,
      productos: [
         {articulo: '782796', descripcion: 'KS AGUA 40/500ML', precio: 105.00},
      ],
   },
];

export default tickets;
