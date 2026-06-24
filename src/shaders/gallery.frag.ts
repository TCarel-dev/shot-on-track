const fragmentShader = `
uniform sampler2D uMap;

uniform vec3 uCameraPosition;

uniform float uHover;
uniform float uTime;

varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

float random(vec2 st)
{
    return fract(
        sin(
            dot(
                st.xy,
                vec2(
                    12.9898,
                    78.233
                )
            )
        )
        *
        43758.5453123
    );
}

void main() {

    vec2 uv = vUv;

    uv.y +=
        sin(
            uv.x * 10.0 +
            uTime * 3.0
        )
        *
        uHover
        *
        0.02;

    vec2 shift =
        (uv - 0.5)
        *
        uHover
        *
        0.02;

    float r =
        texture2D(
            uMap,
            uv + shift
        ).r;

    float g =
        texture2D(
            uMap,
            uv
        ).g;

    float b =
        texture2D(
            uMap,
            uv - shift
        ).b;

    vec3 tex =
        vec3(r,g,b);

    vec3 viewDir =
        normalize(
            uCameraPosition -
            vWorldPosition
        );

    float facing =
        max(
            dot(
                -normalize(vWorldNormal),
                viewDir
            ),
            0.0
        );

    float falloff =
        smoothstep(
            -0.2,
            0.5,
            facing
        );

    float fresnel =
        pow(
            1.0 - facing,
            2.0
        );

    vec3 color =
        tex *
        (
            0.6 +
            falloff * 0.5
        );

    color +=
        fresnel * 0.15;

    color +=
        uHover * 0.12;

    color +=
        (
            random(
                gl_FragCoord.xy
            )
            -
            0.5
        )
        *
        0.015;

    float vignette =
        smoothstep(
            1.2,
            0.2,
            distance(
                uv,
                vec2(0.5)
            )
        );

    color *= vignette;

    gl_FragColor =
        vec4(
            color,
            1.0
        );
}
`;

export default fragmentShader;
