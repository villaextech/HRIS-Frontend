import React from 'react';

const SignUp = () => {
    return (
        <form>
            <h1>Create Account</h1>
            <span>Enter your personal details</span>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type='password' placeholder="Password" />
            <button type="submit">Submit</button>
        </form>
    );
};

export default SignUp;
