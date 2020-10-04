precision mediump float;

varying vec2 vUv;
varying float vWave;

uniform float uTime;
uniform float uProg;
uniform float uProgDirection;

uniform sampler2D uCurrTex;
uniform sampler2D uNextTex;

uniform vec2 uMeshSize;
uniform vec2 uImageSize;

vec2 backgroundCoverUv(vec2 uv,vec2 canvasSize,vec2 textureSize){
    vec2 ratio=vec2(
        min((canvasSize.x/canvasSize.y)/(textureSize.x/textureSize.y),1.),
        min((canvasSize.y/canvasSize.x)/(textureSize.y/textureSize.x),1.)
    );
    
    vec2 uvWithRatio=uv*ratio;
    
    return vec2(
        uvWithRatio.x+(1.-ratio.x)*.5,
        uvWithRatio.y+(1.-ratio.y)*.5
    );
}

void main(){
    vec2 texUv=backgroundCoverUv(vUv,uMeshSize,uImageSize);
    
    float x=uProg;
    float y;
    if(uProgDirection==1.)y=(x*2.+(vUv.x-1.));
    else y=((x*2.)-vUv.x);
    x=smoothstep(0.,1.,y);
    
    float w=vWave;
    
    float r1=texture2D(uCurrTex,texUv+w*.04).r;
    float g1=texture2D(uCurrTex,texUv+w*.01).g;
    float b1=texture2D(uCurrTex,texUv+w*-.03).b;
    vec3 tex1=vec3(r1,g1,b1);
    
    float r2=texture2D(uNextTex,texUv+w*.04).r;
    float g2=texture2D(uNextTex,texUv+w*.01).g;
    float b2=texture2D(uNextTex,texUv+w*-.03).b;
    vec3 tex2=vec3(r2,g2,b2);
    
    float scaleUp=(.4+.6*(1.-uProg));
    float scaleDown=(.6+.4*uProg);
    
    vec4 f1=mix(
        texture2D(uCurrTex,texUv*(1.-x)*scaleUp+vec2(.15)*uProg),
        texture2D(uNextTex,texUv*x*scaleDown),
    x);
    
    vec3 f2=mix(tex1,tex2,x);
    
    vec4 final=mix(f1,vec4(f2,1.),.12);
    
    gl_FragColor=final;
    // gl_FragColor=vec4(vec3(vWave),1.);
}