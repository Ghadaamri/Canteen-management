import React from 'react';
import './Footer.css'; // Vous pouvez ajouter des styles ici

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} COFICAB. All rights reserved</p>
                
            </div>
        </footer>
    );
}

export default Footer;
