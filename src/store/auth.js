import { reactive } from 'vue';
import axios from 'axios';

export const authState = reactive({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
});

export const setAuthState = (user) => {
  authState.user = user;
  authState.isAuthenticated = Boolean(user);
  authState.isAdmin = user?.role === 'admin';
};

export const checkAuth = async () => {
  authState.isLoading = true;

  try {
    const response = await axios.get('/api/auth/current-user', {
      withCredentials: true,
    });
    setAuthState(response.data.user);
    return response.data.user;
  } catch (error) {
    setAuthState(null);
    return null;
  } finally {
    authState.isLoading = false;
  }
};

export const loginUser = async (credentials) => {
  const response = await axios.post('/api/auth/login', credentials, {
    withCredentials: true,
  });

  setAuthState(response.data.user);
  return response.data;
};

export const registerUser = async (credentials) => {
  const response = await axios.post('/api/auth/register', credentials, {
    withCredentials: true,
  });

  setAuthState(response.data.user);
  return response.data;
};

export const logoutUser = async () => {
  try {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
  } finally {
    setAuthState(null);
  }
};
