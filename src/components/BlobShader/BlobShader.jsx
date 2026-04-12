import { useEffect, useRef } from "react";
import "./BlobShader.scss"; // Importation du fichier SCSS

/**
 * Composant BlobShader
 * Gère le rendu d'un arrière-plan organique animé via WebGL.
 */
const BlobShader = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // --- Sources des Shaders ---
    const vertSource = `
      attribute vec2 p;
      void main() {
        gl_Position = vec4(p, 0.0, 1.0);
      }
    `;

    const fragSource = `
      precision highp float;
      uniform vec2 R;
      uniform float T;

      float smin(float a, float b, float k){
        float h = max(k - abs(a-b), 0.0) / k;
        return min(a,b) - h*h*h*k*(1.0/6.0);
      }

      vec3 hsl2rgb(vec3 c){
        vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0,4,2),6.0)-3.0)-1.0,0.0,1.0);
        return c.z+c.y*(rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
      }

      float blobD(vec2 uv, float t,
                  float ax, float fx, float px,
                  float bx, float gx, float qx,
                  float ay, float fy, float py,
                  float by, float gy, float qy,
                  float lifeFreq, float lifePhase,
                  float r) {
        float x = ax * sin(t * fx + px) + bx * sin(t * gx + qx);
        float y = ay * sin(t * fy + py) + by * cos(t * gy + qy);
        vec2 center = vec2(x, y);
        float pulse = 0.88 + 0.12 * sin(t * lifeFreq + lifePhase);
        return length(uv - center) - (r * pulse);
      }

      void main(){
        vec2 uv = (gl_FragCoord.xy / R) * 2.0 - 1.0;
        uv.x *= R.x / R.y;
        
        float t = T * 0.00028;
        float k = 0.11;
        float d;
        
        // Calcul des métaballes (Blobs)
        d =      blobD(uv,t,  0.75,0.31,0.00,  0.35,0.17,1.30,  0.55,0.23,0.50,  0.40,0.19,2.10,  0.28,0.00, 0.40);
        d=smin(d,blobD(uv,t,  0.80,0.27,1.20,  0.30,0.41,3.10,  0.70,0.19,2.30,  0.35,0.37,0.80,  0.22,1.10, 0.38),k);
        d=smin(d,blobD(uv,t,  0.65,0.37,2.50,  0.40,0.13,0.70,  0.75,0.29,1.10,  0.30,0.43,3.50,  0.33,2.20, 0.42),k);
        d=smin(d,blobD(uv,t,  0.90,0.21,0.80,  0.25,0.53,2.40,  0.50,0.41,3.80,  0.45,0.17,1.60,  0.19,3.30, 0.36),k);
        d=smin(d,blobD(uv,t,  0.70,0.43,3.20,  0.42,0.23,1.50,  0.80,0.17,0.30,  0.28,0.51,4.20,  0.41,0.70, 0.39),k);
        d=smin(d,blobD(uv,t,  0.85,0.19,1.90,  0.32,0.37,4.00,  0.60,0.33,2.70,  0.38,0.29,0.40,  0.25,1.80, 0.35),k);
        d=smin(d,blobD(uv,t,  0.60,0.53,0.40,  0.48,0.11,2.80,  0.68,0.43,1.50,  0.32,0.61,3.10,  0.37,2.90, 0.45),k);
        d=smin(d,blobD(uv,t,  0.78,0.29,2.10,  0.38,0.47,0.90,  0.55,0.37,3.20,  0.42,0.23,1.90,  0.21,4.00, 0.34),k);
        d=smin(d,blobD(uv,t,  0.92,0.23,3.70,  0.28,0.31,1.20,  0.72,0.27,0.60,  0.36,0.47,2.80,  0.30,0.50, 0.43),k);
        d=smin(d,blobD(uv,t,  0.68,0.41,1.00,  0.44,0.19,3.40,  0.62,0.51,2.10,  0.30,0.33,0.20,  0.43,1.40, 0.32),k);
        d=smin(d,blobD(uv,t,  0.55,0.47,4.20,  0.40,0.29,0.50,  0.65,0.53,2.80,  0.35,0.11,1.10,  0.25,0.80, 0.37),k);
        d=smin(d,blobD(uv,t,  0.88,0.13,1.50,  0.22,0.61,2.10,  0.45,0.37,0.90,  0.50,0.43,3.50,  0.33,2.00, 0.35),k);
        d=smin(d,blobD(uv,t,  0.72,0.33,0.80,  0.45,0.19,4.40,  0.82,0.21,3.10,  0.22,0.57,0.40,  0.20,3.10, 0.31),k);
        d=smin(d,blobD(uv,t,  0.64,0.57,2.20,  0.33,0.37,1.80,  0.58,0.47,1.20,  0.44,0.27,2.60,  0.27,1.50, 0.33),k);

        // --- Logique de coloration ---
        float sel = sin(uv.x * 1.8 + t * 2.1) * 0.5 + 0.5;
        sel += cos(uv.y * 2.2 + t * 1.7) * 0.3;
        sel = mod(sel, 1.0);

        int idx = int(sel * 4.0);
        int idx2 = int(mod(float(idx) + 1.0, 4.0));
        float blend = fract(sel * 4.0);
        float smoothBlend = blend * blend * (3.0 - 2.0 * blend);

        float h1 = idx == 0 ? 0.78 : idx == 1 ? 0.88 : idx == 2 ? 0.60 : 0.75;
        float h2 = idx2 == 0 ? 0.78 : idx2 == 1 ? 0.88 : idx2 == 2 ? 0.60 : 0.75;
        float s1 = idx == 0 ? 0.50 : idx == 1 ? 0.45 : idx == 2 ? 0.35 : 0.15;
        float s2 = idx2 == 0 ? 0.50 : idx2 == 1 ? 0.45 : idx2 == 2 ? 0.35 : 0.15;

        float hue = mix(h1, h2, smoothBlend);
        float sat = mix(s1, s2, smoothBlend);
        hue += 0.04 * sin(t * 1.5 + uv.x);
        float lit = 0.80 + 0.10 * sin(uv.x*3.0 + uv.y*2.0 + t*2.8);

        float rim = smoothstep(0.12, 0.0, abs(d));
        hue += rim * 0.02;
        lit += rim * 0.12;
        sat += rim * 0.20;

        vec3 col = hsl2rgb(vec3(mod(hue,1.0), clamp(sat,0.3,0.9), clamp(lit,0.55,0.95)));
        vec3 bg = vec3(0.941, 0.929, 0.910);
        float alpha = smoothstep(0.015, -0.015, d);
        
        gl_FragColor = vec4(mix(bg, col, alpha), 1.0);
      }
    `;

    // --- Compilation et Initialisation WebGL ---
    const createShader = (gl, type, source) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertSource));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const pLoc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(pLoc);
    gl.vertexAttribPointer(pLoc, 2, gl.FLOAT, false, 0, 0);

    const rLoc = gl.getUniformLocation(program, "R");
    const tLoc = gl.getUniformLocation(program, "T");

    let animationId;
    const startTime = performance.now();

    const render = (now) => {
      const displayWidth = canvas.clientWidth * window.devicePixelRatio;
      const displayHeight = canvas.clientHeight * window.devicePixelRatio;

      // Mise à jour de la taille du buffer si nécessaire
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      gl.uniform2f(rLoc, canvas.width, canvas.height);
      gl.uniform1f(tLoc, now - startTime);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    // Nettoyage à la destruction du composant
    return () => {
      cancelAnimationFrame(animationId);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <div className="blob-canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default BlobShader;
