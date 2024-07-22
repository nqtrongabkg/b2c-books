import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import UserService from '../../../services/UserService';
import InformationService from '../../../services/InformationService';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';

const InformationEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [businessNumber, setBusinessNumber] = useState("");
    const [license, setLicense] = useState("");
    const [repersent, setRepersent] = useState("");
    const [repersentPhone, setRepersentPhone] = useState("");
    const [status, setStatus] = useState(1);
    const [image, setImage] = useState(null);
    const [createdBy, setCreateBy] = useState("");
    const [stringImageDefault, setStringImageDefault] = useState("");


    useEffect(() => {
        const fetchData = async () => {
            try {
                const Data = await InformationService.getById(id);

                setName(Data.name);
                setAddress(Data.address);
                setEmail(Data.email);
                setPhone(Data.phone);
                setBusinessNumber(Data.businessNumber);
                setLicense(Data.license);
                setRepersent(Data.repersent);
                setRepersentPhone(Data.repersentPhone);
                setStatus(Data.status);
                setCreateBy(Data.createdBy);
                
                setStringImageDefault(Data.image);

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


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const updateData = {
                name: name,
            address,
            email,
            phone,
            businessNumber,
            license,
            repersent,
            repersentPhone,
            createdBy,
            status: status,
            };
            const path = {
                path: "informations"
            };
            const deleteIfExitsImage = await InformationService.getById(id);
            console.log("image ole = ", deleteIfExitsImage.logo);
            if(image !== null){
                if(deleteIfExitsImage.image !== null){
                    const deleteImage = {
                        path: "banners",
                        filename: deleteIfExitsImage.image
                    };
                    console.log("delete data = ", deleteImage);
                    await UserService.deleteImage(deleteImage);
                }
            }
    
            const result = await InformationService.update(id, updateData);
            if (result) {
                if (image !== null) { // Kiểm tra avatar khác null
                    const stringImage = await UserService.saveImage(id, path, image);
                    if(stringImage !== null){
                        const data = {
                            id: result.id,
                            image: stringImage
                        };
                        console.log("setimage data is: ", data);
                        await InformationService.setImage(data);
                    }
                }else{
                    const data = {
                        id: result.id,
                        image: stringImageDefault
                    };
                    console.log("setimage data is: ", data);
                    await InformationService.setImage(data);
                }
                toast.success("User updated successfully!");
                navigate("/admin/information/index", { replace: true });
            }
    
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error("Failed to update user.");
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="content">
                <section className="content-header my-2">
                    <h1 className="d-inline">Cập nhật thông tin cấu hình</h1>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-12 text-end">
                            <Button variant="success" size="sm" as={Link} to="/admin/information/index">
                                <FaSave /> Về danh sách
                            </Button>
                        </div>
                    </div>
                </section>
                <section className="content-body my-2">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label><strong>Tên</strong></label>
                                <input type="text" name="name" className="form-control" placeholder="Tên" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Địa chỉ</strong></label>
                                <input type="text" name="address" className="form-control" placeholder="Mô tả" value={address} onChange={e => setAddress(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Email</strong></label>
                                <input type="text" name="email" className="form-control" placeholder="Mô tả" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Số điện thoại</strong></label>
                                <input type="text" name="phone" className="form-control" placeholder="phone" value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Mã doanh nghiệp</strong></label>
                                <input type="text" name="businessNumber" className="form-control" placeholder="businessNumber" value={businessNumber} onChange={e => setBusinessNumber(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Mã giấy phép</strong></label>
                                <input type="text" name="licence" className="form-control" placeholder="licence" value={license} onChange={e => setLicense(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label><strong>Người đại diện</strong></label>
                                <input type="text" name="repersent" className="form-control" placeholder="repersent" value={repersent} onChange={e => setRepersent(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Số điện thoại người đại diện</strong></label>
                                <input type="text" name="repersentPhone" className="form-control" placeholder="repersentPhone" value={repersentPhone} onChange={e => setRepersentPhone(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Ảnh đại diện</strong></label>
                                <input type="file" id="image" className="form-control" onChange={(e) => setImage(e.target.files[0])} />
                            </div>
                            
                            <div className="mb-3">
                                <label><strong>Trạng thái</strong></label>
                                <select name="status" className="form-select" onChange={(e) => { setStatus(e.target.value) }}
                                    value={status}>
                                    <option value="1">Hoạt động</option>
                                    <option value="2">Không hoạt động</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content-header my-2">
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-12 text-end">
                            <Button type="submit" className="btn btn-success btn-sm">
                                <FaSave /> Lưu [Cập nhật]
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </form>
    );
};

export default InformationEdit;
