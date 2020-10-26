export default (el) => {
  const SplitText = require('gsap/SplitText').SplitText
  new SplitText(el, {
    type: 'lines',
    //type: 'words, chars, lines',
    //charsClass: 'letter',
    //wordsClass: 'word',
    linesClass: 'line'
  })
  const lines = [].slice.call(el.querySelectorAll('.line'))

  lines.forEach((el) => {
    el.innerHTML = '<div class="inner">' + el.innerHTML + '</div>'
  })
}
