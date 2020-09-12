/**
 * 数据请求封装
 * 使用说明：request.get('./api')
 * @requires npm:axios
 */
import { message } from 'ant-design-vue';
import axios from 'axios';
import {
  get
} from 'lodash';

const BASE_URL = './';

const supportMethods = [
  'request',
  'get',
  'delete',
  'head',
  'options',
  'post',
  'put',
  'patch',
  'getUri',
  'upload',
  'download'
];


function getiframeDocument(iframe) {
  let iframeDoc = iframe.contentWindow || iframe.contentDocument;
  if (iframeDoc.document) {
    iframeDoc = iframeDoc.document;
  }
  return iframeDoc;
}


function onreset(iframe, resolve, reject) {
  setTimeout(() => {
    const iframeDoc = getiframeDocument(iframe);
    const firstElementChild = iframeDoc.body.firstElementChild;
    if (firstElementChild && firstElementChild.tagName.toLowerCase() === 'form' && firstElementChild.name === 'download') {
      resolve();
    } else {
      const p = iframeDoc.querySelector('pre').innerHTML;
      const responseHtml = p || iframeDoc.body.innerHTML || iframeDoc.body.innerText;
      reject(responseHtml);
    }
  }, '500');
}

function download(actualMethod, actualArgs) {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = 'about:blank';
    document.body.appendChild(iframe);

    const formDoc = getiframeDocument(iframe);
    let formInnerHtml = '';
    if (actualArgs.length > 1) {
      const params = actualArgs[1];
      Object.keys(params).forEach(key => {
        if (key !== 'method') {
          formInnerHtml += `<input type='hidden' name=${key}  value=${params[key]} />`;
        }
      });
    }

    formDoc.write(`<html><head></head><body><form  name="download" onreset=${onreset(iframe, resolve, reject,)} method=${actualMethod} action=${BASE_URL}${actualArgs[0]} >${formInnerHtml}</form></body></html>`);
    const form = formDoc.querySelector('form');
    form.submit();
  });
}

class Request {
  constructor(allMethods) {
    const axiosInstance = axios.create({
      baseURL: BASE_URL,
    });

    // 为所有方法添加错误处理
    allMethods.forEach(method => {
      this[method] = (...args) => {
        const config = args[args.length - 1];
        const indicate = get(config, 'indicate', false);
        let actualMethod = method; // 实际传输方式
        let actualArgs = args; // 实际参数

        // TODO: rename setup -> preRequest
        this.innoConfig.setup();
        if (indicate) {
          this.innoConfig.loading();
        }
        // 文件上传特殊处理
        if (method === 'upload') {
          const formData = new FormData();

          formData.append('file', config);
          actualArgs = [args[0], formData];
          actualMethod = 'post';
        }

        /**
         * 文件下载
         * @param {String} url 必须 下载文件路径
         * @param {Obejct} params 可选 下载文件参数
         * request.download(url)
         * request.download(url,{
         *   filter:JSON.stringify({where:{
         *     ...
         *   }})
         *   method:'post' 默认post
         *   ...
         * })
         */
        if (method === 'download') {
          actualMethod = 'get';
          if (actualArgs.length > 1) {
            actualMethod = actualArgs[1].method || 'post';
          }
          return download(actualMethod, actualArgs);
        }

        return axiosInstance[actualMethod](...actualArgs)
          .then(res => get(res, 'data', {}))
          .catch(err => {
            const status = get(err, 'response.status');

            if (status === 401) {
              // 没权限
              message.error('登录状态失效，请重新登录');
              this.innoConfig.error401(err);
            }
            switch (status) {
              case 401:
                this.innoConfig.error401();
                break;
              case 404:
                this.innoConfig.error404();
                break;
              default:
                break;
            }
            return Promise.reject(err);
          })
          .finally(() => {
            this.innoConfig.loaded();
          });
      };
    });

    this.axios = axiosInstance;
    this.innoConfig = {
      setup() {},
      error401() {},
      error404() {},
      loading() {},
      loaded() {},
    };
  }
}

export default new Request(supportMethods);
