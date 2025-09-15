const  Notification= require("../models/Notification");
const sendNotification = async (userId, message, type, req) => {
   const notification = await Notification.create({
    user: userId,
    message,
    type,
  });

  const io = req.app.get("io");
  if (io) {
    io.to(userId.toString()).emit("newNotification", notification); // emit to user's room
  }

  return notification;
};
module.exports={sendNotification}