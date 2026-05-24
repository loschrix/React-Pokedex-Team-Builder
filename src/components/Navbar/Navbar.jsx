import styles from "./Navbar.module.css";
import pokeball from "../../assets/pokeball.png";

function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.top}>
                <img className={styles.logo} src={String(pokeball)} alt="Pokeball logo" />
                <div className={styles.titleBlock}>
                    <h1 className={styles.title}>Pokédex</h1>
                    <p className={styles.subtitle}>Build your ultimate Kanto team</p>
                </div>
            </div>

            <span className={styles.badge}>Trainer Mode</span>
        </nav>
    );
}

export default Navbar;
