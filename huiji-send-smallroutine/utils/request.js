const HOST = 'http://localhost:8888';

const get = (url, params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: HOST + url,
      method: 'GET',
      data: params,
      success (res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      }
    })
  })
}

const post = (url, params ,header = {"Content-Type": "application/json"}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: HOST + url,
      method: 'POST',
      header: header,
      data: params,
      success (res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      }
    })
  })
}

const simplePost = (url, params ,header = {"Content-Type": "application/json"}) => {
  const data = convertObj(params)
  return new Promise((resolve, reject) => {
    wx.request({
      url: HOST + url + '?' + data,
      method: 'POST',
      header: header,
      success (res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      }
    })
  })
}

// Object参数 转 url参数
function convertObj(data){
  var _result = [];
  for (var key in data) {
    var value = data[key];
    if (value.constructor == Array) {
      value.forEach(function(_value) {
        _result.push(key + "=" + _value);
      });
    } else {
      _result.push(key + '=' + value);
    }
  }
  return _result.join('&');
}

module.exports = {
  get,
  post,
  simplePost
}
