import React, { useEffect, useState } from 'react';
import OrderService from '../../../services/OrderService';
import OrderItemService from '../../../services/OrderItemService';
import ProductService from '../../../services/ProductService';
import ProductOptionService from '../../../services/ProductOptionService';
import { FaArrowAltCircleLeft, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { urlImageProduct } from '../../../config';
import { useNavigate } from 'react-router-dom';

const OrderItemTrash = () => {
    const [orderItems, setOrderItems] = useState([]);
    const [reload, setReload] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderItems = async () => {
            try {
                const result = await OrderItemService.getAll();
                const itemsWithProduct = [];
                for (const item of result) {
                    const order = await OrderService.getById(item.orderId);
                    if (order.status !== 3) { // status of order === 3 => cart
                        const product = await ProductService.getById(item.productId);
                        const optionValue = await ProductOptionService.getOptionValue(item.optionValueId);
                        const option = await ProductOptionService.getById(optionValue.optionId);
                        item.product = product; // Thêm thông tin sản phẩm vào mỗi item
                        item.option = option; // Thêm thông tin loại lựa chọn vào mỗi item
                        item.optionValue = optionValue; // Thêm thông tin giá trị loại lựa chọn vào mỗi item
                        itemsWithProduct.push(item);
                    }
                }
                const itemsWithProductFill = itemsWithProduct.filter(item => item.status === 2);
                const sorted = itemsWithProductFill.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrderItems(sorted);
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/admin/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchOrderItems();
    }, [reload]);

    const restoreUser = async (id) => {
        try {
            await OrderItemService.sitchStatus(id);
            setReload(Date.now());
            toast.success('Khôi phục thành công');
        } catch (error) {
            console.error('Error restoring user:', error);
            toast.error('Đã xảy ra lỗi khi khôi phục người dùng.');
        }
    };

    const deleteUser = async (id) => {
        try {
            await OrderItemService.delete(id);
            setReload(Date.now());
            toast.success('Xóa vĩnh viễn thành công');
        } catch (error) {
            console.error('Error deleting user permanently:', error);
            toast.error('Đã xảy ra lỗi khi xóa vĩnh viễn người dùng.');
        }
    };

    return (
        <div className="content">
            <section className="content-header my-2">
                <h1 className="d-inline">Đơn hàng : Thùng rác</h1>

                <div className="row mt-3 align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-warning">
                            <a href="/admin/order-item/index">Về danh sách</a>
                        </button>
                    </div>
                </div>
            </section>
            <section className="content-body my-2">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th className="text-center" style={{ width: '30px' }}>
                                <input type="checkbox" id="checkAll" />
                            </th>
                            <th>Sản phẩm</th>
                            <th>Ảnh</th>
                            <th>Loại lựa chọn</th>
                            <th>Số lượng</th>
                            <th>Giá</th>
                            <th>Ngày đặt</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orderItems && orderItems.length > 0 &&
                            orderItems.map((item) => {
                                return (
                                    <tr key={item.id} className="datarow">
                                        <td className="text-center">
                                            <input type="checkbox" />
                                        </td>
                                        <td>
                                            <div className='name'>
                                                {item.product ? item.product.name : "Tên sản phẩm không tồn tại"}
                                            </div>
                                            <div className="function_style">
                                                <button
                                                    onClick={() => restoreUser(item.id)}
                                                    className="border-0 px-1 text-success"
                                                >
                                                    <FaArrowAltCircleLeft />
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(item.id)}
                                                    className="btn-none px-1 text-danger"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            {item.product ? (
                                                <img src={urlImageProduct + item.product.image} className="img-fluid user-avatar" alt="Hinh anh" />
                                            ) : (
                                                <p>Không có ảnh</p>
                                            )}
                                        </td>
                                        <td>{item.option ? `${item.option.name} / ${item.optionValue.value}` : "Loại lựa chọn không tồn tại"}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.totalPrice}</td>
                                        <td>{item.createdAt}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>

                </table>
            </section>
        </div>
    );
}

export default OrderItemTrash;
