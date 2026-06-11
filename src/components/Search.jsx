import React, { useState } from 'react';
import styles from '../App.module.css';

function Search({ onSearch, searchTerm}){
/*  Os props deste função são passados de um componente externo, como no exemplo:
    "<Search onSearch={handleChange} searchTerm={searchTerm} />"
    Para entender o fluxo como um todo, vide como é feito no App.jsx.
*/
    return(
        <div>
            <label htmlFor="search" className={styles.searchLabel}>Pesquisar: </label>
            <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={onSearch}
                className={styles.searchInput}
            />
        </div>
    );
}

export default Search;