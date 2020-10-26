var linear = function(t) {
  return t
}
var easeInQuad = function(t) {
  return t * t
}
var easeOutQuad = function(t) {
  return t * (2 - t)
}
var easeInOutQuad = function(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}
var easeInCubic = function(t) {
  return t * t * t
}
var easeOutCubic = function(t) {
  return --t * t * t + 1
}
var easeInOutCubic = function(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
}
var easeInQuart = function(t) {
  return t * t * t * t
}
var easeOutQuart = function(t) {
  return 1 - --t * t * t * t
}
var easeInOutQuart = function(t) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t
}
var easeInQuint = function(t) {
  return t * t * t * t * t
}
var easeOutQuint = function(t) {
  return 1 + --t * t * t * t * t
}
var easeInOutQuint = function(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
}

export {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint
}
