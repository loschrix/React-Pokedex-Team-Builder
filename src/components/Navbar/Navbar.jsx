import React from "react";
import styles from './Navbar.module.css';
import pokeball from "../../assets/pokeball.png";

function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.top}>
                <img src={String (pokeball)} alt='pokeball'/>
                <h1>Pokédex</h1>
            </div>
            <p>Build your ultimate team</p>
        </nav>
    )
}

export default Navbar;