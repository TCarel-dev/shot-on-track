const fragmentShader = `
uniform sampler2D uMap;
uniform float uHover;

varying vec2 vUv;

void main() {

    vec2 uv = vUv;

    uv =
      mix(
        uv,
        vec2(0.5) + (uv - vec2(0.5)) * 0.95,
        uHover
      );

    vec4 tex =
      texture2D(
        uMap,
        uv
      );

    gl_FragColor =
      tex;
}
`;

export default fragmentShader;
