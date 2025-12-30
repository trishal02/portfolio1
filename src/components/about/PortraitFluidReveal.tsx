import { useEffect, useRef, useState, useCallback } from "react";

// Debug mode - set to true to see reveal clearly
const DEBUG = false;

interface PortraitFluidRevealProps {
  frontSrc?: string;
  revealSrc?: string;
}

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function PortraitFluidReveal({
  frontSrc = "/5E86B2BB-4491-4660-8F5C-070DAD97CD40_1_105_c.jpeg",
  revealSrc = "/ferrari_logo.jpeg",
}: PortraitFluidRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const portraitTextureRef = useRef<WebGLTexture | null>(null);
  const ferrariTextureRef = useRef<WebGLTexture | null>(null);
  const maskTextureRef = useRef<WebGLTexture | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const positionBufferRef = useRef<WebGLBuffer | null>(null);
  const texCoordBufferRef = useRef<WebGLBuffer | null>(null);
  const rafRef = useRef<number | null>(null);
  const texturesLoadedRef = useRef(false);

  const [isHovered, setIsHovered] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);

  const blobsRef = useRef<Blob[]>([]);
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  // Vertex shader source
  const vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      v_texCoord = a_texCoord;
    }
  `;

  // Fragment shader source - blends portrait and ferrari based on mask
  const fragmentShaderSource = `
    precision mediump float;
    
    uniform sampler2D u_portrait;
    uniform sampler2D u_ferrari;
    uniform sampler2D u_mask;
    uniform float u_debug;
    
    varying vec2 v_texCoord;
    
    void main() {
      vec4 portrait = texture2D(u_portrait, v_texCoord);
      vec4 ferrari = texture2D(u_ferrari, v_texCoord);
      float mask = texture2D(u_mask, v_texCoord).r;
      
      // Blend based on mask - slightly boost mask for more visibility
      float maskBoost = mask * 1.15; // Boost by 15% for more visibility
      maskBoost = min(maskBoost, 1.0); // Clamp to 1.0
      vec4 color = mix(portrait, ferrari, maskBoost * (1.0 + u_debug * 0.5));
      gl_FragColor = color;
    }
  `;

  // Create and compile shader
  const createShader = useCallback(
    (
      gl: WebGLRenderingContext,
      type: number,
      source: string
    ): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    },
    []
  );

  // Create shader program
  const createProgram = useCallback(
    (
      gl: WebGLRenderingContext,
      vertexSource: string,
      fragmentSource: string
    ): WebGLProgram | null => {
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
      const fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentSource
      );

      if (!vertexShader || !fragmentShader) return null;

      const program = gl.createProgram();
      if (!program) return null;

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program link error:", gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }

      return program;
    },
    [createShader]
  );

  // Load texture from image
  const loadTexture = useCallback(
    (gl: WebGLRenderingContext, url: string): Promise<WebGLTexture | null> => {
      return new Promise((resolve) => {
        const texture = gl.createTexture();
        if (!texture) {
          resolve(null);
          return;
        }

        const image = new Image();
        image.crossOrigin = "anonymous";

        image.onload = () => {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            image
          );
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

          resolve(texture);
        };

        image.onerror = () => {
          console.warn(`[PortraitFluidReveal] Failed to load image: ${url}`);
          resolve(null);
        };

        image.src = url;
      });
    },
    []
  );

  // Initialize WebGL
  const initWebGL = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    glRef.current = gl;

    // Create shader program
    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    if (!program) return;

    programRef.current = program;

    // Create fullscreen quad buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    positionBufferRef.current = positionBuffer;

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]),
      gl.STATIC_DRAW
    );
    texCoordBufferRef.current = texCoordBuffer;

    // Load portrait image first to get aspect ratio
    const portraitImage = new Image();
    portraitImage.crossOrigin = "anonymous";

    await new Promise<void>((resolve) => {
      portraitImage.onload = () => {
        const aspectRatio = portraitImage.width / portraitImage.height;
        setImageAspectRatio(aspectRatio);
        resolve();
      };
      portraitImage.onerror = () => {
        console.warn(
          `[PortraitFluidReveal] Failed to load portrait image: ${frontSrc}`
        );
        resolve(); // Continue even if image fails
      };
      portraitImage.src = frontSrc;
    });

    // Load textures
    const portraitTex = await loadTexture(gl, frontSrc);
    const ferrariTex = await loadTexture(gl, revealSrc);

    if (!portraitTex || !ferrariTex) {
      console.error("Failed to load textures");
      return;
    }

    portraitTextureRef.current = portraitTex;
    ferrariTextureRef.current = ferrariTex;
    texturesLoadedRef.current = true;

    // Create mask canvas - will be resized properly in resize effect
    const maskCanvas = document.createElement("canvas");
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      maskCanvas.width = rect.width * window.devicePixelRatio || 800;
      maskCanvas.height = rect.height * window.devicePixelRatio || 1000;
    } else {
      maskCanvas.width = canvas.width || 800;
      maskCanvas.height = canvas.height || 1000;
    }
    maskCanvasRef.current = maskCanvas;

    const maskTexture = gl.createTexture();
    if (maskTexture) {
      gl.bindTexture(gl.TEXTURE_2D, maskTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        maskCanvas
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      maskTextureRef.current = maskTexture;
    }

    // Initialize blobs - start at center in pixel coordinates
    const centerX = maskCanvas.width / 2;
    const centerY = maskCanvas.height / 2;
    blobsRef.current = Array.from({ length: 5 }, () => ({
      x: centerX,
      y: centerY,
      vx: 0,
      vy: 0,
      radius: 0.22, // Increased from 0.15 for more visibility
    }));
  }, [frontSrc, revealSrc, createProgram, loadTexture]);

  // Update mask texture with fluid blob effect
  const updateMask = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    const gl = glRef.current;
    if (!maskCanvas || !gl || !maskTextureRef.current) return;

    const ctx = maskCanvas.getContext("2d");
    if (!ctx) return;

    const width = maskCanvas.width;
    const height = maskCanvas.height;

    // Clear with fade
    ctx.fillStyle = "rgba(0, 0, 0, 0.98)";
    ctx.fillRect(0, 0, width, height);

    if (!isRevealed && !isHovered) {
      // Update texture even when not revealed (for fade effect)
      gl.bindTexture(gl.TEXTURE_2D, maskTextureRef.current);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        maskCanvas
      );
      return;
    }

    // Update blob positions with inertia
    const targetX =
      mouseX * (width / (containerRef.current?.offsetWidth || width));
    const targetY =
      mouseY * (height / (containerRef.current?.offsetHeight || height));

    blobsRef.current.forEach((blob, i) => {
      const offsetX = Math.sin(i * 1.5) * 30;
      const offsetY = Math.cos(i * 1.5) * 30;

      const targetBlobX = targetX + offsetX;
      const targetBlobY = targetY + offsetY;

      if (prefersReducedMotion) {
        blob.x = targetBlobX;
        blob.y = targetBlobY;
      } else {
        // Smooth interpolation with inertia
        blob.vx += (targetBlobX - blob.x) * 0.05;
        blob.vy += (targetBlobY - blob.y) * 0.05;
        blob.vx *= 0.85; // Damping
        blob.vy *= 0.85;
        blob.x += blob.vx;
        blob.y += blob.vy;
      }
    });

    // Draw metaballs (fluid blobs) - create temporary canvas for blur
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    const gradient = tempCtx.createRadialGradient(0, 0, 0, 0, 0, 100);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.25, "rgba(255, 255, 255, 0.95)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.75)");
    gradient.addColorStop(0.75, "rgba(255, 255, 255, 0.4)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    tempCtx.globalCompositeOperation = "lighten";

    blobsRef.current.forEach((blob) => {
      tempCtx.save();
      tempCtx.translate(blob.x, blob.y);
      tempCtx.scale(blob.radius * 1.8, blob.radius * 1.8); // Increased from 1.5 to 1.8
      tempCtx.fillStyle = gradient;
      tempCtx.beginPath();
      tempCtx.arc(0, 0, 50, 0, Math.PI * 2); // Increased from 40 to 50
      tempCtx.fill();
      tempCtx.restore();
    });

    // Apply blur for soft edges (slightly less blur for more visibility)
    ctx.filter = "blur(10px)";
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.filter = "none";

    // Update WebGL texture
    gl.bindTexture(gl.TEXTURE_2D, maskTextureRef.current);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      maskCanvas
    );
  }, [isRevealed, isHovered, mouseX, mouseY, prefersReducedMotion]);

  // Render frame
  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    if (!gl || !program || !texturesLoadedRef.current) {
      return;
    }

    // Check if buffers exist
    if (
      !positionBufferRef.current ||
      !texCoordBufferRef.current ||
      !maskTextureRef.current
    ) {
      return;
    }

    updateMask();

    gl.useProgram(program);

    // Set up attributes
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferRef.current);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBufferRef.current);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Set up textures
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, portraitTextureRef.current);
    const portraitLoc = gl.getUniformLocation(program, "u_portrait");
    if (portraitLoc !== null) gl.uniform1i(portraitLoc, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, ferrariTextureRef.current);
    const ferrariLoc = gl.getUniformLocation(program, "u_ferrari");
    if (ferrariLoc !== null) gl.uniform1i(ferrariLoc, 1);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, maskTextureRef.current);
    const maskLoc = gl.getUniformLocation(program, "u_mask");
    if (maskLoc !== null) gl.uniform1i(maskLoc, 2);

    const debugLoc = gl.getUniformLocation(program, "u_debug");
    if (debugLoc !== null) gl.uniform1f(debugLoc, DEBUG ? 1.0 : 0.0);

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Continue animation loop if hovering or revealed
    if (isRevealed || isHovered) {
      rafRef.current = requestAnimationFrame(render);
    } else {
      rafRef.current = null;
    }
  }, [updateMask, isRevealed, isHovered]);

  // Initialize on mount
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      await initWebGL();
      // Start initial render after textures load
      if (mounted && texturesLoadedRef.current) {
        // Render once to show portrait
        render();
      }
    };

    init();

    return () => {
      mounted = false;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [initWebGL, render]);

  // Restart render loop when hover/reveal state changes
  useEffect(() => {
    if (texturesLoadedRef.current && (isHovered || isRevealed)) {
      if (!rafRef.current) {
        render();
      }
    }
  }, [isHovered, isRevealed, render]);

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMouseX(e.clientX - rect.left);
      setMouseY(e.clientY - rect.top);

      if (!rafRef.current) {
        render();
      }
    },
    [render]
  );

  // Handle hover enter
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    render();
  }, [render]);

  // Handle hover leave
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Handle touch move
  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!containerRef.current || e.touches.length === 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      setMouseX(touch.clientX - rect.left);
      setMouseY(touch.clientY - rect.top);

      if (!rafRef.current) {
        render();
      }
    },
    [render]
  );

  // Handle touch start
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMouseX(touch.clientX - rect.left);
        setMouseY(touch.clientY - rect.top);
      }
    },
    []
  );

  // Handle touch end - toggle reveal
  const handleTouchEnd = useCallback(() => {
    setIsRevealed((prev) => !prev);
  }, []);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const gl = glRef.current;
      if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      if (maskCanvasRef.current) {
        maskCanvasRef.current.width = canvas.width;
        maskCanvasRef.current.height = canvas.height;

        // Update blob positions to center when resized
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        blobsRef.current.forEach((blob) => {
          blob.x = centerX;
          blob.y = centerY;
        });

        // Re-initialize mask texture if WebGL is ready
        if (gl && maskTextureRef.current) {
          gl.bindTexture(gl.TEXTURE_2D, maskTextureRef.current);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            maskCanvasRef.current
          );
        }
      }

      // Restart render if needed
      if (texturesLoadedRef.current) {
        if (!rafRef.current) {
          render();
        }
      }
    };

    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    resize(); // Initial resize

    window.addEventListener("resize", resize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [render]);

  return (
    <div className="w-full">
      {DEBUG && (
        <div
          className="absolute top-4 left-4 px-3 py-1 rounded text-xs font-bold z-50"
          style={{ backgroundColor: "#DC2626", color: "#FFFFFF" }}
        >
          FLUID REVEAL ON
        </div>
      )}
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden border"
        style={{
          borderColor: "rgba(220, 38, 38, 0.3)",
          aspectRatio: imageAspectRatio ? `${imageAspectRatio}` : "4/5", // Fallback to 4/5 if aspect ratio not loaded yet
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: "block" }}
        />
      </div>

      {/* Hint text (desktop only) */}
      <p
        className="text-xs text-center mt-2 opacity-60 hidden md:block transition-opacity"
        style={{ color: "#9CA3AF" }}
      >
        Hover to reveal
      </p>
    </div>
  );
}
