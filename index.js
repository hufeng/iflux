module.exports = {
  Store: require('./lib/store'),
  connectToStore: require('./lib/connect-to-store'),
  Validator: require('./lib/validator'),
  msg: require('./lib/msg'),
  mixins: {
    StoreMixin: require('./lib/mixins/store-mixin')
  }
};
