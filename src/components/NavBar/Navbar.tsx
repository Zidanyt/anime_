import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import style from './navBar.module.css';

interface NavbarProps {
  handleLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={style.container}>
      <div className={style.left}>
        <button className={style.hamburger} onClick={toggleMenu}>
          ☰
        </button>
        <ul className={`${style.lista} ${isMenuOpen ? style.open : ''}`}>
          <li className={style.icones}>
            <Link className={style.link} to="/recent">Animes Recentes</Link>
          </li>
          <li className={style.icones}>
            <Link className={style.link} to="/favoritos">Favoritos</Link>
          </li>
          <li className={style.icones}>
            <Link className={style.link} to="/Top10Animes">Top 10</Link>
          </li>
          <li className={style.icones}>
            <Link className={style.link} to="/anime-list">Lista de Animes</Link>
          </li>
        </ul>
      </div>
      <button className={style.button} onClick={handleLogout}>Sair</button>
    </nav>
  );
};

export default Navbar;
