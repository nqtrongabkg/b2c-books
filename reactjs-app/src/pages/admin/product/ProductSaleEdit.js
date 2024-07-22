import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductSaleService from '../../../services/ProductSaleService';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { LocalDateTime } from 'js-joda';

const ProductSaleEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productId, setProductId] = useState("");
    const [priceSale, setPriceSale] = useState(0);
    const [quantity, setQty] = useState(0);
    const [createdBy, setCreateBy] = useState("");
    const [dateBegin, setBegin] = useState("");
    const [dateEnd, setEnd] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await ProductSaleService.getById(id);
                setProductId(result.productId);
                setPriceSale(result.priceSale);
                setQty(result.quantity);
                setBegin(result.dateBegin);
                setEnd(result.dateEnd);
                setCreateBy(result.createdBy);
                setDescription(result.description);
                setStatus(result.status);
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/admin/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchData();
    }, [id]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        // Convert date strings to LocalDateTime objects
        const formattedBegin = dateBegin + 'T00:00:00';
        const formattedEnd = dateEnd + 'T00:00:00';
        const begin = LocalDateTime.parse(formattedBegin);
        const end = LocalDateTime.parse(formattedEnd);
        const updatedProductSale = {
            productId,
            priceSale,
            quantity,
            dateBegin: begin,
            dateEnd: end,
            description,
            createdBy,
            status
        };
        try {
            const result = await ProductSaleService.update(id, updatedProductSale);
            toast.success(result.message);
            navigate("/admin/product/sale-index", { replace: true });
        } catch (error) {
            console.error('Error updating product sale:', error);
            toast.error("Đã xảy ra lỗi khi cập nhật giảm giá sản phẩm.");
        }
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="content">
                <section className="content-header my-2">
                    <h1 className="d-inline">Cập nhật giảm giá sản phẩm</h1>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-12 text-end">
                            <Button variant="info" size="sm" onClick={() => navigate("/admin/product/sale-index", { replace: true })}>
                                <FaArrowLeft /> Về danh sách
                            </Button>
                        </div>
                    </div>
                </section>
                <section className="content-body my-2">
                    <div className="row">
                        <div className="col-md-9">
                            <div className="mb-3">
                                <label><strong>Giá giảm (*)</strong></label>
                                <input type="number"
                                    value={priceSale}
                                    onChange={(e) => setPriceSale(e.target.value)}
                                    placeholder="Nhập giá giảm" className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label><strong>Số lượng sản phẩm giảm (*)</strong></label>
                                <input type="number"
                                    value={quantity}
                                    onChange={(e) => setQty(e.target.value)}
                                    placeholder="Nhập số lượng" rows="1"
                                    className="form-control" min="1" />
                            </div>
                            <div className="mb-3">
                                <label><strong>Mô tả</strong></label>
                                <input type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    name="description" className="form-control" placeholder="Mô tả" />
                            </div>
                            <div className="mb-3">
                                <label><strong>Ngày bắt đầu</strong></label>
                                <input type="date"
                                    value={dateBegin}
                                    onChange={(e) => setBegin(e.target.value)}
                                    className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label><strong>Ngày kết thúc</strong></label>
                                <input type="date"
                                    value={dateEnd}
                                    onChange={(e) => setEnd(e.target.value)}
                                    className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label><strong>Trạng thái</strong></label>
                                <select name="status" className="form-select"
                                    onChange={(e) => setStatus(e.target.value)}
                                    value={status}>
                                    <option value="1">Hoạt động</option>
                                    <option value="2">Không hoạt động</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="box-footer text-end px-2 py-2">
                                <button type="submit" className="btn btn-sm btn-success" name="THEM">
                                    <FaSave /> Lưu[Cập nhật]
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </form>
    );
}

export default ProductSaleEdit;
