precision mediump float;

varying vec2 vUv;
varying float vWave;

uniform float uTime;
uniform float uAmplitude;
uniform float uProgDirection;
uniform float uMouseOverAmp;
uniform float uRadius;

uniform vec2 uMeshSize;
uniform vec2 uMousePos;

uniform bool uAnimating;
uniform bool uTranslating;

float mapVal(in float n,in float start1,in float stop1,in float start2,in float stop2){
    return((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}

void main(){
    vec3 pos=position;
    vUv=uv;
    
    vec2 center=vUv-uMousePos;
    center.x*=uMeshSize.x/uMeshSize.y;
    float dist=length(center);
    
    float radius=uRadius;
    
    float mask=smoothstep(radius,radius*5.,dist);
    float d=mapVal(mask,-1.,1.,-1.,0.);
    
    if(uAnimating){
        pos.z=sin(pos.x*5.+uTime*10.*uProgDirection)*uAmplitude;
        pos.z*=2.5;
    }else{
        pos.z=d*uMouseOverAmp;
        pos.z*=15.;
    }
    
    if(uTranslating){
        pos.z=sin(pos.y*6.+uTime*10.)*uAmplitude;
        pos.z*=3.5;
    }
    
    vWave=pos.z;
    
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
}