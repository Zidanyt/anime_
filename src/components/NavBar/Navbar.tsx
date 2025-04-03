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

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) && hamburgerRef.current && !hamburgerRef.current.contains(event.target as Node) && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <nav className={style.container}>
            <div className={style.left}>
                <button ref={hamburgerRef} className={style.hamburger} onClick={toggleMenu}>
                    ☰
                </button>
                <ul ref={menuRef} className={`${style.lista} ${isMenuOpen ? style.open : ''}`}>
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