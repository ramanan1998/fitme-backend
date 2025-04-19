import multer from "multer";

const storage = multer.memoryStorage();

export const handleImages = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5mb
    },
    fileFilter: (req, file, cb) => {
        if([ "image/jpeg", "image/png", "image/tiff" ].includes(file.mimetype)){
            cb(null, true)
        }else{
            cb(null, false)
        }
    }
});