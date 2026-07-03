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

// -----------------------------------------------------------------------------
// CONSTANTS
// -----------------------------------------------------------------------------

const vec2 CONTENT_MIN = vec2(0.02, 0.10);
const vec2 CONTENT_SIZE = vec2(0.96, 0.80);

const float TOP_BAR = 0.90;
const float BOTTOM_BAR = 0.10;

// -----------------------------------------------------------------------------
// IMAGE COVER UV
// Same behaviour as CSS object-fit: cover
// -----------------------------------------------------------------------------

vec2 getCoverUv(vec2 uv)
{
    vec2 contentUv = (uv - CONTENT_MIN) / CONTENT_SIZE;
    contentUv = clamp(contentUv, vec2(0.0), vec2(1.0));

    float regionAspect = CONTENT_SIZE.x / CONTENT_SIZE.y;
    float textureAspect = max(uTextureAspect, 0.0001);

    vec2 scale = vec2(1.0);
    vec2 offset = vec2(0.0);

    if(textureAspect > regionAspect) {
        scale.x = regionAspect / textureAspect;
        offset.x = (1.0 - scale.x) * .5;
    } else {
        scale.y = textureAspect / regionAspect;
        offset.y = (1.0 - scale.y) * .5;
    }

    return contentUv * scale + offset;
}

// -----------------------------------------------------------------------------
// FILM STRIP
// Returns 1 when we're inside the black bands.
// -----------------------------------------------------------------------------

float getFilmBarMask(vec2 uv)
{
    float bottom = 1.0 - step(BOTTOM_BAR, uv.y);
    float top = step(TOP_BAR, uv.y);

    return max(bottom, top);
}

// -----------------------------------------------------------------------------
// FRAME BORDER
// Removes a few pixels on left / right to separate frames.
// -----------------------------------------------------------------------------

float getFrameBorderMask(vec2 uv)
{
    return step(0.02, uv.x) * (1.0 - step(0.98, uv.x));
}

// -----------------------------------------------------------------------------
// FILM TEXT
// Printed text on black bands.
// -----------------------------------------------------------------------------

vec3 applyFilmText(vec3 color, vec2 uv, float barMask)
{
    if(uShowText < .5)
        return color;

    vec4 text = texture2D(uTextMap, uv);

    return mix(color, text.rgb, text.a * barMask);
}

// -----------------------------------------------------------------------------
// PERFORATIONS
// Real holes (discard fragments)
// -----------------------------------------------------------------------------

void applyFilmHoles(vec2 uv, float barMask)
{
    if(uHoles < .5)
        return;

    if(barMask < .5)
        return;

    float radius = 0.02;
    float spacing = 0.10;

    float bottom = 1.0 - step(BOTTOM_BAR, uv.y);

    float centerY = bottom > .5
        ? 0.05
        : 0.95;

    float localX =
        mod(
            uv.x + spacing * .5,
            spacing
        ) - spacing * .5;

    float d =
        length(
            vec2(
                localX,
                uv.y - centerY
            )
        );

    if(d < radius)
        discard;
}

// -----------------------------------------------------------------------------
// LIGHTING
// Keeps the gallery readable while giving volume.
// -----------------------------------------------------------------------------

vec3 applyLighting(vec3 color)
{
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDir);
    vec3 L = normalize(vec3(.6,.4,.7));

    float NdotL = dot(N,L);

    float diffuse = smoothstep(0.0,1.0,NdotL);

    float shadow = smoothstep(0.6,-0.6,NdotL);

    float rim = pow(1.0-max(dot(N,V),0.0), 2.5);

    color *= mix(1.0,1.0,diffuse);
    color *= mix(.15,1.0,shadow);

    color += rim*.12;

    return color;
}

// -----------------------------------------------------------------------------
// HOVER EFFECT
// -----------------------------------------------------------------------------

vec3 applyHover(vec3 color)
{
    return mix(
        color,
        color * 1.15,
        uHover
    );
}

// -----------------------------------------------------------------------------
// MAIN
// -----------------------------------------------------------------------------

void main()
{
    vec2 uv = vUv;

    // -------------------------------------------------
    // Sample image using object-fit cover
    // -------------------------------------------------

    vec2 imageUv = getCoverUv(uv);
    vec4 tex = texture2D(uMap, imageUv);
    vec3 color = tex.rgb;

    // -------------------------------------------------
    // Film strip
    // -------------------------------------------------

    vec3 filmColor = vec3(.02);
    float barMask = getFilmBarMask(uv);
    color = mix(filmColor, color, 1.0-barMask);

    // -------------------------------------------------
    // Frame separation
    // -------------------------------------------------

    color *= getFrameBorderMask(uv);

    // -------------------------------------------------
    // Printed text
    // -------------------------------------------------

    color = applyFilmText(color, uv, barMask);

    // -------------------------------------------------
    // Perforations
    // -------------------------------------------------

    applyFilmHoles(uv, barMask);

    // -------------------------------------------------
    // Lighting
    // -------------------------------------------------

    color = applyLighting(color);

    // -------------------------------------------------
    // Hover
    // -------------------------------------------------

    color = applyHover(color);

    gl_FragColor = vec4(color, tex.a * uOpacity);
}
`;

export default fragmentShader;
