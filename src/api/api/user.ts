import axios from '@/api/config/interceptor';
import { LoginData, LoginRes } from '@/api/user';

export function login(data: LoginData) {
  return axios({
    method: 'get',
    url: 'api/user/login',
    data,
  });
}
