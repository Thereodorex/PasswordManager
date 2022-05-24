import { API_URL } from './config';

export const loginUrl = `${API_URL}/api/Account/login`;
export const registerUrl = `${API_URL}/api/Account/registration`;
export const logoutUrl = `${API_URL}/api/Account/logout`;
export const usersUrl = `${API_URL}/api/Account/users`;
export const shareUrl = `${API_URL}/api/SecretData/sharing`;

export const secretDataUrl = `${API_URL}/api/SecretData`;
export const secretDataByIdUrl = id => `${API_URL}/api/SecretData/${id}`; // post or delete
export const secretDataCreateUrl = `${API_URL}/api/SecretData/create`;
export const secretDataShareUrl = `${API_URL}/api/SecretData/sharing`;

export const dataTypesUrl = `${API_URL}/api/DataType`;
// export const dataTypesUrl = 'http://195.2.80.65:5267/api/DataType';
