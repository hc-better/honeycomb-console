import request from '../request';

// 用户登录
export const login = ({ username, password }) => {
  return request.post('/loginAuth', { username, password });
};

// 初始化用户
export const initUser = ({ username, password }) => {
  return request.post('/initUser', { username, password });
};

// 获取用户列表
export const list = () => {
  return request.get('/api/user/list');
};

// 添加用户
export const createUser = ({ username, password }) => {
  return request.post('/api/user/create', { username, password });
};

// 删除用户
export const deleteUser = ({ username }) => {
  return request.delete(`/api/user/${username}/delete`);
};

//  更新用户
export const updateUser = ({ username, password }) => {
  return request.put(`/api/user/${username}/update`, { username, password });
};
