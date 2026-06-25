const fragmentShader = `
uniform sampler2D uMap;

uniform float uHover;
uniform float uOpacity;

varying vec2 vUv;

void main() {

    vec2 uv = vUv;

    uv =
      mix(
        uv,
        vec2(0.5) + (uv - vec2(0.5)) * 0.98,
        uHover
      );

    vec4 tex =
      texture2D(
        uMap,
        uv
      );

    gl_FragColor =
      vec4(
        tex.rgb,
        tex.a * uOpacity
      );
}
`;

export default fragmentShader;
