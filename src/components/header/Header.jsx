import React, { useState, useEffect } from 'react'
import "./header.css"

const Header = ({ style, logout }) => {
    const [Toggle, showMenu] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [headerClass, setHeaderClass] = useState('');
    const [showSupport, setShowSupport] = useState(false);

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

    const handleLogout = () => {
        if (logout) {
            logout();
        } else {
            // Fallback si no se pasa la función logout
            window.location.href = '/';
        }
    };

    return (
        <header className={`header ${headerClass}`} style={style}>
            <nav className="nav container">
                <a href="https://www.unicatolica.edu.co/" className="nav__logo">
                    <img src='https://www.unicatolica.edu.co/files/unicatolica-svg.svg' alt="Logo de Unicatolica"/>
                </a>

                <div className={Toggle ? "nav__menu show-menu" : "nav__menu"}>
                    <ul className="nav__list grid">
                        <li className="nav__item">
                            <a href="#" onClick={handleLogout} className="nav__link active-link">
                                <ion-icon class="nav__icon md hydrated" role="img" name="log-out-outline" title="Cerrar Sesión" aria-label="Cerrar Sesión"></ion-icon>
                                Cerrar Sesión
                            </a>
                        </li>
                        <li className="nav__item">
                            <a href="#" onClick={(e) => { e.preventDefault(); setShowSupport(!showSupport); }} className="nav__link">
                                <ion-icon class="nav__icon md hydrated" role="img" name="call-outline" title="Contacto" aria-label="Contacto"></ion-icon>
                                Soporte
                            </a>
                            {showSupport && (
                                <div className="support-popup">
                                    <p>¿Necesitas ayuda con la aplicación?</p>
                                    <p>Nuestro equipo de soporte está disponible para ayudarte:</p>
                                    <ul>
                                        <li>
                                            <a href="https://wa.me/573052920641" target="_blank" rel="noopener noreferrer" className="whatsapp-link">
                                                <ion-icon name="logo-whatsapp" className="whatsapp-icon"></ion-icon>
                                                +57 3052920641
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://wa.me/573202300182" target="_blank" rel="noopener noreferrer" className="whatsapp-link">
                                                <ion-icon name="logo-whatsapp" className="whatsapp-icon"></ion-icon>
                                                +57 3202300182
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://wa.me/573107711775" target="_blank" rel="noopener noreferrer" className="whatsapp-link">
                                                <ion-icon name="logo-whatsapp" className="whatsapp-icon"></ion-icon>
                                                +57 3107711775
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            )}
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
