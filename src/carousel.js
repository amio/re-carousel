import React from 'react'

class Carousel extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = this.generateStateFromProps(props)
    this.state.current = 0 // current frame index

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
  }

  generateStateFromProps (props) {
    const frames = props.frames || props.children
    return {
      frames: frames,
      total: frames.length,
      auto: props.auto && frames.length > 1,
      vertical: props.axis === 'y',
      horizontal: props.axis === 'x'
    }
  }

  componentDidMount () {
    this.readyAutoSlide()
  }

  componentWillUnmount () {
    clearTimeout(this.state.slider)
  }

  componentWillReceiveProps (props) {
    this.setState(this.generateStateFromProps(props))
  }

  updateFrameSize () {
    const { width, height } = getComputedStyle(this.refs.wrapper)
    this.setState({
      frameWidth: parseFloat(width.split('px')[0]),
      frameHeight: parseFloat(height.split('px')[0])
    })
  }

  readyAutoSlide () {
    if (!this.state.auto) return
    if (this.state.slider) clearTimeout(this.state.slider)

    this.setState({
      slider: setTimeout(() => {
        const direction = {x: 'left', y: 'up'}[this.props.axis]
        this.slideTowards(direction)
      }, this.props.interval)
    })
  }

  slideTowards (direction) {
    // prepare frames
    this.updateFrameSize()
    this.moveFramesBy(0, 0)
    this.updateFrameSize()
    // make the move
    this.moveFramesTowards(direction)

    this.readyAutoSlide()
  }

  onTouchStart (e) {
    if (this.state.total < 2) return

    this.updateFrameSize()
    clearTimeout(this.state.slider)
    const { pageX, pageY } = e.touches && e.touches[0] || e
    this.setState({
      startX: pageX,
      startY: pageY,
      deltaX: 0,
      deltaY: 0
    })

    this.refs.wrapper.addEventListener('touchmove', this.onTouchMove)
    this.refs.wrapper.addEventListener('mousemove', this.onTouchMove)
    this.refs.wrapper.addEventListener('touchend', this.onTouchEnd, true)
    this.refs.wrapper.addEventListener('mouseup', this.onTouchEnd, true)
  }

  onTouchMove (e) {
    if (e.touches && e.touches.length > 1) return

    const { pageX, pageY } = e.touches && e.touches[0] || e
    const deltaX = pageX - this.state.startX
    const deltaY = pageY - this.state.startY
    this.setState({
      deltaX: deltaX,
      deltaY: deltaY
    })

    if (!this.isMovingOnAxis(deltaX, deltaY)) return

    this.moveFramesBy(deltaX, deltaY)
  }

  isMovingOnAxis (deltaX, deltaY) {
    switch (this.props.axis) {
      case 'x':
        return Math.abs(deltaX) > Math.abs(deltaY)
      case 'y':
        return Math.abs(deltaX) < Math.abs(deltaY)
      default:
        return false
    }
  }

  onTouchEnd (e) {
    this.refs.wrapper.removeEventListener('touchmove', this.onTouchMove)
    this.refs.wrapper.removeEventListener('mousemove', this.onTouchMove)
    this.refs.wrapper.removeEventListener('touchend', this.onTouchEnd, true)
    this.refs.wrapper.removeEventListener('mouseup', this.onTouchEnd, true)

    const { deltaX, deltaY } = this.state
    if (this.isMovingOnAxis(deltaX, deltaY)) {
      this.moveFramesTowards(this.decideTargetPosition(deltaX, deltaY))
    }

    this.readyAutoSlide()
  }

  moveFramesBy (deltaX, deltaY) {
    const { prev, current, next } = this.getSiblingFrames()
    toggleAnimation(prev, 0)
    toggleAnimation(current, 0)
    toggleAnimation(next, 0)
    if (this.state.vertical) {
      translate(current, 0, deltaY)
      if (deltaY > 0) {
        translate(prev, 0, deltaY - this.state.frameHeight)
      } else {
        translate(next, 0, deltaY + this.state.frameHeight)
      }
    } else {
      translate(current, deltaX, 0)
      if (deltaX > 0) {
        translate(prev, deltaX - this.state.frameWidth, 0)
      } else {
        translate(next, deltaX + this.state.frameWidth, 0)
      }
    }
  }

  moveFramesTowards (direction) {
    const { prev, current, next } = this.getSiblingFrames()
    toggleAnimation(prev, this.props.duration)
    toggleAnimation(current, this.props.duration)
    toggleAnimation(next, this.props.duration)
    let newCurrentId
    switch (direction) {
      case 'up':
        translate(current, 0, -this.state.frameHeight)
        translate(next, 0, 0)
        newCurrentId = this.getFrameId('next')
        break
      case 'down':
        translate(current, 0, this.state.frameHeight)
        translate(prev, 0, 0)
        newCurrentId = this.getFrameId('prev')
        break
      case 'left':
        translate(current, -this.state.frameWidth, 0)
        translate(next, 0, 0)
        newCurrentId = this.getFrameId('next')
        break
      case 'right':
        translate(current, this.state.frameWidth, 0)
        translate(prev, 0, 0)
        newCurrentId = this.getFrameId('prev')
        break
      default:
        return
    }
    // Update state
    this.setState({current: newCurrentId})
  }

  decideTargetPosition (deltaX, deltaY) {
    if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return 'origin'
    switch (this.props.axis) {
      case 'x':
        return deltaX > 0 ? 'right' : 'left'
      case 'y':
        return deltaY > 0 ? 'down' : 'up'
      default:
        console.error('Decide: on %s axis', this.props.axis, deltaX, deltaY)
    }
  }

  getFrameId (pos) {
    const { total, current } = this.state
    switch (pos) {
      case 'prev':
        return (current - 1 + total) % total
      case 'next':
        return (current + 1) % total
      default:
        return current
    }
  }

  getSiblingFrames () {
    return {
      current: this.refs['f' + this.getFrameId()],
      prev: this.refs['f' + this.getFrameId('prev')],
      next: this.refs['f' + this.getFrameId('next')]
    }
  }

  render () {
    const wrapperStyle = objectAssign(styles.wrapper, this.props.style)
    const Indicator = this.props.indicator
    return (
      <div ref='wrapper' style={wrapperStyle}
        onTouchStart={this.onTouchStart}
        onMouseDown={this.onTouchStart}
        >
        {this.state.frames.map((frame, i) => {
          const frameStyle = objectAssign({zIndex: 99 - i}, styles.frame)
          return <div ref={'f' + i} key={i} style={frameStyle}>{frame}</div>
        })}
        {Indicator && <Indicator index={this.state.current} total={this.state.total} />}
        {this.props.frames && this.props.children}
      </div>
    )
  }
}

Carousel.propTypes = {
  axis: React.PropTypes.oneOf(['x', 'y']),
  auto: React.PropTypes.bool,
  interval: React.PropTypes.number,
  duration: React.PropTypes.number,
  indicator: React.PropTypes.func,
  frames: React.PropTypes.arrayOf(React.PropTypes.element),
  style: React.PropTypes.object
}

Carousel.defaultProps = {
  axis: 'x',
  auto: false,
  interval: 4000,
  duration: 300
}

function translate (el, x, y, withAnimation) {
  el.style.transfrom = `translate(${x}px, ${y}px)`
  el.style.webkitTransform = `translate(${x}px, ${y}px) translateZ(0)`
}

function toggleAnimation (el, duration) {
  duration = duration ? duration + 'ms' : ''
  el.style.transitionDuration = el.style.webkitTransitionDuration = duration
}

function objectAssign (target) {
  var output = Object(target)
  for (var index = 1; index < arguments.length; index++) {
    var source = arguments[index]
    if (source !== undefined && source !== null) {
      for (var nextKey in source) {
        if (source.hasOwnProperty(nextKey)) {
          output[nextKey] = source[nextKey]
        }
      }
    }
  }
  return output
}

const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative'
  },
  frame: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
}

export default Carousel
