"use strict";
var mask = require('../lib/mask');
var json = [[{password: '123', 'address': '重庆市九龙坡区手机看看'}, {
    password: '123',
    'address': '重庆市九龙坡区手机看看',
    data: {password: '123', 'address': '重庆市九龙坡区手机看看'},
    datas: [{password: '123', 'address': '重庆市九龙坡区手机看看'}, {password: '123', 'address': '重庆市九龙坡区手机看看'}]
}]];
console.log(JSON.stringify(mask.encrypt(json)));
console.log(json);
var json2 = {
    password: '123',
    'address': '重庆市九龙坡区手机看看',
    data: {password: '123', 'address': '重庆市九龙坡区手机看看'},
    datas: [[{password: '123', 'address': '重庆市九龙坡区手机看看'}, {password: '123', 'address': '重庆市九龙坡区手机看看'}]]
};
console.log(JSON.stringify(mask.encrypt(json2)));
console.log(json2);