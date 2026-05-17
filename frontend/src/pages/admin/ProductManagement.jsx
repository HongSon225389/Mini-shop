// frontend/src/pages/admin/ProductManagement.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Package,
  Search,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

const ProductManagement = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false); // State quản lý upload ảnh

  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    image: "",
    brand: "",
    category: "",
    countInStock: 0,
    description: "",
  });

  useEffect(() => {
    if (!userInfo || userInfo.role !== "admin") {
      navigate("/");
    } else {
      fetchProducts();
    }
  }, [userInfo, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/products?limit=100");
      setProducts(data.products || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  // HÀM XỬ LÝ UPLOAD ẢNH THỰC TẾ
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      const { data } = await axiosInstance.post("/upload", uploadData, config);

      // Quan trọng: key 'image' phải khớp với res.json({ image: ... }) ở Backend
      setFormData({ ...formData, image: data.image });
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert("Lỗi khi tải ảnh lên!");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openEditModal = (product) => {
    setEditMode(true);
    setCurrentId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      category: product.category,
      countInStock: product.countInStock,
      description: product.description,
    });
    setShowModal(true);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (formData.name.trim().length < 5) {
      return alert("Tên sản phẩm quá ngắn (tối thiểu 5 ký tự)");
    }
    if (formData.price <= 0) {
      return alert("Giá sản phẩm phải lớn hơn 0");
    }
    if (formData.countInStock < 0) {
      return alert("Tồn kho không được phép âm");
    }
    if (!formData.image) {
      return alert("Vui lòng tải ảnh lên hoặc nhập URL ảnh");
    }
    try {
      if (editMode) {
        await axiosInstance.put(`/products/${currentId}`, formData);
        alert("Cập nhật thành công!");
      } else {
        await axiosInstance.post("/products", formData);
        alert("Thêm mới thành công!");
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi xử lý");
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await axiosInstance.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert("Lỗi xóa");
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center tracking-tight">
          <Package className="mr-3 text-blue-600" size={32} /> Quản lý Sản phẩm
        </h1>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Tìm tên sản phẩm nhanh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white shadow-sm transition-all"
            />
            <Search className="absolute left-4 top-3 text-gray-400" size={18} />
          </div>

          <button
            onClick={() => {
              setEditMode(false);
              setFormData({
                name: "",
                price: 0,
                image: "",
                brand: "",
                category: "",
                countInStock: 0,
                description: "",
              });
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-bold flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={20} className="mr-1" /> Thêm sản phẩm
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b">
              <tr>
                <th className="p-5 text-[11px] font-black uppercase text-gray-400 tracking-wider">
                  Sản phẩm
                </th>
                <th className="p-5 text-[11px] font-black uppercase text-gray-400 tracking-wider">
                  Giá bán
                </th>
                <th className="p-5 text-[11px] font-black uppercase text-gray-400 tracking-wider text-center">
                  Tồn kho
                </th>
                <th className="p-5 text-[11px] font-black uppercase text-gray-400 tracking-wider text-center">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-12 text-gray-400 italic"
                  >
                    Đang tải dữ liệu sản phẩm...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-12 text-gray-400 italic"
                  >
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="p-5">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover mr-4 bg-gray-100 border border-gray-100"
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/150")
                          }
                        />
                        <div>
                          <p className="font-bold text-gray-800 text-sm">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-gray-400 uppercase font-bold">
                            {product.brand}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-blue-600 font-extrabold text-sm">
                      {product.price.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="p-5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black ${product.countInStock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                      >
                        {product.countInStock}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => deleteHandler(product._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Xóa bỏ"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-3xl overflow-y-auto max-h-[90vh] shadow-2xl">
            <div className="p-8 border-b flex justify-between items-center sticky top-0 bg-white/90">
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                {editMode ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
              </h2>
              <X
                className="cursor-pointer text-gray-400 hover:text-red-500"
                onClick={() => setShowModal(false)}
              />
            </div>

            <form onSubmit={submitHandler} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ảnh sản phẩm */}
                <div className="md:col-span-2 bg-blue-50/50 p-4 rounded-3xl border border-blue-100">
                  <label className="block text-[11px] font-black uppercase text-blue-500 mb-2 ml-1">
                    Hình ảnh
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center text-gray-300">
                      {formData.image ? (
                        <img
                          src={formData.image}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        name="image"
                        required
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="URL ảnh..."
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-blue-500 outline-none"
                      />
                      <label className="inline-block px-4 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-[10px] cursor-pointer hover:bg-blue-700">
                        {uploading ? "Đang tải..." : "TẢI ẢNH TỪ MÁY"}
                        <input
                          type="file"
                          className="hidden"
                          onChange={uploadFileHandler}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Tên sản phẩm */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-black uppercase text-gray-400 mb-1 ml-1">
                    Tên sản phẩm
                  </label>
                  <input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-bold"
                  />
                </div>

                {/* Giá bán */}
                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-400 mb-1 ml-1">
                    Giá bán (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-blue-600"
                  />
                </div>

                {/* Tồn kho */}
                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-400 mb-1 ml-1">
                    Tồn kho
                  </label>
                  <input
                    type="number"
                    name="countInStock"
                    min="0"
                    required
                    value={formData.countInStock}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-400 mb-1 ml-1">
                    Thương hiệu
                  </label>
                  <input
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-400 mb-1 ml-1">
                    Danh mục
                  </label>
                  <input
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-gray-400 mb-1 ml-1">
                  Mô tả chi tiết
                </label>
                <textarea
                  name="description"
                  rows="3"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none text-sm leading-relaxed"
                />
              </div>

              <div className="flex justify-end pt-6 border-t gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-400 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-10 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                >
                  {editMode ? "CẬP NHẬT" : "LƯU SẢN PHẨM"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;

// // frontend/src/pages/admin/ProductManagement.jsx
// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../utils/axiosInstance";
// import { Plus, Edit, Trash2, X, Package, Search } from "lucide-react"; // Đã import thêm Search icon

// const ProductManagement = () => {
//   const navigate = useNavigate();
//   const { userInfo } = useSelector((state) => state.auth);

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);

//   // STATE TÌM KIẾM CHO ADMIN
//   const [searchTerm, setSearchTerm] = useState("");

//   // LOGIC SỬA SẢN PHẨM
//   const [editMode, setEditMode] = useState(false);
//   const [currentId, setCurrentId] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     price: 0,
//     image: "/images/sample.jpg",
//     brand: "",
//     category: "",
//     countInStock: 0,
//     description: "",
//   });

//   useEffect(() => {
//     if (!userInfo || userInfo.role !== "admin") {
//       navigate("/");
//     } else {
//       fetchProducts();
//     }
//   }, [userInfo, navigate]);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axiosInstance.get("/products?limit=100");
//       setProducts(data.products || []);
//       setLoading(false);
//     } catch (err) {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const openEditModal = (product) => {
//     setEditMode(true);
//     setCurrentId(product._id);
//     setFormData({
//       name: product.name,
//       price: product.price,
//       image: product.image,
//       brand: product.brand,
//       category: product.category,
//       countInStock: product.countInStock,
//       description: product.description,
//     });
//     setShowModal(true);
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       if (editMode) {
//         await axiosInstance.put(`/products/${currentId}`, formData);
//         alert("Cập nhật thành công!");
//       } else {
//         await axiosInstance.post("/products", formData);
//         alert("Thêm mới thành công!");
//       }
//       setShowModal(false);
//       fetchProducts();
//     } catch (err) {
//       alert(err.response?.data?.message || "Lỗi xử lý");
//     }
//   };

//   const deleteHandler = async (id) => {
//     if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
//       try {
//         await axiosInstance.delete(`/products/${id}`);
//         fetchProducts();
//       } catch (err) {
//         alert("Lỗi xóa");
//       }
//     }
//   };

//   // LOGIC LỌC SẢN PHẨM THEO TỪ KHÓA
//   const filteredProducts = products.filter((product) =>
//     product.name.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   return (
//     <div className="py-6">
//       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//         <h1 className="text-2xl font-bold text-gray-800 flex items-center">
//           <Package className="mr-2 text-blue-600" /> Quản lý Sản phẩm
//         </h1>

//         <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
//           {/* THANH TÌM KIẾM DÀNH RIÊNG CHO ADMIN */}
//           <div className="relative w-full sm:w-64">
//             <input
//               type="text"
//               placeholder="Tìm tên sản phẩm..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white shadow-sm"
//             />
//             <Search
//               className="absolute left-3 top-2.5 text-gray-400"
//               size={18}
//             />
//           </div>

//           <button
//             onClick={() => {
//               setEditMode(false);
//               setFormData({
//                 name: "",
//                 price: 0,
//                 image: "/images/sample.jpg",
//                 brand: "",
//                 category: "",
//                 countInStock: 0,
//                 description: "",
//               });
//               setShowModal(true);
//             }}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center hover:bg-blue-700 whitespace-nowrap shadow-sm"
//           >
//             <Plus size={20} className="mr-1" /> Thêm sản phẩm
//           </button>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         <table className="w-full text-left">
//           <thead className="bg-gray-50 border-b">
//             <tr>
//               <th className="p-4 text-gray-600 font-semibold">TÊN SẢN PHẨM</th>
//               <th className="p-4 text-gray-600 font-semibold">GIÁ</th>
//               <th className="p-4 text-gray-600 font-semibold">TỒN KHO</th>
//               <th className="p-4 text-center text-gray-600 font-semibold">
//                 THAO TÁC
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan="4" className="text-center py-8 text-gray-500">
//                   Đang tải dữ liệu...
//                 </td>
//               </tr>
//             ) : filteredProducts.length === 0 ? (
//               <tr>
//                 <td colSpan="4" className="text-center py-8 text-gray-500">
//                   {searchTerm
//                     ? "Không tìm thấy sản phẩm nào phù hợp."
//                     : "Chưa có sản phẩm nào."}
//                 </td>
//               </tr>
//             ) : (
//               // MAP QUA DANH SÁCH ĐÃ LỌC THAY VÌ DANH SÁCH GỐC
//               filteredProducts.map((product) => (
//                 <tr
//                   key={product._id}
//                   className="border-b hover:bg-gray-50 transition-colors"
//                 >
//                   <td className="p-4 font-semibold text-gray-800">
//                     {product.name}
//                   </td>
//                   <td className="p-4 text-red-600 font-medium">
//                     {product.price.toLocaleString("vi-VN")} đ
//                   </td>
//                   <td className="p-4">
//                     <span
//                       className={`px-2 py-1 rounded text-sm font-medium ${product.countInStock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
//                     >
//                       {product.countInStock}
//                     </span>
//                   </td>
//                   <td className="p-4 flex justify-center space-x-3">
//                     <button
//                       onClick={() => openEditModal(product)}
//                       className="text-blue-500 hover:bg-blue-100 p-2 rounded-lg transition-colors"
//                       title="Sửa"
//                     >
//                       <Edit size={18} />
//                     </button>
//                     <button
//                       onClick={() => deleteHandler(product._id)}
//                       className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors"
//                       title="Xóa"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl w-full max-w-2xl overflow-y-auto max-h-[90vh] shadow-2xl">
//             <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
//               <h2 className="text-xl font-bold text-gray-800">
//                 {editMode ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
//               </h2>
//               <X
//                 className="cursor-pointer text-gray-500 hover:text-red-500"
//                 onClick={() => setShowModal(false)}
//               />
//             </div>
//             <form onSubmit={submitHandler} className="p-6 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-semibold mb-1 text-gray-700">
//                     Tên sản phẩm
//                   </label>
//                   <input
//                     name="name"
//                     required
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold mb-1 text-gray-700">
//                     Giá bán (VNĐ)
//                   </label>
//                   <input
//                     type="number"
//                     name="price"
//                     required
//                     value={formData.price}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold mb-1 text-gray-700">
//                     Thương hiệu
//                   </label>
//                   <input
//                     name="brand"
//                     value={formData.brand}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold mb-1 text-gray-700">
//                     Danh mục
//                   </label>
//                   <input
//                     name="category"
//                     required
//                     value={formData.category}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold mb-1 text-gray-700">
//                     Tồn kho
//                   </label>
//                   <input
//                     type="number"
//                     name="countInStock"
//                     required
//                     value={formData.countInStock}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold mb-1 text-gray-700">
//                     Đường dẫn ảnh (URL)
//                   </label>
//                   <input
//                     name="image"
//                     value={formData.image}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-blue-500"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold mb-1 text-gray-700">
//                   Mô tả sản phẩm
//                 </label>
//                 <textarea
//                   name="description"
//                   rows="4"
//                   required
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:border-blue-500"
//                 />
//               </div>
//               <div className="flex justify-end pt-4 border-t mt-4 space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="px-6 py-2.5 border rounded-lg hover:bg-gray-50 font-medium text-gray-700"
//                 >
//                   Hủy
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md"
//                 >
//                   {editMode ? "Cập nhật ngay" : "Lưu sản phẩm"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductManagement;
