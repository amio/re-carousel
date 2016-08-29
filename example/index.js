import { React, Component } from 'react'
import { render } from 'react-dom'

window.requireCommonjs(['carousel.js', 'indicator-dots.js'], function (Carousel, Dots) {
  // Main App
  class App extends Component {
    constructor () {
      super()
      this.state = {
        axis: 'x'
      }
      this.setAxis = axis => {
        return () => {
          this.setState({'axis': axis})
        }
      }
    }
    render () {
      return (
        <div style={{height: '100%'}}>
          <div style={styles.header}>
            <span className={this.state.axis === 'x' ? 'axis current' : 'axis'}
              onClick={this.setAxis('x')}>horizontal</span>
            <span className={this.state.axis === 'y' ? 'axis current' : 'axis'}
              onClick={this.setAxis('y')}>vertical</span>
          </div>
          <Carousel auto indicator={Dots} axis={this.state.axis}>
            <p style={{backgroundColor: 'royalblue', height: '100%'}}>FRAME 1</p>
            <p style={{backgroundColor: 'orange', height: '100%'}}>FRAME 2</p>
            <p style={{backgroundColor: 'orchid', height: '100%'}}>FRAME 3</p>
          </Carousel>
        </div>
      )
    }
  }

  const styles = {
    header: {
      zIndex: 100,
      position: 'absolute',
      width: '100%',
      height: '80px',
      lineHeight: '80px',
      color: '#DDD',
      textAlign: 'center'
    }
  }

  render(<App />, document.getElementById('app'))
})
