export default `
precision highp float;
precision highp int;
varying vec3 vNormal;
uniform float uAlpha;
uniform sampler2D uMap;
uniform vec2 uResolution;
varying vec2 vUv;
void main() {
  float screenRatio =   uResolution.x / uResolution.y;
  float coverRatio = 454. / 562.;
  vec2 uvImg = vUv;
  if (screenRatio > coverRatio) {
    uvImg.y -= 0.5;
    uvImg.y /= screenRatio * ( 1. / coverRatio );
    uvImg.y += 0.5;
  } else {
    uvImg.x -= 0.5;
    uvImg.x *= screenRatio * ( 1. / coverRatio );
    uvImg.x += 0.5;
  }
  vec4 imgTex = texture2D(uMap,  vUv  ); // to debug img ratio

  gl_FragColor.rgb = imgTex.rgb;
  gl_FragColor.a = uAlpha*imgTex.a;

}
`
