import React, { useState, useEffect } from 'react'
import "./header.css"

const Header = ({ style }) => {
    const [Toggle, showMenu] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [headerClass, setHeaderClass] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > lastScrollY) {
                // Scrolling down
                setHeaderClass('scrolled');
            } else {
                // Scrolling up
                setHeaderClass('visible');
            }
            
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return (
        <header className={`header ${headerClass}`} style={style}>
            <nav className="nav container">
                <a href="https://www.unicatolica.edu.co/" className="nav__logo">
                    <img src='https://www.unicatolica.edu.co/files/unicatolica-svg.svg' alt="Logo de Unicatolica"/>
                </a>

                <div className={Toggle ? "nav__menu show-menu" : "nav__menu"}>
                    <ul className="nav__list grid">
                        <li className="nav__item">
                            <a href="index.html" className="nav__link active-link">
                            <ion-icon class="nav__icon md hydrated" role="img" name="home-outline" title="Inicio" aria-label="Inicio"></ion-icon>
                                Casa 
                            </a>
                        </li>
                        <li className="nav__item">
                            <a href="#Soporte" className="nav__link">
                            <ion-icon class="nav__icon md hydrated" role="img" name="call-outline" title="Contacto" aria-label="Contacto"></ion-icon>
                                Soporte
                            </a>
                        </li>
                    </ul>

                    <ion-icon class="nav__close md hydrated" role="img" name="close-outline" title="Cerrar menú" aria-label="Cerrar menú"></ion-icon>

                </div>

                <div className="nav__toggle" onClick={() => showMenu(!Toggle)}>
                    <ion-icon class="md hydrated" name="apps-outline" title="Menú de aplicaciones" aria-label="Menú de aplicaciones"></ion-icon>
                </div>
            </nav>
        </header>
    )
}

export default Header
