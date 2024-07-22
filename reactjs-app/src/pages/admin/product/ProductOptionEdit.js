import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductOptionService from '../../../services/ProductOptionService';
import ProductStoreService from '../../../services/ProductStoreService';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { FaSave, FaArrowLeft, FaTrash } from 'react-icons/fa';

const ProductOptionEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productId, setProductId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [createdBy, setCreateBy] = useState("");
    const [status, setStatus] = useState(1);
    const [values, setValues] = useState([]);
    const [valuesOld, setValuesOld] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await ProductOptionService.getById(id);
                setProductId(result.productId);
                setName(result.name);
                setDescription(result.description);
                setCreateBy(result.createdBy);
                setStatus(result.status);
                setValues(result.values);
                setValuesOld(result.values);
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
        // Lấy ra chỉ các giá trị từ mảng các đối tượng "values"
        const updatedValues = values.map(value => value.value);
        const updatedOption = {
            productId: productId,
            name: name,
            createdBy, 
            description: description,
            status: status,
            values: updatedValues // Truyền danh sách các chuỗi
        };
        try {
            valuesOld.forEach(async (value) => {
                await ProductStoreService.deleteByOptionValue(value.id);
            });
            console.log("update option: ",updatedOption);
            const result = await ProductOptionService.update(id, updatedOption);
            toast.success(result.message);

            // Thêm ProductStore cho mỗi OptionValue
            result.values.forEach(async (value) => {
                const productStoreData = {
                    productId: productId,
                    optionValueId: value.id, // ID của OptionValue vừa cập nhật
                    quantity: 0, // Cài đặt quantity tùy theo yêu cầu
                    soldQuantity: 0,
                    price: 0, // Cài đặt giá tùy theo yêu cầu
                    createdBy: JSON.parse(sessionStorage.getItem('useradmin'))?.userId
                };
                await ProductStoreService.create(productStoreData);
            });

            navigate("/admin/product/option-index", { replace: true });
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi cập nhật.");
        }
    };

    const handleValueChange = (index, newValue) => {
        const updatedValues = [...values];
        updatedValues[index].value = newValue;
        setValues(updatedValues);
    };

    const handleRemoveValue = (indexToRemove) => {
        const updatedValues = values.filter((_, index) => index !== indexToRemove);
        setValues(updatedValues);
    };

    const handleAddValue = () => {
        setValues([...values, { value: "" }]);
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="content">
                <section className="content-header my-2">
                    <h1 className="d-inline">Cập nhật lựa chọn sản phẩm</h1>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-12 text-end">
                            <Button variant="info" size="sm" onClick={() => navigate("/admin/product/option-index", { replace: true })}>
                                <FaArrowLeft /> Về danh sách
                            </Button>
                        </div>
                    </div>
                </section>
                <section className="content-body my-2">
                    <div className="row">
                        <div className="col-md-9">
                            <div className="mb-3">
                                <label><strong>Tên lựa chọn (*)</strong></label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label><strong>Mô tả</strong></label>
                                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label><strong>Trạng thái</strong></label>
                                <select name="status" className="form-select" onChange={(e) => setStatus(e.target.value)} value={status}>
                                    <option value="1">Hoạt động</option>
                                    <option value="2">Không hoạt động</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label><strong>Các lựa chọn</strong></label>
                                {values.map((value, index) => (
                                    <div key={index} className="input-group mb-3">
                                        <input type="text" value={value.value} onChange={(e) => handleValueChange(index, e.target.value)} className="form-control" />
                                        <button type="button" className="btn btn-outline-danger" onClick={() => handleRemoveValue(index)}><FaTrash /></button>
                                    </div>
                                ))}
                                <button type="button" className="btn btn-sm btn-outline-primary" onClick={handleAddValue}>Thêm lựa chọn</button>
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

export default ProductOptionEdit;
