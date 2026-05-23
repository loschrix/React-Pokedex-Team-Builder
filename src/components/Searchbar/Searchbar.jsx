import React from "react";
import styles from "./Searchbar.module.css";

function Searchbar() {
    return (
        <div className={styles.searchContainer}>
            <input
                type="text"
                className={styles.searchInput}
                placeholder="Search for Pokémon..."
            />
        </div>
    )
}

export default Searchbar;