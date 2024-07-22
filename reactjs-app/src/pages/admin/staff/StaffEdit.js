import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import UserService from '../../../services/UserService';
import RoleService from '../../../services/RoleService';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';

const StaffEdit = () => {
    const { id } = useParams();
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [selectedRole, setSelectedRole] = useState('');
    const [status, setStatus] = useState(1);
    const [avatar, setAvatar] = useState(null);
    const [stringImageDefault, setStringImageDefault] = useState("");

    const sessionUserAdmin = sessionStorage.getItem('useradmin');
    let updatedBy = null;
    if (sessionUserAdmin !== null) {
        const parsedUser = JSON.parse(sessionUserAdmin);
        updatedBy = parsedUser.userId;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await UserService.getUserById(id);
                const rolesData = await RoleService.getAll();

                setName(userData.name);
                setUserName(userData.userName);
                setPassword(userData.password);
                setPhone(userData.phone);
                setEmail(userData.email);
                setAddress(userData.address);
                setSelectedRole(userData.role || '');
                setStatus(userData.status);
                setStringImageDefault(userData.avatar);

                setRoles(rolesData.filter(role => role.role === 1));
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
            const userData = {
                name: name,
                userName: userName,
                password: password,
                phone: phone,
                email: email,
                address: address,
                updatedBy: updatedBy,
                role: selectedRole,
                status: status,
            };
            const path = {
                path: "users"
            };
            const deleteIfExitsImage = await UserService.getUserById(id);
            console.log("image ole = ", deleteIfExitsImage.avatar);
            if(avatar !== null){
                console.log("thuc hien xoa anh")
                if(deleteIfExitsImage.avatar !== null){
                    const deleteImage = {
                        path: "users",
                        filename: deleteIfExitsImage.avatar
                    };
                    console.log("delete data = ", deleteImage);
                    await UserService.deleteImage(deleteImage);
                }
            }
    
            const result = await UserService.update(id, userData);
            if (result) {
                if (avatar !== null) { // Kiểm tra avatar khác null
                    const stringImage = await UserService.saveImage(id, path, avatar);
                    if(stringImage !== null){
                        const data = {
                            id: result.id,
                            image: stringImage
                        };
                        console.log("setimage data is: ", data);
                        await UserService.setImage(data);
                    }
                }else{
                    const data = {
                        id: result.id,
                        image: stringImageDefault
                    };
                    console.log("setimage data is: ", data);
                    await UserService.setImage(data);
                }
                toast.success("User updated successfully!");
                navigate("/admin/staff/index", { replace: true });
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
                    <h1 className="d-inline">Cập nhật thành viên</h1>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-12 text-end">
                            <Button variant="success" size="sm" as={Link} to="/admin/staff/index">
                                <FaSave /> Về danh sách
                            </Button>
                        </div>
                    </div>
                </section>
                <section className="content-body my-2">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label><strong>Tên đăng nhập(*)</strong></label>
                                <input type="text" name="username" className="form-control" placeholder="Tên đăng nhập" value={userName} onChange={e => setUserName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Mật khẩu(*)</strong></label>
                                <input type="password" name="password" className="form-control" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Họ tên (*)</strong></label>
                                <input type="text" name="name" className="form-control" placeholder="Họ tên" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Email(*)</strong></label>
                                <input type="email" name="email" className="form-control" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Điện thoại(*)</strong></label>
                                <input type="text" name="phone" className="form-control" placeholder="Điện thoại" value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Địa chỉ(*)</strong></label>
                                <input type="text" name="address" className="form-control" placeholder="Địa chỉ" value={address} onChange={e => setAddress(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label><strong>Ảnh đại diện</strong></label>
                                <input type="file" id="image" className="form-control" onChange={(e) => setAvatar(e.target.files[0])} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Quyền (*)</strong></label>
                                <select name="role" className="form-select" value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
                                    <option value="selectedRole">Chọn Quyền</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label><strong>Trạng thái</strong></label>
                                <select name="status" className="form-select" onChange={e => setStatus(e.target.value)} value={status}>
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

export default StaffEdit;
