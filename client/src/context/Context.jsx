import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const ChatContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Axios global setup
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true; // send cookies automatically

const Context = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // ✅ Check authentication on mount
  const checkAuthentication = async () => {
    try {
      const { data } = await axios.get("/user/checkAuth");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user); // only connect after login
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // not logged in yet → silent
        setAuthUser(null);
      } else if (
        error.response?.data?.message?.toLowerCase().includes("expired")
      ) {
        logout();
        toast.error("Session expired. Please login again.");
      } else {
        console.error(error);
      }
    }
  };

  // ✅ Connect socket
  const connectSocket = (userData) => {
    // Close any previous socket
    if (socket) socket.disconnect();

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
      withCredentials: true,
    });
    setSocket(newSocket);

    // Listen online users
    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });
  };

  // ✅ Login (state = "loginUser" or "signupUser")
  const login = async (state, credentials) => {
    try {
      const res = await axios.post(`/user/${state}`, credentials);
      if (res.data.success) {
        setAuthUser(res.data.user);
        connectSocket(res.data.user);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ✅ Update Profile
  const updateProfile = async (profileData) => {
    try {
      const { data } = await axios.put("/user/updateProfile", profileData);
      if (data.success) {
        setAuthUser(data.user);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await axios.post("/user/logout", {});
      setAuthUser(null);
      setOnlineUsers([]);
      if (socket) socket.disconnect();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ✅ Run auth check once on mount
  useEffect(() => {
    checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
};

export default Context;
