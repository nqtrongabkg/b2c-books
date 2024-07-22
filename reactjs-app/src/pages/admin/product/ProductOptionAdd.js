import { FaArrowLeft, FaSave } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from 'react-toastify';
import ProductOptionService from "../../../services/ProductOptionService";
import ProductStoreService from "../../../services/ProductStoreService"; 

const ProductOptionAdd = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState(1);
    const [values, setValues] = useState([]); // Danh sách các giá trị OptionValue

    const handleAddValue = () => {
        // Thêm một giá trị mới vào danh sách
        setValues([...values, ""]);
    };

    const handleChangeValue = (index, value) => {
        // Cập nhật giá trị của OptionValue tại index
        const newValues = [...values];
        newValues[index] = value;
        setValues(newValues);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Kiểm tra nếu danh sách values rỗng thì thêm giá trị "N/A"
        const updatedValues = values.length === 0 ? ["N/A"] : values;
    
        const productOption = {
            productId: id,
            name: name,
            description: description,
            createdBy: JSON.parse(sessionStorage.getItem('useradmin'))?.userId,
            status: status,
            values: updatedValues
        };
        console.log("product option adding: ", productOption);
    
        try {
            const result = await ProductOptionService.create(productOption);
            if (result !== null) {
                // console.log("crated options: ", result);
                result.values.forEach(async (value) => {
                    const productStoreData = {
                        productId: id,
                        optionValueId: value.id,
                        quantity: 0,
                        soldQuantity: 0,
                        price: 0,
                        createdBy: JSON.parse(sessionStorage.getItem('useradmin'))?.userId
                    };
                    const store =  await ProductStoreService.create(productStoreData);
                    if(store !== null){
                        console.log("created store: ", store);
                    }
                });
                toast.success("Tạo lựa chọn sản phẩm thành công");
                navigate('/admin/product/index', { replace: true });
            }
        } catch (error) {
            toast.error("Lỗi khi tạo lựa chọn sản phẩm");
        }
    }
    

    return (
        <form onSubmit={handleSubmit}>
            <div className="content">
                <section className="content-header my-2">
                    <h1 className="d-inline">Tạo lựa chọn sản phẩm</h1>
                    <div className="mt-1 text-end">
                        <Link to="/admin/product/index" className="btn btn-sm btn-info mx-1">
                            <FaArrowLeft /> Về danh sách sản phẩm
                        </Link>
                    </div>
                </section>
                <section className="content-body my-2">
                    <div className="row">
                        <div className="col-md-9">
                            <div className="mb-3">
                                <label><strong>Tên của lựa chọn</strong></label>
                                <input type="text" name="name" className="form-control" placeholder="Tên của lựa chọn" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Mô tả</strong></label>
                                <input type="text" name="description" className="form-control" placeholder="Mô tả" value={description} onChange={e => setDescription(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Giá trị của lựa chọn</strong></label>
                                {values.map((value, index) => (
                                    <input key={index} type="text" className="form-control mb-2" placeholder={`Giá trị ${index + 1}`} value={value} onChange={e => handleChangeValue(index, e.target.value)} />
                                ))}
                                <button type="button" className="btn btn-sm btn-primary" onClick={handleAddValue}>Thêm giá trị</button>
                            </div>
                            <div className="mb-3">
                                <label><strong>Trạng thái</strong></label>
                                <select name="status" className="form-select" onChange={(e) => { setStatus(e.target.value) }} value={status}>
                                    <option value="1">Hoạt động</option>
                                    <option value="2">Không hoạt động</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="box-footer text-end px-2 py-2">
                                <button type="submit" className="btn btn-sm btn-success" name="THEM">
                                    <FaSave /> Lưu[Thêm]
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </form>
    );
}

export default ProductOptionAdd;
