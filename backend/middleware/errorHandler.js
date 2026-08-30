export function notFound(req, res) {
  res.status(404).json({ success: false, message: 'Route not found' });
}

export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err?.name === 'ValidationError') {
    const message = Object.values(err.errors).map((item) => item.message).join(', ');
    return res.status(400).json({ success: false, message });
  }

  if (err?.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid resource id' });
  }

  if (err?.code === 11000) {
    return res.status(409).json({ success: false, message: 'Duplicate record' });
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error'
  });
}
