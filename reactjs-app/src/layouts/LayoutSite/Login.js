import React, { useState } from 'react';
import { useUserContext } from './';
import { Link, useLocation } from 'react-router-dom';
import './loginSite.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const location = useLocation();
    const { login } = useUserContext();

    const handleSubmit = (e) => {
        e.preventDefault();
        const authRequest = {
            username: username,
            password: password
        };
        const redirectTo = location.state?.redirectTo || "/";
        login(authRequest, redirectTo);
    };

    return (
        <div className="login-site">
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
                <p className="signin-link">
                    Bạn chưa có tài khoản? <Link to="/register">Đăng ký tại đây</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
