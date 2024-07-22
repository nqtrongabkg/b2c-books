import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/styles/OrderDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faShippingFast, faHome } from '@fortawesome/free-solid-svg-icons';
import OrderItemService from '../../services/OrderItemService';
import OrderService from '../../services/OrderService';
import ProductService from '../../services/ProductService';
import { urlImageProduct } from '../../config';

const OrderItemDetail = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [order, setOrder] = useState(null)
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await OrderItemService.getById(id);
                if (result) {
                    // console.log('item in OrderItemDetail:', result);
                    setItem(result);
                    const getProduct = await ProductService.getById(result.productId);
                    if (getProduct) {
                        // console.log("product: ", getProduct);
                        setProduct(getProduct);
                    }
                    const orderResult = await OrderService.getById(result.orderId);
                    if (orderResult) {
                        // console.log("order in detail item:", orderResult);
                        setOrder(orderResult);
                    }
                }
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };

        if (id) {
            // console.log("item id:", id);
            fetchData();
        }
    }, [id, navigate]);

    function formatDateToLocalDate(datetimeString) {
        const date = new Date(datetimeString);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    }

    const navigateToMyUser = () => {
        navigate('/my-user');
    };

    const handleClickComplete = async (item) => {
        if (item && item.status >= 3) {
            try {
                // await OrderItemService.complete(item.id);
                // console.log("item complete:",item);
                navigate(`/create-feedback`, { state: { orderItemId: item.id, productId: item.productId } });
            } catch (error) {
                console.error('Error handle:', error);
            }
        } else {
            console.log('Không thể xác nhận nhận hàng cho đơn hàng này');
        }
    };

    return (
        <section className="vh-100" style={{ backgroundColor: '#8c9eff' }}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12">
                        <div className="card card-stepper" style={{ borderRadius: 16 }}>
                            <div>
                                <div className="card-body p-4">
                                    <div className="d-flex flex-row mb-4 pb-2">
                                        <div className="flex-fill">
                                            <div>
                                                <p className="text-muted mb-2"> Mã đơn hàng <span className="fw-bold text-body">{item ? item.id : ""}</span></p>
                                                <p className="text-muted mb-0"> Thời gian đặt hàng <span className="fw-bold text-body">{item ? formatDateToLocalDate(item.createdAt) : ""}</span> </p>
                                            </div>
                                            <h5 className="bold">{product ? product.name : ""}</h5>
                                            <p className="text-muted"> Số lượng: {item ? item.quantity : ""}</p>
                                            {order && (
                                                <h4 className="mb-3">
                                                    {order.payment === "COD" ? "Ship COD" : `Đã thanh toán, Số hóa đơn: ${order.payment}`}
                                                </h4>
                                            )}
                                            <h4 className="mb-3"> Tổng thanh toán: {item ? item.totalPrice : ""} <span className="small text-muted"> VND </span></h4>
                                            <div className='row'>
                                                <div className='col-md-6'>
                                                    <button className="btn btn-primary" onClick={navigateToMyUser}>Về danh sách</button>
                                                </div>
                                                <div className='col-md-6'>
                                                    <button
                                                        className={`btn btn-success ${item && item.status === 3 ? '' : 'disabled'}`}
                                                        onClick={() => handleClickComplete(item)}
                                                    >
                                                        {item && item.status === 3 ? "Xác nhận đã nhận hàng" : "Đơn hàng đã hoàn tất"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <img className="align-self-center img-fluid" src={product ? urlImageProduct + product.image : ''} width={250} alt='HinhAnh' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-5">
                                <ul id="progressbar-2" className="d-flex justify-content-between mx-0 mt-0 mb-5 px-0 pt-0 pb-2" style={{ width: '100%' }}>
                                    <li className={`step0 text-center ${item && item.status >= 1 ? 'active' : ''}`} id="step1" />
                                    <li className={`step0 text-center ${item && item.status >= 3 ? 'active' : ''}`} id="step2" />
                                    <li className={`step0 text-center ${item && item.status >= 3 ? 'active' : ''}`} id="step3" />
                                </ul>

                                <div className="d-flex justify-content-between">
                                    <div className="d-lg-flex align-items-center">
                                        <FontAwesomeIcon icon={faClipboardList} size="3x" />
                                        <div>
                                            <p className="fw-bold mb-1">Đơn hàng</p>
                                            <p className="fw-bold mb-0">Đang được xử lý</p>
                                        </div>
                                    </div>
                                    <div className="d-lg-flex align-items-center">
                                        <FontAwesomeIcon icon={faShippingFast} size="3x" />
                                        <div>
                                            <p className="fw-bold mb-1">Đơn hàng</p>
                                            <p className="fw-bold mb-0">Đang được giao</p>
                                        </div>
                                    </div>
                                    <div className="d-lg-flex align-items-center">
                                        <FontAwesomeIcon icon={faHome} size="3x" />
                                        <div>
                                            <p className="fw-bold mb-1">Đơn hàng</p>
                                            <p className="fw-bold mb-0">Hoàn tất</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderItemDetail;
