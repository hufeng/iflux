var React = require('react');

var PureMixin = module.exports = {

  /**
   * 我们做了那么多事情，就为了这一点，精确的控制virtualdom的刷新
   */
  shouldComponentUpdate(nextProps, nextState) {

    //很简单的遍历下，直接判断两个值是不是相同
    for (var key in nextProps) {
      if (nextProps.hasOwnProperty(key)) {
        var newData = nextProps[key];
        var currentData = this.props[key];

        if (newData !== currentData) {
          return true;
        }
      }
    }

    return false;
  }
};
