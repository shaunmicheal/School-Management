import { useState, useEffect } from "react";
import API from "../api"; 

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) return;
      const { data } = await API.get(`/notifications/${user.id}`);
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-stone-700 hover:text-stone-900 focus:outline-none"
        aria-label="Open notifications"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 sm:hidden"
          />
          <div className="fixed inset-x-4 top-16 z-50 rounded-xl bg-white p-4 shadow-2xl border border-stone-200 sm:absolute sm:inset-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-80">
            <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-2">
              <h4 className="font-bold text-stone-800 text-sm">
                Notifications
              </h4>
              {unreadCount > 0 && (
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {notifications.length === 0 ? (
              <p className="text-xs text-stone-500 py-2">
                No notifications yet.
              </p>
            ) : (
              <div className="max-h-64 sm:max-h-80 overflow-y-auto space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                    className={`p-3 rounded-lg text-xs cursor-pointer transition ${
                      n.isRead
                        ? "bg-stone-50 text-stone-600 border border-stone-100"
                        : "bg-amber-50 text-amber-900 border border-amber-200 font-medium"
                    }`}
                  >
                    <p className="font-semibold">{n.title}</p>
                    <p className="mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;