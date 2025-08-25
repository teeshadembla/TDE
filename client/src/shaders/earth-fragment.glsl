
uniform sampler2D dayMap;
uniform sampler2D nightMap;
uniform vec3 lightDirection;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
    vec3 normal = normalize(vNormal);
    float lightIntensity = dot(normal, lightDirection);
    lightIntensity = clamp(lightIntensity, 0.0, 1.0);

    vec4 dayColor = texture2D(dayMap, vUv);
    vec4 nightColor = texture2D(nightMap, vUv);

    gl_FragColor = mix(nightColor, dayColor, lightIntensity);
}
