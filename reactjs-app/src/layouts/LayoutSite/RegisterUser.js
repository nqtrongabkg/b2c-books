import React, { useState } from 'react';
import { useUserContext } from './';
import { useLocation } from 'react-router-dom';
import RoleService from '../../services/RoleService';
import UserService from '../../services/UserService';
import { toast } from 'react-toastify';

const RegisterUser = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const location = useLocation();
    const { login } = useUserContext();

    const handleLogin = (authRequest, redirectTo) => {
        login(authRequest, redirectTo);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const roleResponse = await RoleService.getByRole(2);
            if (roleResponse) {
                const dataRegister = {
                    userName: username,
                    password: password,
                    email: email,
                    role: roleResponse
                };
                const userRegistered = await UserService.create(dataRegister);
                if (userRegistered) {
                    const authRequest = {
                        username: username,
                        password: password
                    };
                    handleLogin(authRequest, location.state?.redirectTo || "/");
                    toast.success("Đăng ký thành công!");
                }
            }
        } catch (error) {
            console.error("Error registering user:", error);
            toast.error("Đăng ký thất bại, Tên đăng nhập đã tồn tại!");
        }
    };

    return (
        <section className="vh-100" style={{ backgroundColor: '#eee' }}>
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-lg-12 col-xl-11">
                        <div className="card text-black" style={{ borderRadius: '25px' }}>
                            <div className="card-body p-md-5">
                                <div className="row justify-content-center">
                                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Đăng ký</p>
                                        <form className="mx-1 mx-md-4" onSubmit={handleRegister}>
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input 
                                                        type="text" 
                                                        id="form3Example1c" 
                                                        className="form-control" 
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                        required
                                                    />
                                                    <label className="form-label" htmlFor="form3Example1c">Tên đăng nhập</label>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input 
                                                        type="email" 
                                                        id="form3Example3c" 
                                                        className="form-control" 
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                    />
                                                    <label className="form-label" htmlFor="form3Example3c">Email</label>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input 
                                                        type="password" 
                                                        id="form3Example4c" 
                                                        className="form-control" 
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                    />
                                                    <label className="form-label" htmlFor="form3Example4c">Mật khẩu</label>
                                                </div>
                                            </div>
                                            <div className="form-check d-flex justify-content-center mb-5">
                                                <input 
                                                    className="form-check-input me-2" 
                                                    type="checkbox" 
                                                    value="" 
                                                    id="form2Example3c" 
                                                    required 
                                                />
                                                <label className="form-check-label" htmlFor="form2Example3c">
                                                    Tôi đồng ý tất cả các tuyên bố <a href="#!">trong điều khoản dịch vụ</a>
                                                </label>
                                            </div>
                                            <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                                <button type="submit" className="btn btn-primary btn-lg">Đăng ký</button>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp" className="img-fluid" alt="Sample" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default RegisterUser;
