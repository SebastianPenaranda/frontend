import React, { useState, useEffect, useRef } from 'react'
import "./header.css"
import logoUnicatolica from '../../assets/Logo_Unicatólica.png';

const Header = ({ style }) => {
    const [Toggle, showMenu] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [headerClass, setHeaderClass] = useState('');
    const [showSoporte, setShowSoporte] = useState(false);
    const soporteRef = useRef();

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

    // Cerrar el cuadro de soporte al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (soporteRef.current && !soporteRef.current.contains(event.target)) {
                setShowSoporte(false);
            }
        }
        if (showSoporte) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSoporte]);

    return (
        <header className={`header ${headerClass}`} style={style}>
            <nav className="nav container" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <a href="https://www.unicatolica.edu.co/" className="nav__logo">
                    <img src={logoUnicatolica} alt="Logo de Unicatolica" />
                </a>
                <div className={Toggle ? "nav__menu show-menu" : "nav__menu"} style={{marginLeft: 'auto'}}>
                    <ul className="nav__list grid">
                        <li className="nav__item">
                            <a href="index.html" className="nav__link active-link">
                                <ion-icon className="nav__icon md hydrated" role="img" name="home-outline" title="Inicio" aria-label="Inicio"></ion-icon>
                                Casa 
                            </a>
                        </li>
                        <li className="nav__item" style={{position: 'relative'}}>
                            <span className="nav__link" style={{cursor: 'pointer'}} onClick={() => setShowSoporte(!showSoporte)}>
                                <ion-icon className="nav__icon md hydrated" role="img" name="call-outline" title="Contacto" aria-label="Contacto"></ion-icon>
                                Soporte
                            </span>
                            {showSoporte && (
                                <div ref={soporteRef} style={{
                                    position: 'absolute',
                                    top: '2.5rem',
                                    right: 0,
                                    background: '#fff',
                                    color: '#222',
                                    border: '1px solid #ddd',
                                    borderRadius: '10px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                    padding: '1.2rem 1.5rem',
                                    minWidth: '270px',
                                    zIndex: 10000
                                }}>
                                    <div style={{fontWeight: 600, marginBottom: '0.5rem', color: '#2c3e50'}}>Soporte Técnico</div>
                                    <div style={{fontSize: '1rem', marginBottom: '0.7rem'}}>
                                        ¿Tienes dudas, preguntas o inconvenientes con la aplicación?<br />
                                        <span style={{color: '#4147bd', fontWeight: 500}}>Llámanos y te ayudaremos con gusto:</span>
                                    </div>
                                    <ul style={{listStyle: 'none', padding: 0, margin: 0, fontSize: '1.05rem'}}>
                                        <li style={{marginBottom: '0.3rem'}}><b>+57 310 7711775</b></li>
                                        <li style={{marginBottom: '0.3rem'}}><b>+57 320 2300182</b></li>
                                        <li><b>+57 305 2920641</b></li>
                                    </ul>
                                    <button style={{marginTop: '0.8rem', background: '#4147bd', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 18px', cursor: 'pointer', fontWeight: 500}} onClick={() => setShowSoporte(false)}>Cerrar</button>
                                </div>
                            )}
                        </li>
                    </ul>
                    <ion-icon className="nav__close md hydrated" role="img" name="close-outline" title="Cerrar menú" aria-label="Cerrar menú"></ion-icon>
                </div>
                <div className="nav__toggle" onClick={() => showMenu(!Toggle)}>
                    <ion-icon className="md hydrated" name="apps-outline" title="Menú de aplicaciones" aria-label="Menú de aplicaciones"></ion-icon>
                </div>
            </nav>
        </header>
    )
}

export default Header
