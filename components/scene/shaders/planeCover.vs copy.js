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
varying vec2 vUv;
void main() {

  vec3 transformed = vec3(position);
  float dx = position.x ;
  float dy = position.y ;
  float dist = sqrt(dx*dx + dy*dy);
  float amplitude = uTransition * 5.;// * uRippleEffect;
  float angle =  8. + dist /3. ;

  float addToCoef = 0.;
  transformed.z += sin(-angle /2.+uTransition) * amplitude;




    vUv = uv;
    vPos = transformed;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`
