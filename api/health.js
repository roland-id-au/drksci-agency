module.exports = async (req, res) => {
  res.json({
    status: 'ok',
    service: 'drksci-agency',
    timestamp: new Date().toISOString()
  });
};
