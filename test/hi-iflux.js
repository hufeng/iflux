/**
 * hello-iflux
 */

var iflux = require('../index');
var Immutable = require('immutable');

/**
 * 数据中心
 */
var appStore = module.exports = iflux.Store({
  name: 'iflux',
  dependencies: [
    'immutable.js',
    'React.js',
    'webpack'
  ],
  form: {
    username: 'iflux1.0.7',
    password: '',
    confirm: ':)'
  },
  email: ''
});


//获取store数据
//console.log(appStore.data());
console.log('store data->', appStore.data().toString());

//获取store数据的cursor
//console.log(appStore.cursor());
//console.log('cursor->', appStore.cursor().toString());

/**
 * validator
 */
var validator = iflux.Validator(appStore, {
  'form.username': {
    required: true,
    minLength: 6,
    maxLength: 20,
    message: {
      required: 'username is required.',
      minLength: 'mix lenth 6',
      maxLength: 'max length 20',
      success: 'username is valid'
    }
  },
  'form.password': {
    required: true,
    message: {required: 'password is required.'}
  },
  'form.confirm': {
    required: true,
    equal: 'form.password',
    message: {
      required: 'confirm password is required.',
      equal: 'confirm password should be equal password'
    }
  },
  email: {
    customRequired: true,
    email: true,
    message: {
      customRequired: 'email is custom requied',
      email: 'email is invalid.'
    }
  }
});


/**
 * add custom validator rule
 */
validator.rule('equal', function(param, val) {
  var password = appStore.data().getIn(param.split('\.'));

  return password === val;
});


validator.rule('customRequired', function(param, val) {
  var result = true;
  if (param == true) {
    return !!val;
  }
  return result;
});


//validator all
//validator.isValid();
//console.log('fieldErros->', validator.fieldErrors());

//validator confirm
validator.isValid('form.confirm');
validator.isValid('form.username');
validator.clearError('form.confirm');
//validator.clearError();
validator.isValid('form.password');
console.log('fieldErros->',appStore.data().toString());


appStore.cursor().set('form', Immutable.fromJS({
  username: 'hf',
  password: 'hf',
  confirm: '(:'
}));


//console.log(appStore.data().get('form').toString());
// appStore.reset('form');
// console.log(appStore.data().get('form').toString());

//appStore.reset(['form', 'username'])
//appStore.reset(); //rollback
//console.log('reset->');
//console.log(appStore.data().get('form').toString());
