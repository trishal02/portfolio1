import { useEffect, useRef, useState, useCallback } from "react";

// Debug mode - set to true to see reveal clearly with crosshair and performance HUD
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
  const touchTimeoutRef = useRef<number | null>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const tempCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const gradientRef = useRef<CanvasGradient | null>(null);
  const rectRef = useRef<DOMRect | null>(null); // Cached container rect
  const mouseXRef = useRef<number>(0); // Fast-changing values in refs
  const mouseYRef = useRef<number>(0);
  const maskOpacityRef = useRef<number>(0);
  const fpsRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  const [isHovered, setIsHovered] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  // Debug state for HUD (only when DEBUG=true)
  const [debugInfo, setDebugInfo] = useState({
    mouseX: 0,
    mouseY: 0,
    canvasX: 0,
    canvasY: 0,
    dpr: 1,
    fps: 0,
  });

  const blobsRef = useRef<Blob[]>([]);
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  // Spring physics constants - tightened for better tracking
  const STIFFNESS = 250; // Increased from 180
  const DAMPING = 15; // Reduced from 22 for less delay

  // Helper: Clamp value between min and max
  const clamp = useCallback((value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value));
  }, []);

  // Helper: Get container-relative coordinates from event (uses cached rect)
  const getContainerCoords = useCallback((clientX: number, clientY: number) => {
    if (!rectRef.current) return { x: 0, y: 0 };
    return {
      x: clientX - rectRef.current.left,
      y: clientY - rectRef.current.top,
    };
  }, []);

  // Update cached rect (call on enter/resize only)
  const updateRect = useCallback(() => {
    if (containerRef.current) {
      rectRef.current = containerRef.current.getBoundingClientRect();
    }
  }, []);

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
    uniform float u_opacity;
    
    varying vec2 v_texCoord;
    
    void main() {
      vec4 portrait = texture2D(u_portrait, v_texCoord);
      vec4 ferrari = texture2D(u_ferrari, v_texCoord);
      float mask = texture2D(u_mask, v_texCoord).r;
      
      // Blend based on mask with opacity control
      float maskBoost = mask * 1.15 * u_opacity;
      maskBoost = min(maskBoost, 1.0);
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
        resolve();
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
    // Cap DPR to 1.5 for performance
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    if (container) {
      const rect = container.getBoundingClientRect();
      maskCanvas.width = rect.width * dpr;
      maskCanvas.height = rect.height * dpr;
    } else {
      maskCanvas.width = canvas.width || 800;
      maskCanvas.height = canvas.height || 1000;
    }
    maskCanvasRef.current = maskCanvas;

    // Initialize temp canvas for blob rendering (reused per frame)
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = maskCanvas.width;
    tempCanvas.height = maskCanvas.height;
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvasRef.current = tempCanvas;
    tempCtxRef.current = tempCtx;
    gradientRef.current = null; // Will be created on first use

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
      radius: 0.22,
    }));
  }, [frontSrc, revealSrc, createProgram, loadTexture]);

  // Update mask texture with fluid blob effect
  const updateMask = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    const gl = glRef.current;
    if (!maskCanvas || !gl || !maskTextureRef.current || !containerRef.current)
      return;

    const ctx = maskCanvas.getContext("2d");
    if (!ctx) return;

    const width = maskCanvas.width;
    const height = maskCanvas.height;
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    // Use refs for fast-changing values (no React re-renders)
    const currentMouseX = mouseXRef.current;
    const currentMouseY = mouseYRef.current;
    const currentOpacity = maskOpacityRef.current;

    // Clear mask - fully opaque when not hovered/revealed, fade trail when active
    if (!isRevealed && !isHovered && currentOpacity === 0) {
      // Clear fully - reveal disappears immediately
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(0, 0, width, height);
      // Update texture
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

    // Clear with fade trail (only while hovered/revealed)
    ctx.fillStyle = "rgba(0, 0, 0, 0.98)";
    ctx.fillRect(0, 0, width, height);

    // Convert container-relative coordinates to canvas coordinates
    const scaleX = width / containerWidth;
    const scaleY = height / containerHeight;

    // Clamp mouse position to container bounds (using refs)
    const clampedX = clamp(currentMouseX, 0, containerWidth);
    const clampedY = clamp(currentMouseY, 0, containerHeight);

    // Convert to canvas coordinates
    const targetX = clampedX * scaleX;
    const targetY = clampedY * scaleY;

    // Clamp target position so blobs don't go outside canvas (account for blob radius)
    const blobRadiusPx = 50 * 1.8; // Approximate blob radius in pixels
    const clampedTargetX = clamp(targetX, blobRadiusPx, width - blobRadiusPx);
    const clampedTargetY = clamp(targetY, blobRadiusPx, height - blobRadiusPx);

    // Update blob positions with spring physics
    blobsRef.current.forEach((blob, i) => {
      const offsetX = Math.sin(i * 1.5) * 30;
      const offsetY = Math.cos(i * 1.5) * 30;

      const targetBlobX = clampedTargetX + offsetX;
      const targetBlobY = clampedTargetY + offsetY;

      if (prefersReducedMotion) {
        blob.x = targetBlobX;
        blob.y = targetBlobY;
        blob.vx = 0;
        blob.vy = 0;
      } else {
        // Spring physics: F = -kx - cv
        const dx = targetBlobX - blob.x;
        const dy = targetBlobY - blob.y;
        const forceX = (STIFFNESS / 1000) * dx - (DAMPING / 100) * blob.vx;
        const forceY = (STIFFNESS / 1000) * dy - (DAMPING / 100) * blob.vy;

        blob.vx += forceX * 0.016; // ~60fps
        blob.vy += forceY * 0.016;
        blob.vx *= 0.9; // Reduced damping for tighter tracking (was 0.85)
        blob.vy *= 0.9;
        blob.x += blob.vx;
        blob.y += blob.vy;
      }
    });

    // Draw metaballs (fluid blobs) - use cached temp canvas
    const tempCanvas = tempCanvasRef.current;
    const tempCtx = tempCtxRef.current;
    if (!tempCanvas || !tempCtx) return;

    // Ensure temp canvas size matches mask canvas
    if (tempCanvas.width !== width || tempCanvas.height !== height) {
      tempCanvas.width = width;
      tempCanvas.height = height;
      gradientRef.current = null; // Reset gradient when resized
    }

    // Create gradient once and cache it
    if (!gradientRef.current) {
      gradientRef.current = tempCtx.createRadialGradient(0, 0, 0, 0, 0, 100);
      gradientRef.current.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradientRef.current.addColorStop(0.25, "rgba(255, 255, 255, 0.95)");
      gradientRef.current.addColorStop(0.5, "rgba(255, 255, 255, 0.75)");
      gradientRef.current.addColorStop(0.75, "rgba(255, 255, 255, 0.4)");
      gradientRef.current.addColorStop(1, "rgba(255, 255, 255, 0)");
    }

    // Clear temp canvas
    tempCtx.clearRect(0, 0, width, height);
    tempCtx.globalCompositeOperation = "lighten";

    blobsRef.current.forEach((blob) => {
      tempCtx.save();
      tempCtx.translate(blob.x, blob.y);
      tempCtx.scale(blob.radius * 1.8, blob.radius * 1.8);
      tempCtx.fillStyle = gradientRef.current!;
      tempCtx.beginPath();
      tempCtx.arc(0, 0, 50, 0, Math.PI * 2);
      tempCtx.fill();
      tempCtx.restore();
    });

    // Apply blur for soft edges
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
  }, [isRevealed, isHovered, prefersReducedMotion, clamp]);

  // Opacity is now managed via refs - no React state updates needed
  // Opacity is set immediately in handlers (handleMouseEnter/Leave)

  // Render frame
  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    if (!gl || !program || !texturesLoadedRef.current) {
      return;
    }

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

    const opacityLoc = gl.getUniformLocation(program, "u_opacity");
    if (opacityLoc !== null) gl.uniform1f(opacityLoc, maskOpacityRef.current);

    // Update debug info if DEBUG is enabled
    if (DEBUG) {
      const now = performance.now();
      frameCountRef.current++;
      if (now - lastFrameTimeRef.current >= 1000) {
        fpsRef.current = frameCountRef.current;
        frameCountRef.current = 0;
        lastFrameTimeRef.current = now;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const scaleX = maskCanvasRef.current
          ? maskCanvasRef.current.width /
            (containerRef.current?.offsetWidth || 1)
          : 1;
        const scaleY = maskCanvasRef.current
          ? maskCanvasRef.current.height /
            (containerRef.current?.offsetHeight || 1)
          : 1;
        setDebugInfo({
          mouseX: mouseXRef.current,
          mouseY: mouseYRef.current,
          canvasX: mouseXRef.current * scaleX,
          canvasY: mouseYRef.current * scaleY,
          dpr,
          fps: fpsRef.current,
        });
      }
    }

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Continue animation loop if hovering or revealed
    if (isRevealed || isHovered || maskOpacityRef.current > 0) {
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
      if (mounted && texturesLoadedRef.current) {
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
    if (
      texturesLoadedRef.current &&
      (isHovered || isRevealed || maskOpacityRef.current > 0)
    ) {
      if (!rafRef.current) {
        render();
      }
    }
  }, [isHovered, isRevealed, render]);

  // Handle mouse move - use refs, no state updates
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!rectRef.current) return;

      const coords = getContainerCoords(e.clientX, e.clientY);

      // Clamp coordinates to container bounds (using cached rect)
      const x = Math.max(0, Math.min(coords.x, rectRef.current.width));
      const y = Math.max(0, Math.min(coords.y, rectRef.current.height));

      // Update refs directly (no React re-render)
      mouseXRef.current = x;
      mouseYRef.current = y;

      // Start render loop if not already running
      if (!rafRef.current && (isHovered || isRevealed)) {
        render();
      }
    },
    [getContainerCoords, render, isHovered, isRevealed]
  );

  // Handle hover enter - initialize mask to cursor position
  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || !maskCanvasRef.current) return;

      // Update cached rect
      updateRect();
      if (!rectRef.current) return;

      const coords = getContainerCoords(e.clientX, e.clientY);

      // Allow edges: >= 0 and <= width/height
      const x = Math.max(0, Math.min(coords.x, rectRef.current.width));
      const y = Math.max(0, Math.min(coords.y, rectRef.current.height));

      // Update refs directly (no React re-render)
      mouseXRef.current = x;
      mouseYRef.current = y;
      maskOpacityRef.current = 1; // Set opacity to 1 immediately
      setIsHovered(true);

      // Snap blobs to entry point immediately (scaled to mask canvas)
      const maskCanvas = maskCanvasRef.current;
      const scaleX = maskCanvas.width / rectRef.current.width;
      const scaleY = maskCanvas.height / rectRef.current.height;
      const tx = x * scaleX;
      const ty = y * scaleY;

      blobsRef.current.forEach((blob) => {
        blob.x = tx;
        blob.y = ty;
        blob.vx = 0;
        blob.vy = 0;
      });
    },
    [getContainerCoords, updateRect]
  );

  // Handle hover leave - immediate clear
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    maskOpacityRef.current = 0; // Set opacity to 0 immediately (ref, no re-render)
    // Clear mask will happen in next updateMask() call
  }, []);

  // Handle touch move - use refs, no state updates
  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (e.touches.length === 0 || !rectRef.current) return;

      const touch = e.touches[0];
      const coords = getContainerCoords(touch.clientX, touch.clientY);

      // Clamp coordinates to container bounds (using cached rect)
      const x = Math.max(0, Math.min(coords.x, rectRef.current.width));
      const y = Math.max(0, Math.min(coords.y, rectRef.current.height));

      // Update refs directly (no React re-render)
      mouseXRef.current = x;
      mouseYRef.current = y;

      // Start render loop if not already running
      if (!rafRef.current && (isHovered || isRevealed)) {
        render();
      }
    },
    [getContainerCoords, render, isHovered, isRevealed]
  );

  // Handle touch start - activate reveal at touch point
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (
        e.touches.length === 0 ||
        !containerRef.current ||
        !maskCanvasRef.current
      )
        return;

      // Update cached rect
      updateRect();
      if (!rectRef.current) return;

      const touch = e.touches[0];
      const coords = getContainerCoords(touch.clientX, touch.clientY);

      // Allow edges: >= 0 and <= width/height
      const x = Math.max(0, Math.min(coords.x, rectRef.current.width));
      const y = Math.max(0, Math.min(coords.y, rectRef.current.height));

      // Update refs directly (no React re-render)
      mouseXRef.current = x;
      mouseYRef.current = y;
      maskOpacityRef.current = 1; // Set opacity to 1 immediately
      setIsRevealed(true);

      // Snap blobs to touch point immediately (scaled to mask canvas)
      const maskCanvas = maskCanvasRef.current;
      const scaleX = maskCanvas.width / rectRef.current.width;
      const scaleY = maskCanvas.height / rectRef.current.height;
      const tx = x * scaleX;
      const ty = y * scaleY;

      blobsRef.current.forEach((blob) => {
        blob.x = tx;
        blob.y = ty;
        blob.vx = 0;
        blob.vy = 0;
      });
    },
    [getContainerCoords, updateRect]
  );

  // Handle touch end - tap to reveal toggle with auto-fade
  const handleTouchEnd = useCallback(() => {
    // Clear any existing timeout
    if (touchTimeoutRef.current !== null) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }

    // Toggle reveal state
    setIsRevealed((prev) => {
      if (prev) {
        // If already revealed, hide after 1.2s
        touchTimeoutRef.current = window.setTimeout(() => {
          setIsRevealed(false);
        }, 1200);
        return prev;
      } else {
        // If not revealed, show it
        return true;
      }
    });
  }, []);

  // Cleanup touch timeout on unmount
  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current !== null) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Update cached rect
      rectRef.current = rect;

      // Cap DPR to 1.5 for performance
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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

        // Resize temp canvas to match
        if (tempCanvasRef.current) {
          tempCanvasRef.current.width = canvas.width;
          tempCanvasRef.current.height = canvas.height;
          gradientRef.current = null; // Reset gradient when resized
        }

        // Update blob positions to center when resized
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        blobsRef.current.forEach((blob) => {
          blob.x = centerX;
          blob.y = centerY;
          blob.vx = 0;
          blob.vy = 0;
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

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    resize();

    window.addEventListener("resize", resize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [render]);

  return (
    <div className="w-full relative">
      {DEBUG && (
        <div
          className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-mono z-50 bg-black bg-opacity-80 text-white"
          style={{ fontSize: "10px", lineHeight: "1.4" }}
        >
          <div>
            mouse: {debugInfo.mouseX.toFixed(1)}, {debugInfo.mouseY.toFixed(1)}
          </div>
          <div>
            canvas: {debugInfo.canvasX.toFixed(1)},{" "}
            {debugInfo.canvasY.toFixed(1)}
          </div>
          <div>dpr: {debugInfo.dpr}</div>
          <div>fps: {debugInfo.fps}</div>
        </div>
      )}
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden border"
        style={{
          borderColor: "rgba(220, 38, 38, 0.3)",
          aspectRatio: imageAspectRatio ? `${imageAspectRatio}` : "4/5",
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

      {/* Hint text */}
      <p
        className="text-xs text-center mt-2 opacity-60 transition-opacity"
        style={{ color: "#9CA3AF" }}
      >
        <span className="hidden md:inline">Hover to reveal</span>
        <span className="md:hidden">Tap to reveal</span>
      </p>
    </div>
  );
}
