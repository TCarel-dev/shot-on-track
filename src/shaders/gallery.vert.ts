const vertexShader = `
uniform float uTime;
uniform float uVelocity;
uniform float uHover;
uniform float uIntro;

varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main() {

    vUv = uv;

    vec3 pos = position;

    float intro =
        smoothstep(
            0.0,
            1.0,
            uIntro
        );

    pos.z *= intro;

    vec4 worldPosition =
        modelMatrix *
        vec4(pos, 1.0);

    vWorldPosition =
        worldPosition.xyz;

    vWorldNormal =
        normalize(
            mat3(modelMatrix)
            *
            normal
        );

    gl_Position =
        projectionMatrix *
        viewMatrix *
        worldPosition;
}
`;

export default vertexShader;
