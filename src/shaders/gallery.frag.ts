const fragmentShader = `
uniform sampler2D uMap;
uniform sampler2D uTextMap;
uniform float uTextureAspect;
uniform float uHover;
uniform float uOpacity;
uniform float uShowText;
uniform float uHoles;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
    vec2 uv = vUv;
    vec2 filmUv = uv;

    vec2 contentMin = vec2(0.02, 0.10);
    vec2 contentSize = vec2(0.96, 0.80);
    vec2 contentUv = (uv - contentMin) / contentSize;
    contentUv = clamp(contentUv, vec2(0.0), vec2(1.0));

    float regionAspect = contentSize.x / contentSize.y;
    float textureAspect = max(uTextureAspect, 0.0001);

    vec2 scale = vec2(1.0);
    vec2 offset = vec2(0.0);
    if (textureAspect > regionAspect) {
        scale.x = regionAspect / textureAspect;
        offset.x = 0.5 - scale.x * 0.5;
    } else {
        scale.y = textureAspect / regionAspect;
        offset.y = 0.5 - scale.y * 0.5;
    }

    vec2 coverUv = contentUv * scale + offset;
    vec4 tex = texture2D(uMap, coverUv);
    vec3 color = tex.rgb;

    float bottomBar = 1.0 - step(0.10, uv.y);
    float topBar = step(0.90, uv.y);
    float barMask = max(bottomBar, topBar);

    vec3 filmBase = vec3(0.02);
    color = mix(filmBase, color, 1.0 - barMask);

    float frameBorder = step(0.02, uv.x) * step(0.98, uv.x);
    color *= frameBorder;

    if (uShowText > 0.5 && barMask > 0.5) {
        vec4 text = texture2D(uTextMap, filmUv);
        color = mix(color, text.rgb, text.a * barMask);
    }

    if (uHoles > 0.5 && barMask > 0.5) {
        float holeRadius = 0.02;
        float holeSpacing = 0.10;
        float holeCenterY = bottomBar > 0.5 ? 0.05 : 0.95;
        float localU = mod(uv.x + holeSpacing * 0.5, holeSpacing) - holeSpacing * 0.5;
        float holeDistance = length(vec2(localU, uv.y - holeCenterY));

        if (holeDistance < holeRadius) {
            discard;
        }
    }

    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDir);
    vec3 L = normalize(vec3(0.6, 0.4, 0.7));

    float NdotL = dot(N, L);
    float diffuse = smoothstep(0.0, 1.0, NdotL);
    float shadow = smoothstep(0.6, -0.6, NdotL);
    float rim = pow(1.0 - max(dot(N, V), 0.0), 2.5);

    color *= mix(1.0, 1.0, diffuse);
    color *= mix(0.15, 1.0, shadow);
    color += rim * 0.12;

    color = mix(color, color * 1.15, uHover);

    gl_FragColor = vec4(color, tex.a * uOpacity);
}
`;

export default fragmentShader;
