'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function IndicatorDots(props) {
  if (props.total < 2) return _react2.default.createElement('div', { style: styles.wrapper });

  var dots = [];
  for (var i = 0; i < props.total; i++) {
    var dotStyle = {
      display: 'inline-block',
      height: '8px',
      width: '8px',
      borderRadius: '4px',
      backgroundColor: 'white',
      margin: '7px 5px',
      opacity: props.index === i ? '1' : '0.3',
      transitionDuration: '300ms'
    };
    dots.push(_react2.default.createElement('span', { key: i, style: dotStyle }));
  }
  return _react2.default.createElement(
    'div',
    { style: styles.wrapper },
    dots
  );
}

IndicatorDots.propTypes = {
  index: _react2.default.PropTypes.number.isRequired,
  total: _react2.default.PropTypes.number.isRequired
};

var styles = {
  wrapper: {
    position: 'absolute',
    width: '100%',
    zIndex: '100',
    bottom: '0px',
    textAlign: 'center'
  }
};

exports.default = IndicatorDots;