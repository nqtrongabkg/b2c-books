import React, { useEffect, useState } from 'react';
import SliderService from '../../../services/SliderService';
import { FaToggleOn, FaTrash, FaEdit, FaToggleOff } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { urlImageSlider } from '../../../config';
import Pagination from '../../site/homeComponents/productComponents/Pagination';
import { useNavigate } from 'react-router-dom';

const SliderIndex = () => {
    const [sliders, setSliders] = useState([]);
    const [reload, setReload] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const slidersPerPage = 10; // Số sliders trên mỗi trang
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                let result = await SliderService.getAll();
                // Filter out sliders with status 2
                result = result.filter(slider => slider.status !== 2);
                // Sort sliders by createdAt in descending order
                const sortedSliders = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setSliders(sortedSliders);
                setTotalPages(Math.ceil(sortedSliders.length / slidersPerPage));
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/admin/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchData();
    }, [reload]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const HandTrash = async (id) => {
        await SliderService.trash(id);
        setReload(Date.now());
        toast.success("Chuyển vào thùng rác");
    };

    const handleStatus = async (id, currentStatus) => {
        try {
            await SliderService.sitchStatus(id);
            setReload(Date.now());
            toast.success("Thành công");
        } catch (error) {
            console.error('Error switching status:', error);
            toast.error("Đã xảy ra lỗi khi thay đổi trạng thái.");
        }
    };

    const handleDisplay = async (id) => {
        await SliderService.display(id);
        setReload(Date.now());
        toast.success("Đã chuyển đổi trưng bày");
    };

    const indexOfLastSlider = currentPage * slidersPerPage;
    const indexOfFirstSlider = indexOfLastSlider - slidersPerPage;
    const currentSliders = sliders.slice(indexOfFirstSlider, indexOfLastSlider);

    return (
        <div className="content">
            <section className="content-header my-2">
                <h1 className="d-inline">Danh sách Slider</h1>
                <Link to="/admin/slider/add" className="btn-add">Thêm mới</Link>
                <div className="row mt-3 align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-warning">
                            <a href="/admin/slider/trash">Thùng rác</a>
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
                            <th>Tên</th>
                            <th>Ảnh</th>
                            <th>Mô tả</th>
                            <th>Ngày tạo</th>
                            <th>Trưng bày</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSliders && currentSliders.length > 0 &&
                            currentSliders.map((slider, index) => {
                                return (
                                    <tr key={slider.id} className="datarow">
                                        <td className="text-center">
                                            <input type="checkbox" id={`checkId${index}`} />
                                        </td>
                                        <td>
                                            <div className="name">
                                                <a href="menu_index.html">
                                                    {slider.name}
                                                </a>
                                            </div>
                                            <div className="function_style">
                                                <button
                                                    onClick={() => handleStatus(slider.id, slider.status)}
                                                    className={
                                                        slider.status === 1 ? "border-0 px-1 text-success" : "border-0 px-1 text-danger"
                                                    }>
                                                    {slider.status === 1 ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                                                </button>
                                                <Link to={"/admin/slider/edit/" + slider.id} className='px-1 text-primary'>
                                                    <FaEdit size={20} />
                                                </Link>
                                                <button
                                                    onClick={() => HandTrash(slider.id)}
                                                    className="btn-none px-1 text-danger">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            {slider.image ? (
                                                <img src={urlImageSlider + slider.image} className="img-fluid user-avatar" alt="HinhAnh" />
                                            ) : (
                                                <p>Không có ảnh</p>
                                            )}
                                        </td>
                                        <td>{slider.description}</td>
                                        <td>{slider.createdAt}</td>
                                        <td>
                                            <button
                                                onClick={() => handleDisplay(slider.id)}
                                                className={
                                                    slider.status === 3 ? "border-0 px-1 text-success" : "border-0 px-1 text-danger"
                                                }>
                                                {slider.status === 3 ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </section>
        </div>
    );
};

export default SliderIndex;
