export default  /* glsl */  `
uniform float u_time;

varying vec3 v_normal;
varying vec2 v_uv;
varying float v_displacement;

void main() {
    gl_FragColor = vec4(vec3(v_displacement), 1.0);
}
`
