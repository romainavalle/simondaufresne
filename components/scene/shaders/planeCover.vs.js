export default `
precision highp float;
precision highp int;
attribute vec2 uv;
attribute vec3 position;
varying vec3 vPos;
attribute vec3 normal;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTransition;
uniform float uTime;
varying vec2 vUv;
void main() {
  vec3 transformed = vec3(position);
  float freq = .2;
  float amp = 1. + uTransition * 10.;
  float angle = (uTime *10.+ uv.x*20.- uv.y*10.)*freq;
  transformed.z += sin(angle)*amp;


    vUv = uv;
    vPos = transformed;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`
