import app from './app';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
      console.log(`🔑 Auth API: http://localhost:${PORT}/auth`);
      console.log(`✅ Tasks API: http://localhost:${PORT}/tasks`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
