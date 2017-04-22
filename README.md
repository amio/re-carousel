# re-carousel [![npm](https://img.shields.io/npm/v/re-carousel.svg?style=flat-square)](https://www.npmjs.com/package/re-carousel)

[![Greenkeeper badge](https://badges.greenkeeper.io/amio/re-carousel.svg)](https://greenkeeper.io/)

React carousel component, simplified. 2KB gzipped, zero dependency.

demo: https://amio.github.io/re-carousel/

### Usage

`import Carousel from 're-carousel'`

then:

```html
<Carousel auto>
  <div style={{backgroundColor: 'tomato', height: '100%'}}>Frame 1</div>
  <div style={{backgroundColor: 'orange', height: '100%'}}>Frame 2</div>
  <div style={{backgroundColor: 'orchid', height: '100%'}}>Frame 3</div>
</Carousel>
```

### Attributes

All attributes are optional.

- `axis` {enum} `'x'` or `'y'` (`'x'` by default)
- `auto` {boolean} `true` or `false` (`false` by default) toggle auto sliding.
- `interval` {number} (`4000`ms by default) interval for auto sliding.
- `duration` {number} (`300`ms by default) duration for animation.
- `indicator` {ReactClass} Indicator could be various, so it's not builtin.
  You may create your own indicator according to this
  [dots indicator](src/indicator-dots.js), or just send it in:

  ```javascript
  import Carousel from 're-carousel'
  import IndicatorDots from 're-carousel/indicator-dots'

  export default function carousel () {
    return <Carousel auto indicator={IndicatorDots}>
      <div style={{backgroundColor: 'tomato', height: '100%'}}>Frame 1</div>
      <div style={{backgroundColor: 'orange', height: '100%'}}>Frame 2</div>
      <div style={{backgroundColor: 'orchid', height: '100%'}}>Frame 3</div>
    </Carousel>
  }
  ```
- `frames` {Array of ReactElement} If you want to create frames programmatically,
  use this attribute:

  ```javascript
  import Carousel from 're-carousel'

  export default function carousel (props) {
    const frames = props.frameArray.map((frame, i) => {
      return <div>Frame {i}</div>
    })
    return <Carousel auto frames={frames}>
      <span>These children element will be appended to Carousel,</span>
      <span>as normal element other than "frame".</span>
    </Carousel>
  }
  ```

### Contributes

For testing locally:

```bash
npm run example:watch # compile codes lively
serve gh-pages # example page are compiled in gh-pages/ folder
```
