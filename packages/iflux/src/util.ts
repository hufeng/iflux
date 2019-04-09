const toString = Object.prototype.toString;

/**
 * 获取当前参数的类型
 * @param param
 */
export const type = (param: any) => toString.call(param);

/**
 * 判断当前的参数是不是字符串
 * @param param
 */
export const isStr = (param: any): param is string =>
  type(param) === '[object String]';

/**
 * 判断当前的参数是不是数组
 * @param param
 */
export const isArray = (param: any): param is Array<any> =>
  type(param) === '[object Array]';

/**
 * 判断参数是不是函数
 */
export const isFn = (param: any): param is Function =>
  type(param) === '[object Function]';

/**
 * 判断参数是不是对象
 */
export const isObj = (param: any): param is object =>
  type(param) === '[object Object]';

/**
 * 根据路径获取对应路径的值
 * 很有immatable获取值得感觉，这样做的好处在于深度获取对象的值
 * 可以不写那么多的值判断，当发现路径中对应的值是undefined时候提前返回
 * 另外，很容易在内部去cache
 *
 * @param data
 * @param path
 */
export const getPathVal = (
  data: Object,
  path: Array<string | number> | string
) => {
  if (isArray(path)) {
    let result = data;
    for (let p of path) {
      result = result[p];
      if (typeof result === 'undefined') {
        return undefined;
      }
    }
    return result;
  } else if (isStr(path)) {
    //support 'list.0.id'
    if (path.indexOf('.') != -1) {
      return getPathVal(data, path.split('.'));
    }
    return data[path];
  }
};
