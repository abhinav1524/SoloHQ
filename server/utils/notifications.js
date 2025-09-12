const sendNotification = async (userId, message, type, req) => {
  const notification = {
    id: Date.now(),
    user: userId,
    message,
    type,
    read: false,
    createdAt: new Date(),
  };

  const io = req.app.get("io");
  if (io) {
    io.to(userId).emit("newNotification", notification); // emit to user's room
  }

  return notification;
};
