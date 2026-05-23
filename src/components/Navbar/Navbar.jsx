import styles from './Navbar.module.css';
import pokeball from "../../assets/pokeball.png";

function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.top}>
                <img className={styles.logo} src={String (pokeball)} alt='pokeball'/>
                <h1 className={styles.title}>Pokédex</h1>
            </div>
            <p className={styles.subtitle}>Build your ultimate team</p>
        </nav>
    )
}

export default Navbar;