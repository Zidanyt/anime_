import React, { useState, useEffect, useRef } from 'react';
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
  const menuRef = useRef<HTMLUListElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Abre/fecha menu e aplica classe no body
  const toggleMenu = () => {
    setIsMenuOpen(open => {
      const novo = !open;
      document.body.classList.toggle('menuOpenBody', novo);
      return novo;
    });
  };

  // Fecha menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
        document.body.classList.remove('menuOpenBody');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Desliga animação durante resize para evitar “piscar”
  useEffect(() => {
    let resizeTimer: number;
    const onResize = () => {
      const el = menuRef.current;
      if (el) el.style.transition = 'none';
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (el) el.style.transition = '';
      }, 200);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
    };
  }, []);

  const toggleSearch = () => setIsSearchOpen(v => !v);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      {/* Overlay */}
      <div className={style.overlay} onClick={toggleMenu} />

      <nav className={style.container}>
        <div className={style.left}>
          <button
            ref={hamburgerRef}
            className={style.hamburger}
            onClick={toggleMenu}
          >
            ☰
          </button>

          <ul
            ref={menuRef}
            className={`${style.slideMenu} ${isMenuOpen ? style.open : ''}`}
          >

            {/* Itens do menu */}
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
            <li className={style.icones}>
              <Link className={style.link} to="/genres">Gêneros</Link>
            </li>
            <li className={style.navSearchMobile}>
              {isSearchOpen && (
                <input
                  type="text"
                  className={style.searchInput}
                  placeholder="Pesquisar..."
                  onChange={handleSearchChange}
                  autoFocus
                />
              )}
              <button
                className={style.searchButton}
                onClick={toggleSearch}
              >
                <FiSearch size={20} />
              </button>
            </li>
          </ul>
        </div>
        <button className={style.button} onClick={handleLogout}>
          Sair
        </button>
      </nav>
       {/* Busca no topo (desktop) */}
       <div className={style.searchContainer}>
          {isSearchOpen && (
            <input
              type="text"
              className={style.searchInput}
              placeholder="Pesquisar..."
              onChange={handleSearchChange}
              autoFocus
            />
          )}
          <button
            className={style.searchButton}
            onClick={toggleSearch}
          >
            <FiSearch size={20} />
          </button>
        </div>
    </>
  );
};

export default Navbar;
