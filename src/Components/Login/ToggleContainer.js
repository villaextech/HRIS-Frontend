import React from 'react';

const ToggleContainer = ({ setIsActive }) => {
    return (
        <div className="toggle-container">
            <div className="toggle">
                <div className="toggle-panel toggle-left">
                    <h1>Welcome</h1>
                    <p>Enter your personal details to use all of site features</p>
                    <button className="hidden" id="login" onClick={() => setIsActive(false)}>Sign In</button>
                </div>
                <div className="toggle-panel toggle-right">
                    <h1>Hello, Friend!</h1>
                    <p>Register with your personal details to use all of site features</p>
                    <button className="hidden" id="register" onClick={() => setIsActive(true)}>SignUp</button>
                </div>
            </div>
        </div>
    );
};

export default ToggleContainer;
