import React, { useEffect, useState } from 'react';
import UserService from '../../services/UserService';
import OrderService from '../../services/OrderService';
import OrderItemService from '../../services/OrderItemService';
import ProductService from '../../services/ProductService';
import { urlImageUser, urlImageProduct } from '../../config';
import { useNavigate } from 'react-router-dom';
import Pagination from '../site/homeComponents/productComponents/Pagination';
import userimage from '../../assets/images/logo/user.jpg';

const MyUser = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    // console.log("user token in profile", user);

    const navigate = useNavigate();

    const [orders, setOrders] = useState(null);
    const [userInfor, setUserInfo] = useState(null);
    const [renderedOrderItems, setRenderedOrderItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resultUserInfo = await UserService.getUserById(user.userId);
                if (resultUserInfo) {
                    // console.log('user information in MyUser:', resultUserInfo);
                    setUserInfo(resultUserInfo);
                }
                const resultOrders = await OrderService.getByUser(user.userId);
                if (resultOrders) {
                    resultOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    // console.log('orders in MyUser:', resultOrders);
                    setOrders(resultOrders);
                }
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };

        if (user.userId) {
            fetchData();
        }
    }, [navigate, user.userId]);

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    useEffect(() => {
        const renderOrderItems = async () => {
            if (!orders) return;
            const renderedItems = [];
            for (const order of orders) {
                try {
                    const orderItems = await OrderItemService.getByOrder(order.id);
                    if (orderItems) {
                        orderItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                        for (const item of orderItems) {
                            const product = await ProductService.getById(item.productId);
                            if (product) {
                                renderedItems.push(
                                    <div key={item.id} className="card mb-4 mb-md-2" onClick={() => navigate(`/order-item-detail/${item.id}`)}>
                                        <div className="row mb-4 d-flex justify-content-between align-items-center">
                                            <div className="col-md-2 col-lg-2 col-xl-2 d-flex align-items-center justify-content-center">
                                                <img src={urlImageProduct + product.image} className="img-fluid rounded-3" alt={product.name} />
                                            </div>
                                            <div className="col-md-3 col-lg-3 col-xl-3">
                                                <h6 className="text-muted">Sản phẩm</h6>
                                                <h6 className="text-black mb-0">{product.name}</h6>
                                            </div>
                                            <div className="col-md-2 col-lg-2 col-xl-2 d-flex align-items-center justify-content-center">
                                                <p className="mb-0">Số lượng: {item.quantity}</p>
                                            </div>
                                            <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1 d-flex align-items-center justify-content-center">
                                                <h6 className="mb-0">Giá: {formatPrice(item.totalPrice)}</h6>
                                            </div>
                                            <div className="col-md-2 col-lg-2 col-xl-2 d-flex align-items-center justify-content-center">
                                                <p className="mb-0">Ngày đặt: {formatDateToLocalDate(item.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>

                                );
                            }
                        }
                    }
                }catch (error) {
                    if (error.response && error.response.status === 503) {
                        navigate('/404');
                    } else {
                        console.error("Error fetching data:", error);
                    }
                }
            }
            setRenderedOrderItems(renderedItems);
        };

        renderOrderItems();
    }, [orders, navigate]);

    function formatDateToLocalDate(datetimeString) {
        const date = new Date(datetimeString);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    }

    const itemsPerPage = 4;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = renderedOrderItems.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <section className="profile-section">
                <div className="container py-5">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="card mb-4 align-items-center">
                                <div className="card-body text-center">
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <img src={userInfor && userInfor.avatar ? urlImageUser + userInfor.avatar : userimage} alt="avatar" className="rounded-circle img-fluid mb-3" style={{ width: '150px', alignSelf: 'center' }} />
                                        <h5 className="my-3">{userInfor && userInfor.name ? userInfor.name : ""}</h5>
                                        <p className="text-muted mb-1">{userInfor && userInfor.role.name === "Buyer" ? "Người mua hàng" : "Người bán hàng"}</p>
                                        <p className="text-muted mb-4">{userInfor && userInfor.address ? userInfor.address : ""}</p>
                                    </div>
                                    <div className="d-flex justify-content-center mb-2">
                                        {userInfor && userInfor.role.name === "Seller" ? (
                                            <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary me-2" onClick={() => navigate(`/site-admin`)}>Cửa hàng</button>
                                        ) : (
                                            <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary me-2" onClick={() => navigate(`/register-store/${user.userId}`)}>Đăng ký cửa hàng</button>
                                        )}
                                        <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-outline-primary" onClick={() => navigate(`/my-user-manager`)}>Tài khoản</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-lg-8">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <div className="row mb-4">
                                        <div className="col-sm-3 fw-bold">Tên:</div>
                                        <div className="col-sm-9">{userInfor && userInfor.name ? userInfor.name : ""}</div>
                                    </div>
                                    <div className="row mb-4">
                                        <div className="col-sm-3 fw-bold">Email:</div>
                                        <div className="col-sm-9">{userInfor && userInfor.email ? userInfor.email : ""}</div>
                                    </div>
                                    <div className="row mb-4">
                                        <div className="col-sm-3 fw-bold">Số điện thoại:</div>
                                        <div className="col-sm-9">{userInfor && userInfor.phone ? userInfor.phone : ""}</div>
                                    </div>
                                    <div className="row mb-4">
                                        <div className="col-sm-3 fw-bold">Địa chỉ:</div>
                                        <div className="col-sm-9">{userInfor && userInfor.address ? userInfor.address : ""}</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3 fw-bold">Ngày tham gia:</div>
                                        <div className="col-sm-9">{userInfor && userInfor.createdAt ? formatDateToLocalDate(userInfor.createdAt) : ""}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title mb-4">Lịch sử đặt hàng</h5>
                                    {currentItems.length > 0 ? currentItems : <p className="text-muted">Chưa có đơn hàng nào được hoàn tất</p>}
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={Math.ceil(renderedOrderItems.length / itemsPerPage)}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default MyUser;
