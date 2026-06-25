const fragmentShader = `
uniform sampler2D uMap;

uniform float uHover;
uniform float uOpacity;

uniform float uImageAspect;
uniform float uPlaneAspect;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
    // ---------------------------------------
    // 1. IMAGE RATIO
    // ---------------------------------------
    vec2 uv = vUv - 0.5;
    float imageAspect = uImageAspect;
    float planeAspect = uPlaneAspect;
    vec2 scale = vec2(1.0);

    if (imageAspect > planeAspect) {
        scale.x = imageAspect / planeAspect;
    } else {
        scale.y = planeAspect / imageAspect;
    }

    uv *= scale;
    uv += 0.5;
    vec4 tex = texture2D(uMap, uv);

    // ---------------------------------------
    // 2. LIGHTING
    // ---------------------------------------
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDir);

    // lumière directionnelle venant de la droite légèrement devant
    vec3 L = normalize(vec3(0.6, 0.4, 0.7));
    float NdotL = dot(N, L);

    // face éclairée (droite) -> plus lumineuse
    float diffuse = smoothstep(0.0, 1.0, NdotL);
    // face opposée (gauche) -> plus sombre
    float shadow = smoothstep(0.6, -0.6, NdotL);
    // rim light pour détacher les arêtes
    float rim = pow(1.0 - max(dot(N, V), 0.0), 2.5);

    // ---------------------------------------
    // 3. COLOR SHADING
    // ---------------------------------------
    vec3 color = tex.rgb;
    // lumière principale
    color *= mix(1.0, 1.0, diffuse);
    // ombre plus marquée coté gauche/arrière
    color *= mix(0.15, 1.0, shadow);
    // rim light subtile
    color += rim * 0.12;

    // ---------------------------------------
    // 4. HOVER
    // ---------------------------------------
    color = mix(color, color * 1.15, uHover);
    gl_FragColor = vec4(color, tex.a * uOpacity);
}
`;

export default fragmentShader;
