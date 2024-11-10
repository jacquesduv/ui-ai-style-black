// src/utils/ToastNotifications.js
import { toast } from "react-toastify";

// Common toast configuration
const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

// Success notification
export const notifySuccess = (message) => {
  toast.success(message, toastConfig);
};

// Error notification
export const notifyError = (message) => {
  toast.error(message, toastConfig);
};

// Info notification
export const notifyInfo = (message) => {
  toast.info(message, toastConfig);
};

// Warning notification
export const notifyWarn = (message) => {
  toast.warn(message, toastConfig);
};
