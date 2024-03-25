const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = file.originalname.split(".")[0];
        const fileExtension = file.originalname.split(".").pop(); // Extract original file extension
        cb(null, filename + "-" + uniqueSuffix + "." + fileExtension); // Append original file extension
    }
});

exports.upload = multer({ storage: storage });
