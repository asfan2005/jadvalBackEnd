const errorHandler = (err, req, res, next) => {
    console.error('Server xatosi:', err);
    res.status(500).json({ 
        error: 'Serverda xatolik yuz berdi',
        message: err.message 
    });
};

module.exports = errorHandler;