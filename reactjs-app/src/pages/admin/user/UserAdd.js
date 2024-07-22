import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../../services/UserService';
import RoleService from '../../../services/RoleService';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';

const UserAdd = () => {

    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const result = await RoleService.getAll();
                const filteredRoles = result.filter(role => role.role !== 1);
                setRoles(filteredRoles);
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };
        fetchRoles();
    }, []);

    const sessionUserAdmin = sessionStorage.getItem('useradmin');
    let createdBy = null;
    if (sessionUserAdmin !== null) {
        const parsedUser = JSON.parse(sessionUserAdmin);
        createdBy = parsedUser.userId;
    }

    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [selectedRole, setSelectedRole] = useState(null);
    const [status, setStatus] = useState(1);
    const [avatar, setAvatar] = useState(null);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            name: name,
            userName: username,
            password: password,
            phone: phone,
            email: email,
            address: address,
            createdBy: createdBy,
            role: selectedRole,
            status: status,
        };
        const path = {
            path: "users"
        };

        try {
            const result = await UserService.create(userData);
            if (result) { 
                if(avatar !== null){
                    const imageString = await UserService.saveImage(result.id, path, avatar)
                    console.log("string image save user : ", imageString); 
                    if(imageString !== null){
                        const data = {
                            id: result.id,
                            image: imageString
                        };
                        console.log("setimage data is: ", data);
                        await UserService.setImage(data);
                    }
                }
                console.log("usser added = ", result);
                toast.success("Thêm thành công");
                navigate("/admin/user/index", { replace: true });
            }
        } catch (error) {
            console.error("Error adding user:", error);
            toast.error("Thêm người dùng thất bại!");
        }
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="content">
                <section className="content-header my-2">
                    <h1 className="d-inline">Thêm người dùng</h1>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-12 text-end">
                            <Button variant="success" size="sm" href="/admin/user/index" className="ml-2">
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
                                <input type="text" name="username" className="form-control" placeholder="Tên đăng nhập" value={username} onChange={e => setUsername(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Mật khẩu(*)</strong></label>
                                <input type="password" name="password" className="form-control" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Email(*)</strong></label>
                                <input type="text" name="email" className="form-control" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Địa chỉ(*)</strong></label>
                                <input type="text" name="name" className="form-control" placeholder="Địa chỉ" value={address} onChange={e => setAddress(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Điện thoại(*)</strong></label>
                                <input type="text" name="phone" className="form-control" placeholder="Điện thoại" value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label><strong>Họ tên (*)</strong></label>
                                <input type="text" name="name" className="form-control" placeholder="Họ tên" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Ảnh đại diện</strong></label>
                                <input type="file" id="image" className="form-control" onChange={(e) => setAvatar(e.target.files[0])} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Quyền (*)</strong></label>
                                <select
                                    name="role"
                                    id="role"
                                    className="form-select"
                                    onChange={(e) => setSelectedRole(roles.find(role => role.id === e.target.value))}
                                    value={selectedRole ? selectedRole.id : ""}
                                >
                                    <option value="">Chọn Quyền</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
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
                            <button type="submit" className="btn btn-success btn-sm mr-2" name="THEM">
                                <i className="fa fa-save"></i> Lưu [Thêm]
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </form>
    );
}
export default UserAdd;