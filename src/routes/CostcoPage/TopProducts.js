import React from 'react';
import CTable from '../../components/Table';

const TopProducts = ({byAppearance, byCost, dictionary}) => {
   const dict = dictionary.pageCostco;

   return (
      <div className="costco-top-grid">
         <div>
            <CTable
               title={dict.topByAppearance}
               rows={byAppearance.map((product) =>
                  Object.assign({}, product, {
                     percentLabel: `${Math.round(product.percent * 10) / 10}%`,
                  }),
               )}
               columns={[
                  {
                     name: 'descripcion',
                     label: dict.productColumn,
                     width: 8,
                  },
                  {
                     name: 'timesBought',
                     label: dict.timesColumn,
                     textAlign: 'right',
                     width: 2,
                  },
                  {
                     name: 'ticketsLabel',
                     label: dict.ticketsColumn,
                     textAlign: 'right',
                     width: 3,
                  },
                  {
                     name: 'percentLabel',
                     label: dict.percentColumn,
                     textAlign: 'right',
                     width: 3,
                  },
               ]}
            />
         </div>
         <div>
            <CTable
               title={dict.topByCost}
               rows={byCost}
               columns={[
                  {
                     name: 'descripcion',
                     label: dict.productColumn,
                     width: 8,
                  },
                  {
                     name: 'totalSpent',
                     label: dict.spentColumn,
                     format: 'pesos',
                     textAlign: 'right',
                     width: 3,
                  },
                  {
                     name: 'avgPrice',
                     label: dict.avgColumn,
                     format: 'pesos',
                     textAlign: 'right',
                     width: 3,
                  },
                  {
                     name: 'lastPrice',
                     label: dict.lastPriceColumn,
                     format: 'pesos',
                     textAlign: 'right',
                     width: 2,
                  },
               ]}
            />
         </div>
      </div>
   );
};

export default TopProducts;
