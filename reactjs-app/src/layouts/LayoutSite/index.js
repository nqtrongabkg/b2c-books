import React, {createContext, useContext} from 'react';
import '../../assets/styles/style.css';
import '../../assets/styles/style-prefix.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Header from './components/Header';
import Footer from './components/Footer';
import UserService from '../../services/UserService';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

const LayoutSite = () => {
    const navigate = useNavigate();

    const login = async (authRequest, redirectTo = "/") => {
        try {
            const response = await UserService.login(authRequest);
            if (response) {
                const { userId, token } = response;
                const userData = { userId, token };
                UserService.getUserById(userData.userId)
                    .then(userGet => {
                        if (userGet.role.role !== 0) {
                            sessionStorage.setItem('user', JSON.stringify(userData));
                            navigate(redirectTo);  // Use the redirectTo parameter
                        } else {
                            sessionStorage.removeItem('user');
                            navigate(redirectTo);  // Redirect even if the role is not correct to ensure flow continuation
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching user:', error);
                        navigate(redirectTo);  // Handle navigation even in error case
                    });
                console.log('Đăng nhập thành công');
            } else {
                toast.error("Đăng nhập thất bại!");
            }
        } catch (error) {
            console.log('Login error:', error);
            toast.error('Thất bại, Vui lòng kiểm tra lại thông tin!');
        }
    };

    const logout = () => {
        sessionStorage.removeItem('user');
        navigate("/");
    };
    
    return (
        <UserContext.Provider value={{ login, logout}}>
            <div>
                <ToastContainer/>
                <Header />
                <Outlet />
                <Footer />
            </div>
        </UserContext.Provider>
            
    );
};

export default LayoutSite;