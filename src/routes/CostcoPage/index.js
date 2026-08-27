import React, {useEffect, useMemo, useRef, useState} from 'react';
import {connect} from 'react-redux';
import {Loader} from 'semantic-ui-react';
import TicketList from './TicketList';
import ProductSearch from './ProductSearch';
import TopProducts from './TopProducts';
import {setCostcoTickets, importCostcoTickets} from '../../actions/costcoTickets';
import {
   selectTicketsSorted,
   selectTicketsTotal,
   searchProducts,
   selectTopProductsByAppearance,
   selectTopProductsByCost,
} from '../../selectors/costcoTickets';
import {formatPesos} from '../../utils/costcoTickets';
import replaceAll from '../../utils/replaceAll';

const TABS = {
   tickets: 'tickets',
   search: 'search',
   top: 'top',
};

export const CostcoPage = (props) => {
   const {
      items,
      loaded,
      loading,
      locale,
      dictionary,
      setCostcoTickets: loadTickets,
      importCostcoTickets: importTickets,
   } = props;
   const dict = dictionary.pageCostco;
   const fileInputRef = useRef(null);
   const [activeTab, setActiveTab] = useState(TABS.tickets);
   const [selectedTicket, setSelectedTicket] = useState(null);
   const [query, setQuery] = useState('');
   const [importMessage, setImportMessage] = useState(null);

   useEffect(() => {
      loadTickets();
   }, []);

   const sortedTickets = useMemo(() => selectTicketsSorted(items), [items]);
   const ticketsTotal = useMemo(() => selectTicketsTotal(items), [items]);
   const searchResults = useMemo(() => searchProducts(items, query), [items, query]);
   const topByAppearance = useMemo(
      () => selectTopProductsByAppearance(items, 15),
      [items],
   );
   const topByCost = useMemo(() => selectTopProductsByCost(items, 15), [items]);

   const onImportClick = () => {
      if (!loaded || !fileInputRef.current) {
         return;
      }
      fileInputRef.current.click();
   };

   const onFileChange = (event) => {
      const file = event.target.files && event.target.files[0];
      event.target.value = '';
      if (!file) {
         return;
      }

      const reader = new FileReader();
      reader.onload = () => {
         try {
            const parsed = JSON.parse(reader.result);
            if (!Array.isArray(parsed)) {
               setImportMessage({error: true, text: dict.importInvalid});
               return;
            }
            importTickets(parsed)
               .then((result) => {
                  setImportMessage({
                     error: false,
                     text: replaceAll(dict.importSuccess, {
                        '{p1}': String(result.added),
                        '{p2}': String(result.updated),
                     }),
                  });
               })
               .catch((error) => {
                  const detail = error && error.message ? error.message : '';
                  setImportMessage({
                     error: true,
                     text: detail ? `${dict.importError} ${detail}` : dict.importError,
                  });
               });
         } catch (error) {
            setImportMessage({error: true, text: dict.importInvalid});
         }
      };
      reader.readAsText(file);
   };

   return (
      <div>
         <div className="page-header">
            <div className="content-container">
               <h1 className="page-header__title">{dict.title}</h1>
               {loaded && (
                  <h4 className="page-header__subtitle">
                     {items.length} {dict.ticketsWord} · {formatPesos(ticketsTotal)}
                  </h4>
               )}
               <div className="page-header__actions">
                  <div className="costco-tabs">
                     <button
                        className={activeTab === TABS.tickets ? 'button' : 'button button-gray'}
                        onClick={() => setActiveTab(TABS.tickets)}
                     >
                        {dict.tabTickets}
                     </button>
                     <button
                        className={activeTab === TABS.search ? 'button' : 'button button-gray'}
                        onClick={() => setActiveTab(TABS.search)}
                     >
                        {dict.tabSearch}
                     </button>
                     <button
                        className={activeTab === TABS.top ? 'button' : 'button button-gray'}
                        onClick={() => setActiveTab(TABS.top)}
                     >
                        {dict.tabTop}
                     </button>
                  </div>
                  <div>
                     <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json,application/json"
                        className="costco-file-input"
                        onChange={onFileChange}
                     />
                     <button
                        className="button button-green"
                        onClick={onImportClick}
                        disabled={!loaded}
                     >
                        {dict.importButton}
                     </button>
                  </div>
               </div>
               {importMessage && (
                  <p
                     className={
                        importMessage.error
                           ? 'costco-import-message costco-import-message--error'
                           : 'costco-import-message'
                     }
                  >
                     {importMessage.text}
                  </p>
               )}
            </div>
         </div>

         <div className="content-container">
            {loading && !loaded && (
               <div className="costco-loader">
                  <Loader active inline="centered">
                     {dict.loading}
                  </Loader>
               </div>
            )}

            {loaded && activeTab === TABS.tickets && (
               <TicketList
                  tickets={sortedTickets}
                  locale={locale}
                  dictionary={dictionary}
                  selectedTicket={selectedTicket}
                  onSelect={setSelectedTicket}
                  onClose={() => setSelectedTicket(null)}
               />
            )}

            {loaded && activeTab === TABS.search && (
               <ProductSearch
                  query={query}
                  onQueryChange={setQuery}
                  results={searchResults}
                  locale={locale}
                  dictionary={dictionary}
               />
            )}

            {loaded && activeTab === TABS.top && (
               <TopProducts
                  byAppearance={topByAppearance}
                  byCost={topByCost}
                  dictionary={dictionary}
               />
            )}
         </div>
      </div>
   );
};

const mapStateToProps = (state) => ({
   items: state.costcoTickets.items,
   loaded: state.costcoTickets.loaded,
   loading: state.costcoTickets.loading,
   locale: state.lang.locale,
   dictionary: state.lang.dictionary,
});

const mapDispatchToProps = (dispatch) => ({
   setCostcoTickets: () => dispatch(setCostcoTickets()),
   importCostcoTickets: (tickets) => dispatch(importCostcoTickets(tickets)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CostcoPage);
