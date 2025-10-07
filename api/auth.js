module.exports = async (req, res) => {
  res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
  res.status(401).json({ error: 'Authentication required' });
};
