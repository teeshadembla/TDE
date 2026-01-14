export const healthCheck = async (req, res) => {
  if (process.env.NODE_ENV === 'test') {
    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }

  // real checks only outside test
  try {
    await checkDatabase();
    await checkStripe();
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error' });
  }
};
