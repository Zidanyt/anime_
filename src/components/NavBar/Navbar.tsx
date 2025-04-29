import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import style from './navBar.module.css';
import { useSearch } from '../../SearchContext';

interface NavbarProps {
  handleLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { searchTerm, setSearchTerm } = useSearch();
  const menuRef = useRef<HTMLUListElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(open => {
      const novo = !open;
      document.body.classList.toggle('menuOpenBody', novo);
      return novo;
    });
  };

  useEffect(() => {
    const handleClickOutsideMenu = (e: MouseEvent) => {
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
    document.addEventListener('mousedown', handleClickOutsideMenu);
    return () => document.removeEventListener('mousedown', handleClickOutsideMenu);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleMouseDownOutsideSearch = (e: MouseEvent) => {
      if (!isSearchOpen || !searchContainerRef.current) return;

      if (window.innerWidth > 785) {
        const clickedInside = searchContainerRef.current.contains(e.target as Node);
        if (!clickedInside) {
          setIsSearchOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleMouseDownOutsideSearch);
    return () => document.removeEventListener('mousedown', handleMouseDownOutsideSearch);
  }, [isSearchOpen, searchContainerRef]);

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

  const handleItemClick = (path: string) => {
    setActiveItem(path);
  };

  const shouldShowSearch = location.pathname === '/anime-list' || location.pathname === '/genres';

  return (
    <>
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
            <li
              className={`${style.icones} ${activeItem === '/recent' ? style.active : ''}`}
              onClick={() => handleItemClick('/recent')}
            >
              <Link className={style.link} to="/recent">Animes Recentes</Link>
            </li>
            <li
              className={`${style.icones} ${activeItem === '/favoritos' ? style.active : ''}`}
              onClick={() => handleItemClick('/favoritos')}
            >
              <Link className={style.link} to="/favoritos">Favoritos</Link>
            </li>
            <li
              className={`${style.icones} ${activeItem === '/Top10Animes' ? style.active : ''}`}
              onClick={() => handleItemClick('/Top10Animes')}
            >
              <Link className={style.link} to="/Top10Animes">Top 10</Link>
            </li>
            <li
              className={`${style.icones} ${activeItem === '/anime-list' ? style.active : ''}`}
              onClick={() => handleItemClick('/anime-list')}
            >
              <Link className={style.link} to="/anime-list">Lista de Animes</Link>
            </li>
            <li
              className={`${style.icones} ${activeItem === '/genres' ? style.active : ''}`}
              onClick={() => handleItemClick('/genres')}
            >
              <Link className={style.link} to="/genres">Gêneros</Link>
            </li>

          </ul>
        </div>
        <li className={style.navSearchMobile }>
            <div ref={searchContainerRef} className={style.mds}>
              {isSearchOpen && (
                <input
                  type="text"
                  className={style.searchInput}
                  placeholder="Pesquisar..."
                  value={searchTerm}
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
          </li>
        <button className={style.button} onClick={handleLogout}>
          Sair
        </button>
      </nav>
      {shouldShowSearch && (
        <div className={style.searchContainer} ref={searchContainerRef}>
          {isSearchOpen && (
            <input
              type="text"
              className={style.searchInput}
              placeholder="Pesquisar..."
              value={searchTerm}
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
      )}
    </>
  );
};

export default Navbar;