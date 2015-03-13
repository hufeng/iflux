/**
 * hello-iflux
 */

var iflux = require('../index');

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
    username: '',
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
console.log('cursor->', appStore.cursor().toString());

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
      maxLength: 'max length 20'      
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
    required: true,
    email: true,
    message: {
      required: 'email is requied',
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


//validator all
validator.isValid();
console.log('fieldErros->', validator.fieldErrors());

//validator confirm
//validator.isValid('form.confirm');
