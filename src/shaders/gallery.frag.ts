const fragmentShader = `
uniform sampler2D uMap;
uniform float uHover;
uniform float uOpacity;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
    vec2 uv = vUv;
    vec4 tex = texture2D(uMap, uv);
    vec3 color = tex.rgb;

    // -------------------------
    // FILM STRIP (black strip)
    // -------------------------
    float topBottomBar = step(0.90, uv.y) + step(uv.y, 0.10);
    vec3 filmBase = vec3(0.02);
    color = mix(filmBase, color, 1.0 - topBottomBar);

    // -------------------------
    // IMAGE
    // -------------------------
    // darken edges (film border)
    float frameBorder =
        step(0.02, uv.x) * step(uv.x, 0.98);
    color *= frameBorder;

    // -------------------------
    // LIGHTING
    // -------------------------
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDir);
    vec3 L = normalize(vec3(0.6, 0.4, 0.7));

    // lumière directionnelle venant de la droite légèrement devant
    float NdotL = dot(N, L);
    // face éclairée (droite) -> plus lumineuse
    float diffuse = smoothstep(0.0, 1.0, NdotL);
    // face opposée (gauche) -> plus sombre
    float shadow = smoothstep(0.6, -0.6, NdotL);
    // rim light pour détacher les arêtes
    float rim = pow(1.0 - max(dot(N, V), 0.0), 2.5);

    // ---------------------------------------
    // COLOR SHADING
    // ---------------------------------------
    // lumière principale
    color *= mix(1.0, 1.0, diffuse);
    // ombre plus marquée coté gauche/arrière
    color *= mix(0.15, 1.0, shadow);
    // rim light subtile
    color += rim * 0.12;

    // ---------------------------------------
    // HOVER
    // ---------------------------------------
    color = mix(color, color * 1.15, uHover);

    gl_FragColor = vec4(color, tex.a * uOpacity);
}
`;

export default fragmentShader;
