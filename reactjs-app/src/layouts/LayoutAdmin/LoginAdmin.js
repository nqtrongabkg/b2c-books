import React, { useState } from 'react';
import { useAdminContext } from '.';
const LoginAdmin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAdminContext();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Username:" , username);
        console.log("Password:" , password);
        const authRequest = {
            username: username,
            password: password
        };
        login(authRequest);
    };
    return (
        <div className="login-container">
            <h2 className="login-title">Đăng nhập</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="username">Tên đăng nhập</label>
                    <input
                        type="text"
                        id="username"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Đăng nhập</button>
                {/* <p className="signin-link">
                    Don't have an account? <Link to="/signup">Sign up here</Link>
                </p> */}
            </form>
        </div>
    );
};

export default LoginAdmin;
