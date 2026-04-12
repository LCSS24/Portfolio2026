import React, { useEffect, useRef, useState } from "react";
import "./BlobButton.scss";

const BlobShaderButton = ({ isActive, isGlow = false }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

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
      uniform float speed;

      float smin(float a, float b, float k){
        float h = max(k - abs(a-b), 0.0) / k;
        return min(a,b) - h*h*h*k*(1.0/6.0);
      }

      vec3 hsl2rgb(vec3 c){
        vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0,4,2),6.0)-3.0)-1.0,0.0,1.0);
        return c.z+c.y*(rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
      }

      float blobD(vec2 uv, float t, float ax, float fx, float px, float ay, float fy, float py, float r) {
        vec2 center = vec2(ax * sin(t * fx + px), ay * cos(t * fy + py));
        return length(uv - center) - r;
      }

      void main(){
        vec2 uv = (gl_FragCoord.xy / R) * 2.0 - 1.0;
        uv.x *= R.x / R.y;
        float t = T * 0.0012 * speed;
        float k = 0.5; 
        float d = blobD(uv, t, 0.8, 0.7, 0.0, 0.6, 1.4, 1.5, 0.6);
        d = smin(d, blobD(uv, t, 0.7, 1.3, 2.5, 0.5, 1.0, 0.8, 0.55), k);
        d = smin(d, blobD(uv, t, 0.9, 0.6, 4.0, 0.7, 0.5, 3.2, 0.6), k);
        float sel = sin(uv.x * 1.2 + t) * 0.5 + 0.5;
        float hue = mix(0.75, 0.90, sel);
        vec3 blobCol = hsl2rgb(vec3(mod(hue, 1.0), ${isGlow ? "0.8" : "0.7"}, 0.65));
        vec3 constantBg = hsl2rgb(vec3(mod(hue - 0.05, 1.0), ${isGlow ? "0.7" : "0.6"}, 0.5));
        float alpha = smoothstep(0.2, -0.2, d);
        vec3 finalCol = mix(constantBg, blobCol, alpha);
        gl_FragColor = vec4(finalCol, 1.0);
      }
    `;

    const createShader = (gl, type, source) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
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
    const sLoc = gl.getUniformLocation(program, "speed");

    let animationId;
    const startTime = performance.now();

    const render = (now) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 1.5;
      canvas.height = rect.height * 1.5;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(rLoc, canvas.width, canvas.height);
      gl.uniform1f(tLoc, now - startTime);
      gl.uniform1f(sLoc, isActive ? 2.5 : 1.0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animationId);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, [isActive, isGlow]);

  return <canvas ref={canvasRef} className="blob-canvas" />;
};

const BlobButton = ({ label, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`blob-button-container ${isHovered ? "is-hovered" : ""}`}>
      <div className="blob-glow">
        <BlobShaderButton isActive={isHovered} isGlow={true} />
      </div>

      <button
        className="blob-button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <div className="blob-border">
          <div className="blob-shader-wrapper">
            <BlobShaderButton isActive={isHovered} />
          </div>
        </div>
        <span className="blob-label">{label}</span>
      </button>
    </div>
  );
};

export default BlobButton;
