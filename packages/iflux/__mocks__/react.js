const React = require('react');

// jest can not trigger useEffect
// so mock React

module.exports = {
  ...React,
  useEffect: React.useLayoutEffect
};
