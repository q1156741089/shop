import  axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
export function request(config,baseURL='http://127.0.0.1:8888/api/private/v1/') {
     const instance = axios.create({
       baseURL :baseURL,
       timeout : 5000
     });
  // 请求拦截器
         instance.interceptors.request.use(config=>{
       //拦截后需要将拦截下的请求返回发送
             NProgress.start();
      config.headers.Authorization = window.sessionStorage.getItem('token');
       return config
        });
  //     //响应拦截器
     instance.interceptors.response.use(res=>{
         NProgress.done();
       return res.data
     });
    return instance(config)
}


