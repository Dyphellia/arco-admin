import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { getToken } from '@/utils/auth';
import { Message, Modal } from '@arco-design/web-vue';
import { useUserStore } from '@/store';

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
axios.interceptors.response.use(
  (response) => {
    const { data: res } = response;
    if (res.code !== 2000) {
      Message.error({
        content: res.msg || `Error`,
        duration: 3 * 1000,
      });
      const arr = [5008, 50012, 50014];
      if (arr.includes(res.code) && response.config.url !== `api/user/info`) {
        Modal.error({
          title: 'Confirm logout',
          content:
            'You have been logged out, you can cancel to stay on this page, or log in again',
          okText: 'Re-Login',
          async onOk() {
            const userStore = useUserStore();
            await userStore.logout();
            window.location.reload();
          },
        });
      }
      return Promise.reject(new Error(res.msg || `Error`));
    }
    return res;
  },
  (err) => {
    Message.error({
      content: err.msg || 'Request Error',
      duration: 5 * 1000,
    });
    return Promise.reject(err);
  }
);
export default axios