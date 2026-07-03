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

    // -------------------------
    // FILM BASE (black strip)
    // -------------------------
    float topBottomBar = step(0.93, uv.y) + step(uv.y, 0.07);
    vec3 filmBase = vec3(0.02);

    // -------------------------
    // IMAGE
    // -------------------------
    vec3 color = tex.rgb;

    // darken edges (film border)
    float frameBorder =
        step(0.02, uv.x) * step(uv.x, 0.98);

    color *= frameBorder;

    // -------------------------
    // FILM STRIP
    // -------------------------
    color = mix(filmBase, color, 1.0 - topBottomBar);
    // color = mix(color, perforationColor, holes);

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
    // 3. COLOR SHADING
    // ---------------------------------------
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
