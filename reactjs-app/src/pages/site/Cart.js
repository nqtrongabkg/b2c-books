import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { MdDelete } from "react-icons/md";
import OrderService from '../../services/OrderService';
import OrderItemService from '../../services/OrderItemService';
import ProductService from '../../services/ProductService';
import UserService from '../../services/UserService';
import ProductStoreService from '../../services/ProductStoreService';
import ProductSaleService from '../../services/ProductSaleService';
import { urlImageProduct } from '../../config';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

const CartItem = ({ item, reload, setReload }) => {
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await ProductService.getById(item.productId);
                setProduct(product);
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };

        if (item) {
            fetchProduct();
        }
    }, [item, navigate]);

    if (!item || !product) {
        return <div>Loading...</div>; // Hiển thị thông báo hoặc hiệu ứng tải dữ liệu
    }

    const handleDeleteItem = async (itemId) => {
        try {
            await OrderItemService.delete(itemId);
            setReload(!reload);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <div className="row mb-4 d-flex justify-content-between align-items-center">
            <div className="col-md-2 col-lg-2 col-xl-2">
                <img src={urlImageProduct + product.image} className="img-fluid rounded-3" alt={product.name} />
            </div>
            <div className="col-md-3 col-lg-3 col-xl-3">
                <h6 className="text-muted">Sản phẩm</h6>
                <h6 className="text-black mb-0">{product.name}</h6>
            </div>
            <div className="col-md-3 col-lg-3 col-xl-3 d-flex">
                <button data-mdb-button-init data-mdb-ripple-init className="btn btn-link px-2">
                    <i className="fas"><FontAwesomeIcon icon={faMinus} /></i>
                </button>
                <input id="quantity" min={0} name="quantity" defaultValue={item.quantity} type="number" className="form-control form-control-sm" />
                <button data-mdb-button-init data-mdb-ripple-init className="btn btn-link px-2">
                    <i className="fas"><FontAwesomeIcon icon={faPlus} /></i>
                </button>
            </div>
            <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                <h6 className="mb-0">{item.price}</h6>
            </div>
            <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                <button className="btn btn-link text-muted" onClick={() => handleDeleteItem(item.id)}>
                    <MdDelete size={30} />
                </button>
            </div>
        </div>
    );
};

const Cart = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const location = useLocation();
    const navigate = useNavigate();
    const [orderItems, setOrderItems] = useState([]);
    const [cart, setCart] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [deliveryPhone, setDeliveryPhone] = useState("");
    const [deliveryName, setDeliveryName] = useState("");

    const [reload, setReload] = useState(false);
    const hasHandledPayment = useRef(false);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const cart = await OrderService.getCart(user.userId);
                const getUserFull = await UserService.getUserById(user.userId);
                if (getUserFull) {
                    setDeliveryAddress(getUserFull.address);
                    setDeliveryPhone(getUserFull.phone);
                    setDeliveryName(getUserFull.name);
                }
                if (cart) {
                    setCart(cart);
                    const cartItems = await OrderItemService.getByOrder(cart.id);
                    if (cartItems) {
                        const itemsWithProducts = await Promise.all(cartItems.map(async (item) => {
                            const product = await ProductService.getById(item.productId);
                            return { ...item, product };
                        }));
                        setOrderItems(itemsWithProducts);
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
        const handleSuccessfulPayment = async () => {
            if (hasHandledPayment.current) return; // If payment has already been handled, exit the function

            if (!cart) {
                console.error("Cart is null");
                return;
            }
            try {
                const searchParams = new URLSearchParams(location.search);
                const responseCode = searchParams.get("vnp_ResponseCode");
                if (responseCode) {
                    hasHandledPayment.current = true; // Set flag to true to indicate payment has been handled
                    const txnRef = searchParams.get("vnp_TxnRef");
                    await OrderService.setPay(cart.id, txnRef);
                    setReload(!reload);
                    toast.success("Thanh toán thành công!");
                }
            } catch (error) {
                console.error('Error handling successful payment:', error);
                toast.error("Đã xảy ra lỗi khi xử lý thanh toán.");
            }
        };

        handleSuccessfulPayment();
        fetchCartItems();
    }, [user.userId, reload, cart, location.search, navigate]);

    const submitOrderInCartPay = async (amount) => {
        try {
            const linkToPay = await OrderService.payVNPAY(amount);
            if (linkToPay) {
                // console.log("link:",response)
                window.location.href = linkToPay;
            }
        } catch (error) {
            console.error('Error calling VNPAY payment:', error);
            toast.error("Đã xảy ra lỗi khi gọi thanh toán VNPAY.");
        }
    };

    const submitOrderInCart = async () => {
        if (!cart) {
            console.error("Cart is null");
            return;
        }
        const dataUpdateCart = {
            userId: cart.userId,
            totalPrice: cart.totalPrice,
            deliveryAddress: deliveryAddress,
            deliveryPhone: deliveryPhone,
            deliveryName: deliveryName,
            status: 1,
        };

        try {
            const updateCartToOrder = await OrderService.update(cart.id, dataUpdateCart);
            if (updateCartToOrder) {
                if (orderItems) {
                    for (const item of orderItems) {
                        try {
                            const storeOfItem = await ProductStoreService.getByOptionValue(item.optionValueId);
                            if (storeOfItem) {
                                const updatedProductStore = {
                                    productId: storeOfItem.productId,
                                    optionValueId: storeOfItem.optionValueId,
                                    quantity: storeOfItem.quantity - item.quantity,
                                    soldQuantity: storeOfItem.soldQuantity + item.quantity,
                                    price: storeOfItem.price,
                                    createdBy: storeOfItem.createdBy,
                                };
                                await ProductStoreService.update(storeOfItem.id, updatedProductStore);
                            }

                            const sales = await ProductSaleService.getByProduct(item.productId);
                            const activeSale = sales.find(sale => sale.status === 1);

                            if (activeSale) {
                                await ProductSaleService.exportSale(item.productId, item.quantity);
                            }
                        } catch (error) {
                            console.error('Error processing item:', error);
                            toast.error("Đã xảy ra lỗi khi xử lý sản phẩm.");
                            return;
                        }
                    }
                }

                const newCart = await OrderService.getCart(user.userId);
                if (newCart) {
                    setCart(newCart);
                    const cartItems = await OrderItemService.getByOrder(newCart.id);
                    if (cartItems) {
                        const itemsWithProducts = await Promise.all(cartItems.map(async (item) => {
                            const product = await ProductService.getById(item.productId);
                            return { ...item, product };
                        }));
                        setOrderItems(itemsWithProducts);
                    }
                }

                toast.success("Đặt hàng thành công");
            }
        } catch (error) {
            console.error('Error updating cart to order:', error);
            toast.error("Đã xảy ra lỗi khi đặt hàng.");
        }
    };

    //////css internal
    const buttonStyle = {
        backgroundColor: '#6c757d', // Dark gray background
        color: 'white', // White text
        borderRadius: '20px', // Rounded corners
        fontSize: '1rem', // Adjust font size
        padding: '10px 20px', // Adjust padding
        width: '200px', // Fixed width
        margin: '10px auto', // Center align and add space between buttons
        display: 'block', // Ensure block display for centering
        border: 'none', // Remove default border
    };

    const disabledButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#aaa', // Lighter gray for disabled state
        cursor: 'not-allowed', // Not-allowed cursor for disabled state
    };

    return (
        <section className="h-100 h-custom" style={{ backgroundColor: '#d2c9ff' }}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12">
                        <div className="card card-registration card-registration-2" style={{ borderRadius: 15 }}>
                            <div className="card-body p-0">
                                <div className="row g-0">
                                    <div className="col-lg-8">
                                        <div className="p-5">
                                            <div className="d-flex justify-content-between align-items-center mb-5">
                                                <h1 className="fw-bold mb-0 text-black">Giỏ Hàng</h1>
                                            </div>
                                            <hr className="my-4" />
                                            {orderItems && orderItems.map((item, index) => (
                                                <CartItem key={index} item={item} reload={reload} setReload={setReload} />
                                            ))}

                                            <hr className="my-4" />
                                            <div className="pt-5">
                                                <h6 className="mb-0"><a href="/" className="text-body"><i className="fas fa-long-arrow-alt-left me-2" />Quay về trang chủ</a></h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 bg-grey">
                                        {cart && (
                                            <div className="p-5">
                                                <h3 className="fw-bold mb-5 mt-2 pt-1">Tổng đơn</h3>
                                                <hr className="my-4" />

                                                <h5 className="text-uppercase mb-3">Thông tin nhận hàng</h5>
                                                <div className="mb-5">
                                                    <div data-mdb-input-init className="form-outline">
                                                        <label className="form-label" htmlFor="form3Examplea2">Địa chỉ</label>
                                                        <input type="text" id="deliveryAddress" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} className="form-control form-control-lg" />
                                                    </div>
                                                    <div data-mdb-input-init className="form-outline">
                                                        <label className="form-label" htmlFor="form3Examplea2">Số điện thoại</label>
                                                        <input type="text" id="deliveryPhone" value={deliveryPhone} onChange={e => setDeliveryPhone(e.target.value)} className="form-control form-control-lg" />
                                                    </div>
                                                    <div data-mdb-input-init className="form-outline">
                                                        <label className="form-label" htmlFor="form3Examplea2">Tên</label>
                                                        <input type="text" id="deliveryName" value={deliveryName} onChange={e => setDeliveryName(e.target.value)} className="form-control form-control-lg" />
                                                    </div>
                                                </div>
                                                <hr className="my-4" />
                                                <div className="justify-content-between mb-5">
                                                    <h5 className="text-uppercase">Tổng thanh toán</h5>
                                                    <h5>{cart.totalPrice}</h5>
                                                </div>
                                                <div className="d-flex flex-column align-items-center">
                                                    <button
                                                        type="button"
                                                        onClick={submitOrderInCart}
                                                        style={!orderItems || orderItems.length === 0 ? disabledButtonStyle : buttonStyle} // Apply styles conditionally
                                                        disabled={!orderItems || orderItems.length === 0} // Disable button if no items in the cart
                                                    >
                                                        Ship COD
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            submitOrderInCartPay(cart.totalPrice);
                                                            submitOrderInCart();
                                                        }}
                                                        style={!orderItems || orderItems.length === 0 ? disabledButtonStyle : buttonStyle} // Apply styles conditionally
                                                        disabled={!orderItems || orderItems.length === 0} // Disable button if no items in the cart
                                                    >
                                                        Thanh toán VNPAY
                                                    </button>
                                                </div>
                                            </div>
                                        )}
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

export default Cart;
