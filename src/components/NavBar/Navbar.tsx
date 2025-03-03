// Navbar.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import style from './navBar.module.css';
import { useSearch } from '../../SearchContext';

interface NavbarProps {
  handleLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { setSearchTerm } = useSearch();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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
      <div className={style.searchContainer}>
        {isSearchOpen && (
          <input
            type="text"
            className={style.searchInput}
            placeholder="Pesquisar..."
            onChange={handleSearchChange}
          />
        )}
        <button className={style.searchButton} onClick={toggleSearch}>
          <FiSearch size={20} color={'white'} />
        </button>
      </div>
      <button className={style.button} onClick={handleLogout}>Sair</button>
    </nav>
  );
};

export default Navbar;