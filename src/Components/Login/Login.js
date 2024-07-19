import React, { useState } from 'react';
import SignIn from './SignUp';
import SignUp from './SignIn';
import ToggleContainer from './ToggleContainer';
import './Login.css';

const Login = () => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div className={`container ${isActive ? 'active' : ''}`} id="container">
            <div className="form-container sign-up">
                <SignIn />
            </div>
            <div className="form-container sign-in">
                <SignUp />
            </div>
            <ToggleContainer setIsActive={setIsActive} />
        </div>
    );
};

export default Login;


