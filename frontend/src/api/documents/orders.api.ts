import { http } from '../http';

export const ordersApi = {
  async getList(): Promise<unknown[]> {
    console.log('http', http)

    const response = await http.get('/orders');

    console.log('response', response);

    return response.data;
  },
};
