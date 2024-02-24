import { request } from '@/libs'
export const getList = () => {
    return request({
        url: 'list',
        method: 'get'
    })
}
