import React from 'react';

const SignIn = () => {
    
    return (
        <form>
            <h1>Sign In</h1>
            <span>Use your email password</span>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button>Forgot Password </button>
            <button type="submit">Sign In</button>
        </form>
    );
};

export default SignIn;
