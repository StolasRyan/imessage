export function playNotificationSound() {
  const audio = new Audio("/sounds/notification.mp3");
  audio.currentTime = 0;
  audio.play().catch((err) => {
    // браузер может заблокировать autoplay без взаимодействия пользователя
    console.log("Sound play blocked:", err);
  });
}