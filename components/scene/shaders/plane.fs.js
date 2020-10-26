export default `
precision highp float;
precision highp int;

varying vec3 vNormal;
uniform float uTime;
uniform sampler2D uMap;
uniform sampler2D uMapNext;
uniform sampler2D uMask;
uniform vec2 uResolution;
uniform float uMaskScale;
uniform float uImgScale;
uniform float uGlobalAlpha;
uniform float uTransition;
uniform float uIndexTransition;
uniform float uRippleEffect;
varying float vCoef;
varying vec2 vUv;
varying vec3 vPos;
#define PI 3.1415926538



void main() {
  float screenRatio =   uResolution.x / uResolution.y;
  float coverRatio = 3500. / 2156.;
  float maskRatio = 1.;
  vec2 uvMask = vUv;
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
  if (screenRatio > maskRatio) {
    uvMask.y -= 0.5;
    uvMask.y /= screenRatio * ( 1. / maskRatio );
    uvMask.y += 0.5;
  } else {
    uvMask.x -= 0.5;
    uvMask.x *= screenRatio * ( 1. / maskRatio );
    uvMask.x += 0.5;
  }
  float scaleMask = 3. - min(2.7, uMaskScale * 2.7 );
  float scale = 2. - min(1., uImgScale );
  vec3 maskTex = texture2D(uMask, uvMask * scaleMask - vec2(.5, .5) * (scaleMask - 1.) ).rgb;

  vec3 imgTex = texture2D(uMap,  uvImg * scale - vec2(.5, .5) * (scale - 1.)).rgb;


  vec3 light = normalize(vec3(0.5, 1.0, -0.3));
  float shading = dot(normalize(vPos), light) * 0.5;





  float t = uTime*.3;

  vec2 uv = (gl_FragCoord.xy - .5 * uResolution.xy) / uResolution.y;
  float a = t * .5;
  float s = sin(a);
  float c = cos(a);
  uv *= mat2(c,s,-s,c);
  uv += .1*sin(uv.yx*6.+t);

  uv = abs(uv);
  uv*=mat2(c,s,-s,c);

  vec3 colors = 0.5 + 0.5*cos(t*1.4+uv.xyx*5.+vec3(0,2,4)) + .3*sin(uv.xxx*(1.1+.2*sin(t*.9))*20.+t*.4)+.3;



  vec3 finalColor = vec3(0.);

  if(uIndexTransition == 0. ){
    finalColor = imgTex;
  }else if(uIndexTransition == 1. ){
    finalColor = colors ;
  }else{
    finalColor = mix( imgTex, colors,(1.-vCoef)*uIndexTransition) + vPos.z / 20.;
  }

  if(uTransition>0.){
    vec3 imgNextTex = texture2D(uMapNext,  uvImg * scale - vec2(.5, .5) * (scale - 1.)).rgb;
    finalColor = mix(imgTex,imgNextTex, (1. - vCoef) * uTransition) + vPos.z/20.;
  }
  if(uRippleEffect>0.){
    finalColor = imgTex + shading * uRippleEffect * .5;
  }


  gl_FragColor.rgb = finalColor;
  gl_FragColor.a = maskTex.r;

}
`
