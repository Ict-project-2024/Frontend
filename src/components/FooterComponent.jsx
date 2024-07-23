import React from 'react';
import '../assets/css/Footer.css'; // Adjust the path as needed

const FooterComponent = () => {
    return (
        <div className="footer-container">
            <div className="footer-content">
                <div className="footer-text">
                    <div>All rights reserved</div>
                    <div className="footer-icons">
                    <a href="https://github.com/Ict-project-2024" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <g clipPath="url(#clip0_67_1154)">
                            <path d="M6.99375 0.191437C3.12969 0.189875 0 3.318 0 7.17894C0 10.2321 1.95781 12.8274 4.68438 13.7805C5.05156 13.8727 4.99531 13.6118 4.99531 13.4336V12.2227C2.875 12.4711 2.78906 11.068 2.64688 10.8336C2.35938 10.343 1.67969 10.218 1.88281 9.98363C2.36563 9.73519 2.85781 10.0461 3.42813 10.8883C3.84063 11.4993 4.64531 11.3961 5.05313 11.2946C5.14219 10.9274 5.33281 10.5992 5.59531 10.3446C3.39844 9.95081 2.48281 8.61019 2.48281 7.01644C2.48281 6.243 2.7375 5.53206 3.2375 4.95863C2.91875 4.01331 3.26719 3.20394 3.31406 3.08362C4.22188 3.00237 5.16563 3.73363 5.23906 3.79144C5.75469 3.65238 6.34375 3.57894 7.00313 3.57894C7.66563 3.57894 8.25625 3.6555 8.77656 3.79613C8.95313 3.66175 9.82813 3.03363 10.6719 3.11019C10.7172 3.2305 11.0578 4.02113 10.7578 4.95394C11.2641 5.52894 11.5219 6.24613 11.5219 7.02113C11.5219 8.618 10.6 9.96019 8.39688 10.3477C8.58558 10.5333 8.73541 10.7546 8.83763 10.9987C8.93984 11.2428 8.99238 11.5049 8.99219 11.7696V13.5274C9.00469 13.668 8.99219 13.8071 9.22656 13.8071C11.9938 12.8743 13.9859 10.2602 13.9859 7.1805C13.9859 3.318 10.8547 0.191437 6.99375 0.191437Z" fill="black" fillOpacity="0.45"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_67_1154">
                                <rect width="14" height="14" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                </a>

                        <div>Copyright ©2024</div>
                    </div>
                </div>
                <div className="footer-description">
                    Designed and developed by six talented students of 20/21 batch of ICT department, FOT USJ
                </div>
            </div>
        </div>
    );
};

export default FooterComponent;
