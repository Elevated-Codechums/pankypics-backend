export const photoFileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
    const allowedPhotoTypes = /jpeg|jpg|png|webp/;
    allowedPhotoTypes.test(file.mimetype) ? cb(null, true) : cb(new Error('Only JPG, PNG, and WebP are allowed.'));
};
