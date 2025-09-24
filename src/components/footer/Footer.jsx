import React from 'react'
import "./Footer.css"

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__logo">
                    <a href='https://www.unicatolica.edu.co/'>
											<img src="https://www.unicatolica.edu.co/files/unicatolica-svg.svg" alt="Logo de Unicatolica"/>
										</a>
                </div>
                
                <div className="footer__content">
                    <p className="footer__text">
                        Institución de Educación Superior sujeta a inspección y vigilancia por el Ministerio de Educación Nacional – Resolución No. 944 de 1996 MEN – SNIES 2731
                    </p>

                    <div className="footer__address">
                        <p>Sede Principal Cra. 122 No. 12-459 Pance, Cali – Colombia</p>
                        <p>Teléfono: +57 (2) 555 2767</p>
                    </div>

                    <div className="footer__legal">
                        <p>Para notificaciones judiciales y administrativas comuníquese a:</p>
                        <p>secretariageneral@unicatolica.edu.co y juridico@unicatolica.edu.co</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer