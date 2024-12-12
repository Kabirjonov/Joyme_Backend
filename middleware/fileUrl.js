module.exports = function createImageUrl (req, res, next) {
    if (req.file) {
      const protocol = req.protocol;
      const host = req.hostname;
      const port = process.env.PORT || 3001;
      req.ImgUrl = `${protocol}://${host}:${port}/uploads/${req.file.filename}`;
    } else {
      req.ImgUrl = '';
    }
    next();
  };
