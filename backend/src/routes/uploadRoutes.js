const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect, admin } = require("../middlewares/auth");

// 1. Cấu hình nơi lưu trữ và cách đặt tên file
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // Ảnh sẽ được lưu vào thư mục backend/uploads/
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

// 2. Bộ lọc định dạng file (Chỉ cho phép up ảnh)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận định dạng ảnh (jpg, jpeg, png, webp)!"));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// 3. API xử lý Upload (Chỉ Admin mới có quyền upload ảnh sản phẩm)
router.post("/", protect, admin, (req, res) => {
  upload.single("image")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "Lỗi Multer: " + err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Vui lòng chọn file ảnh để upload" });
    }

    res.json({
      message: "Tải ảnh lên thành công",
      image: `/${req.file.path.replace(/\\/g, "/")}`,
    });
  });
});

module.exports = router;
