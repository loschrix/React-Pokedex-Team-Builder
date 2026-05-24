import styles from "./Searchbar.module.css";

function Searchbar({ value, onChange }) {
    return (
        <div className={styles.searchContainer}>
            <div className={styles.searchField}>
                <span className={styles.searchIcon} aria-hidden="true">⌕</span>
                <input
                    id="pokemon-search"
                    type="text"
                    className={styles.searchInput}
                    placeholder="Try Pikachu, 025..."
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                />
                <button
                    type="button"
                    className={styles.clearButton}
                    onClick={() => onChange("")}
                    disabled={!value}
                >
                    Clear
                </button>
            </div>
        </div>
    );
}

export default Searchbar;
