"use strict";
var mask = require('../lib/mask');
var json = [[{password: '123', 'address': '重庆市九龙坡区手机看看'}, {
    name: '草·泥·马',
    password: '123',
    telephone: '(023)12345678',
    telphone: '(023)-12345678',
    'address': "重庆市%22九龙坡区手机看看",
    data: {password: '123', 'address': '重庆市九龙坡区手机看看'},
    datas: [{password: '123', 'address': '重庆市九龙坡区手机看看'}, {password: '123', 'address': '重庆市九龙坡区手机看看'}]
}]];
console.log(JSON.stringify(mask.encrypt(json)));
console.log(JSON.stringify(json));
var json2 = {
    name: '张三',
    password: '123',
    'address': '重庆市九龙坡区手机看看',
    telephone: '02312345678',
    telphone: '023-12345678',
    data: {password: '123', 'address': '重庆市九龙坡区手机看看'},
    datas: [[{password: '123', 'address': '重庆市九龙坡区手机看看'}, {password: '123', 'address': '重庆市九龙坡区手机看看'}]]
};
console.log(JSON.stringify(mask.encrypt(json2)));
console.log(JSON.stringify(json2));
var json3 = {
    name: '张三',
    password: '123"',
    'address': '重庆市九龙坡区手机看看',
    data: {password: '123', 'address': '重庆市九龙坡区手机看看'},
    datas: [[{password: '123', 'address': '重庆市九龙坡区手机看看'}, {password: '123', 'address': '重庆市九龙坡区手机看看'}]]
};
console.log(mask.encrypt("测试代码：" + JSON.stringify(json3)));
console.log(JSON.stringify(json3));