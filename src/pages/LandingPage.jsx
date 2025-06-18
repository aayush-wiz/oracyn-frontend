import React, { useState, useEffect, useRef } from "react";
import { BarChart3, TrendingUp, PieChart, Activity, Zap } from "lucide-react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";

// Keep the original logo exactly as provided
const OracynLogo = () => (
  <div className="relative w-8 h-8 group cursor-pointer">
    <svg
      className="absolute w-full h-full text-gray-200 transition-opacity duration-300 opacity-100 group-hover:opacity-0"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    </svg>
    <svg
      className="absolute w-full h-full text-gray-100 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.98l1.414 1.414M18.6 8.98l-1.414 1.414M12 6V4M12 20v-2M4.929 14.071l1.414-1.414M17.171 14.071l1.414 1.414"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 16s1.79-2 5-2 5 2 5 2"
      />
    </svg>
  </div>
);

// Stunning Geometric Universe Three.js Background
const ThreeJsBackground = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Create floating geometric constellation
    const createGeometricConstellation = () => {
      const nodes = [];
      const nodeCount = 40;

      for (let i = 0; i < nodeCount; i++) {
        // Random geometric shape
        const shapeType = Math.random();
        let geometry;

        if (shapeType < 0.3) {
          geometry = new THREE.OctahedronGeometry(0.8);
        } else if (shapeType < 0.6) {
          geometry = new THREE.TetrahedronGeometry(1.2);
        } else {
          geometry = new THREE.IcosahedronGeometry(0.6);
        }

        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(0.9, 0.9, 0.9),
          wireframe: true,
          transparent: true,
          opacity: 0.8,
        });

        const node = new THREE.Mesh(geometry, material);

        // Position in 3D space
        const radius = 30 + Math.random() * 40;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        node.position.set(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        );

        node.userData = {
          originalPosition: node.position.clone(),
          rotationSpeed: {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02,
          },
          floatAmplitude: Math.random() * 2 + 1,
          floatSpeed: Math.random() * 0.02 + 0.01,
          phase: Math.random() * Math.PI * 2,
        };

        scene.add(node);
        nodes.push(node);
      }

      return nodes;
    };

    const geometricNodes = createGeometricConstellation();

    // Create dynamic connection lines with energy flow
    const createEnergyConnections = () => {
      const connections = [];
      const maxConnections = 60;
      let connectionCount = 0;

      for (
        let i = 0;
        i < geometricNodes.length && connectionCount < maxConnections;
        i++
      ) {
        for (
          let j = i + 1;
          j < geometricNodes.length && connectionCount < maxConnections;
          j++
        ) {
          const distance = geometricNodes[i].position.distanceTo(
            geometricNodes[j].position
          );

          if (distance < 25 && Math.random() > 0.7) {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array([
              geometricNodes[i].position.x,
              geometricNodes[i].position.y,
              geometricNodes[i].position.z,
              geometricNodes[j].position.x,
              geometricNodes[j].position.y,
              geometricNodes[j].position.z,
            ]);

            geometry.setAttribute(
              "position",
              new THREE.BufferAttribute(positions, 3)
            );

            const material = new THREE.LineBasicMaterial({
              color: new THREE.Color(0.7, 0.7, 0.7),
              transparent: true,
              opacity: 0.4,
            });

            const line = new THREE.Line(geometry, material);
            line.userData = {
              nodeA: geometricNodes[i],
              nodeB: geometricNodes[j],
              pulsePhase: Math.random() * Math.PI * 2,
              pulseSpeed: 0.03 + Math.random() * 0.02,
            };

            scene.add(line);
            connections.push(line);
            connectionCount++;
          }
        }
      }

      return connections;
    };

    const energyConnections = createEnergyConnections();

    // Create orbital rings around origin
    const createOrbitalRings = () => {
      const rings = [];
      const ringCount = 3;

      for (let i = 0; i < ringCount; i++) {
        const radius = 20 + i * 15;
        const segments = 64;
        const geometry = new THREE.RingGeometry(
          radius - 0.5,
          radius + 0.5,
          segments
        );

        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(0.5, 0.5, 0.5),
          transparent: true,
          opacity: 0.2,
          side: THREE.DoubleSide,
        });

        const ring = new THREE.Mesh(geometry, material);

        // Random orientation
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        ring.rotation.z = Math.random() * Math.PI;

        ring.userData = {
          rotationSpeed: {
            x: (Math.random() - 0.5) * 0.005,
            y: (Math.random() - 0.5) * 0.005,
            z: (Math.random() - 0.5) * 0.005,
          },
          pulsePhase: (i * Math.PI) / 3,
        };

        scene.add(ring);
        rings.push(ring);
      }

      return rings;
    };

    const orbitalRings = createOrbitalRings();

    // Create larger architectural elements
    const createArchitecturalElements = () => {
      const elements = [];

      // Central core structure
      const coreGeometry = new THREE.DodecahedronGeometry(3);
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0.8, 0.8, 0.8),
        wireframe: true,
        transparent: true,
        opacity: 0.6,
      });

      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      core.userData = {
        rotationSpeed: { x: 0.005, y: 0.003, z: 0.007 },
      };
      scene.add(core);
      elements.push(core);

      // Surrounding framework
      for (let i = 0; i < 4; i++) {
        const frameGeometry = new THREE.BoxGeometry(1, 15, 1);
        const frameMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(0.6, 0.6, 0.6),
          transparent: true,
          opacity: 0.4,
        });

        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        const angle = (i / 4) * Math.PI * 2;
        frame.position.set(Math.cos(angle) * 12, 0, Math.sin(angle) * 12);
        frame.rotation.y = angle;

        frame.userData = {
          originalY: frame.position.y,
          floatSpeed: 0.01 + i * 0.002,
          floatAmplitude: 2,
        };

        scene.add(frame);
        elements.push(frame);
      }

      return elements;
    };

    const architecturalElements = createArchitecturalElements();

    // Create energy field effect
    const createEnergyField = () => {
      const fieldGeometry = new THREE.SphereGeometry(50, 32, 32);
      const fieldMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0.3, 0.3, 0.3),
        transparent: true,
        opacity: 0.1,
        wireframe: true,
      });

      const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
      field.userData = {
        rotationSpeed: { x: 0.001, y: 0.002, z: 0.0015 },
        pulsePhase: 0,
      };

      scene.add(field);
      return field;
    };

    const energyField = createEnergyField();

    camera.position.z = 80;

    // Animation variables
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;
    let time = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.01;

      // Animate geometric constellation
      geometricNodes.forEach((node, index) => {
        // Rotation
        node.rotation.x += node.userData.rotationSpeed.x;
        node.rotation.y += node.userData.rotationSpeed.y;
        node.rotation.z += node.userData.rotationSpeed.z;

        // Floating motion
        const floatOffset =
          Math.sin(time * node.userData.floatSpeed + node.userData.phase) *
          node.userData.floatAmplitude;
        node.position.y = node.userData.originalPosition.y + floatOffset;

        // Subtle orbital motion
        const orbitOffset = Math.cos(time * 0.5 + index) * 0.5;
        node.position.x = node.userData.originalPosition.x + orbitOffset;

        // Pulsing opacity
        node.material.opacity = 0.8 + Math.sin(time * 2 + index) * 0.2;
      });

      // Animate energy connections
      energyConnections.forEach((connection) => {
        // Update line positions
        const positions = connection.geometry.attributes.position.array;
        positions[0] = connection.userData.nodeA.position.x;
        positions[1] = connection.userData.nodeA.position.y;
        positions[2] = connection.userData.nodeA.position.z;
        positions[3] = connection.userData.nodeB.position.x;
        positions[4] = connection.userData.nodeB.position.y;
        positions[5] = connection.userData.nodeB.position.z;
        connection.geometry.attributes.position.needsUpdate = true;

        // Pulsing energy flow
        const pulse = Math.sin(
          time * connection.userData.pulseSpeed + connection.userData.pulsePhase
        );
        connection.material.opacity = 0.4 + pulse * 0.3;
      });

      // Animate orbital rings
      orbitalRings.forEach((ring, index) => {
        ring.rotation.x += ring.userData.rotationSpeed.x;
        ring.rotation.y += ring.userData.rotationSpeed.y;
        ring.rotation.z += ring.userData.rotationSpeed.z;

        // Pulsing effect
        const pulse = Math.sin(time + ring.userData.pulsePhase);
        ring.material.opacity = 0.2 + pulse * 0.1;
        ring.scale.setScalar(1 + pulse * 0.05);
      });

      // Animate architectural elements
      architecturalElements.forEach((element, index) => {
        if (element.userData.rotationSpeed) {
          element.rotation.x += element.userData.rotationSpeed.x;
          element.rotation.y += element.userData.rotationSpeed.y;
          element.rotation.z += element.userData.rotationSpeed.z;
        }

        if (element.userData.floatSpeed) {
          element.position.y =
            element.userData.originalY +
            Math.sin(time * element.userData.floatSpeed) *
              element.userData.floatAmplitude;
        }
      });

      // Animate energy field
      energyField.rotation.x += energyField.userData.rotationSpeed.x;
      energyField.rotation.y += energyField.userData.rotationSpeed.y;
      energyField.rotation.z += energyField.userData.rotationSpeed.z;

      const fieldPulse = Math.sin(time * 0.5);
      energyField.material.opacity = 0.1 + fieldPulse * 0.05;

      // Camera movement with smooth parallax
      const targetX = mouseX * 15;
      const targetY = mouseY * 15;
      camera.position.x += (targetX - camera.position.x) * 0.02;
      camera.position.y += (targetY - camera.position.y) * 0.02;
      camera.position.z = 80 + scrollY * 0.02;

      // Subtle camera rotation for dynamic feel
      camera.rotation.z = mouseX * 0.01;
      camera.rotation.x = mouseY * 0.01;

      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // Dispose of all Three.js objects
      [
        ...geometricNodes,
        ...energyConnections,
        ...orbitalRings,
        ...architecturalElements,
        energyField,
      ].forEach((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background:
          "radial-gradient(ellipse at center, #111111 0%, #000000 70%, #000000 100%)",
      }}
    />
  );
};

const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-12 scale-95"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "backdrop-blur-2xl bg-black/90 border-b border-gray-800/60 shadow-2xl shadow-black/50"
          : "backdrop-blur-xl bg-black/70 border-b border-gray-900/30"
      }`}
    >
      <div className="container mx-auto px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
            <OracynLogo />
          </div>
          <span className="text-2xl font-bold text-white transition-all duration-500 group-hover:text-gray-300 group-hover:tracking-wider">
            Oracyn
          </span>
        </div>

        <div className="flex items-center space-x-8">
          <button
            onClick={() => {
              navigate("/login");
            }}
            className="relative group text-gray-300 hover:text-white transition-all duration-500 font-medium text-lg overflow-hidden"
          >
            <span className="relative z-10 transform transition-all duration-300 group-hover:scale-105">
              Sign In
            </span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-500 group-hover:w-full"></div>
          </button>

          <button className="relative group bg-transparent border-2 border-gray-600 text-white px-8 py-3 rounded-none font-semibold text-lg overflow-hidden transition-all duration-500 hover:border-white hover:shadow-2xl hover:shadow-white/20">
            <div onClick={()=>navigate("/signup")} className="absolute inset-0 bg-white transform translate-y-full transition-transform duration-500 group-hover:translate-y-0"></div>
            <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
              Get Started
            </span>

            {/* Geometric corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>
      </div>
    </header>
  );
};

const LuminousText = ({ text, className = "" }) => (
  <span className={`relative inline-block ${className}`}>
    <span className="relative z-10 bg-gradient-to-br from-white via-gray-100 to-gray-300 bg-clip-text text-transparent transition-all duration-700">
      {text}
    </span>
    <span className="absolute inset-0 bg-gradient-to-br from-gray-200 via-white to-gray-100 bg-clip-text text-transparent opacity-0 transition-all duration-700 hover:opacity-100 scale-105">
      {text}
    </span>

    {/* Geometric wireframe effect on hover */}
    <div className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-700 pointer-events-none">
      <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-white"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-white"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-white"></div>
    </div>
  </span>
);

const Hero = () => {
  return (
    <section className="relative pt-40 pb-32 min-h-screen flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-8 relative z-10 text-center">
        <AnimatedSection>
          <div className="relative mb-12 group cursor-default">
            <h1 className="text-7xl md:text-9xl font-black leading-none tracking-tighter transition-all duration-1000 group-hover:scale-105">
              <div className="block mb-6 relative">
                <LuminousText
                  text="Transform Documents"
                  className="hover:animate-pulse"
                />

                {/* Geometric accent lines */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-40"></div>
              </div>

              <div className="block text-gray-300 hover:text-white transition-all duration-700 relative">
                into Conversations
                {/* Floating geometric elements */}
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-4 h-4 border border-gray-500 rotate-45 opacity-60 group-hover:rotate-180 transition-transform duration-1000"></div>
                <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-3 h-3 border border-gray-400 rotate-12 opacity-40 group-hover:rotate-90 transition-transform duration-1000"></div>
              </div>
            </h1>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="relative max-w-3xl mx-auto mb-16">
            <p className="text-2xl text-gray-400 leading-relaxed transition-all duration-700 hover:text-gray-200 hover:scale-105 font-light tracking-wide">
              Upload any document and chat with it using AI. Generate insights,
              create charts, and unlock the hidden potential of your data.
            </p>

            {/* Subtle geometric frame */}
            <div className="absolute -inset-4 border border-gray-800 opacity-0 hover:opacity-30 transition-opacity duration-700 pointer-events-none"></div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={400}>
          <div className="flex justify-center">
            <button className="group relative bg-transparent border-2 border-gray-700 text-white font-bold text-xl px-12 py-6 overflow-hidden transition-all duration-700 hover:border-white hover:shadow-2xl hover:shadow-white/30 hover:scale-105">
              {/* Animated background */}
              <div className="absolute inset-0 bg-white transform -skew-x-12 -translate-x-full transition-transform duration-700 group-hover:translate-x-0"></div>

              {/* Button content */}
              <span className="relative z-10 flex items-center gap-4 transition-colors duration-700 group-hover:text-black">
                Start Chatting
                <svg
                  className="w-7 h-7 transition-all duration-700 group-hover:translate-x-2 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>

              {/* Corner geometric accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-white opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-white opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-white opacity-0 group-hover:opacity-100 transition-all duration-500 delay-400"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-white opacity-0 group-hover:opacity-100 transition-all duration-500 delay-500"></div>
            </button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description, delay = 0 }) => (
  <AnimatedSection delay={delay}>
    <div className="group relative p-10 bg-black/60 backdrop-blur-sm border border-gray-800/60 transition-all duration-700 hover:bg-black/80 hover:border-gray-600/80 hover:scale-105 hover:-translate-y-6 h-full cursor-pointer overflow-hidden">
      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
        <div className="absolute top-4 left-4 w-8 h-8 border border-gray-400 rotate-45"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 border border-gray-500 rotate-12"></div>
        <div className="absolute top-1/2 right-8 w-4 h-4 border border-gray-600"></div>
      </div>

      {/* Animated border effects */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 transition-all duration-700"></div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-0 h-0 border-l-4 border-t-4 border-transparent group-hover:border-white transition-all duration-500 group-hover:w-6 group-hover:h-6"></div>
      <div className="absolute bottom-0 right-0 w-0 h-0 border-r-4 border-b-4 border-transparent group-hover:border-white transition-all duration-500 group-hover:w-6 group-hover:h-6"></div>

      <div className="relative z-10">
        <div className="inline-flex p-6 bg-gray-900/50 border border-gray-700/50 mb-8 group-hover:bg-gray-800/70 group-hover:border-gray-600/70 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
          <div className="transform group-hover:rotate-12 transition-transform duration-500">
            {icon}
          </div>
        </div>

        <h3 className="text-3xl font-bold text-white mb-6 group-hover:text-gray-200 transition-all duration-500 group-hover:tracking-wider">
          <LuminousText text={title} />
        </h3>

        <p className="text-gray-400 group-hover:text-gray-200 transition-all duration-500 leading-relaxed text-lg font-light">
          {description}
        </p>

        {/* Subtle geometric line */}
        <div className="mt-6 w-0 h-0.5 bg-gradient-to-r from-white to-transparent group-hover:w-full transition-all duration-700 delay-200"></div>
      </div>
    </div>
  </AnimatedSection>
);

const Features = () => {
  const features = [
    {
      icon: (
        <svg
          className="w-10 h-10 text-gray-200 group-hover:text-white transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15v-6m0 0l-3 3m3-3l3 3"
          />
        </svg>
      ),
      title: "Multi-Format Support",
      description:
        "Upload PDFs, Word docs, images, and more with seamless processing.",
    },
    {
      icon: (
        <svg
          className="w-10 h-10 text-gray-200 group-hover:text-white transition-all duration-700 transform group-hover:scale-110 group-hover:-rotate-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "AI-Powered Analysis",
      description:
        "Advanced understanding and interpretation of your document content.",
    },
    {
      icon: (
        <svg
          className="w-10 h-10 text-gray-200 group-hover:text-white transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-45"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Lightning Fast",
      description: "Process documents in seconds with optimized AI algorithms.",
    },
    {
      icon: (
        <svg
          className="w-10 h-10 text-gray-200 group-hover:text-white transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9.944a12.02 12.02 0 009 12.017 12.02 12.02 0 009-12.017z"
          />
        </svg>
      ),
      title: "Secure & Private",
      description:
        "Your data is encrypted and processed with enterprise-grade security.",
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-20 relative">
            <h2 className="text-6xl font-black text-white mb-6 hover:text-gray-200 transition-all duration-700 cursor-default tracking-tight">
              Powerful Features
            </h2>
            <p className="text-2xl text-gray-400 hover:text-gray-300 transition-all duration-500 cursor-default font-light max-w-3xl mx-auto leading-relaxed">
              Everything you need to make your documents intelligent and
              interactive
            </p>

            {/* Geometric accent */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-30"></div>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 150}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const ChartsSlider = () => {
  const scrollContainerRef = useRef(null);

  const charts = [
    { name: "Bar Chart", icon: BarChart3 },
    { name: "Line Graph", icon: TrendingUp },
    { name: "Pie Chart", icon: PieChart },
    { name: "Area Chart", icon: Activity },
    { name: "Scatter Plot", icon: Zap },
    { name: "Bar Chart", icon: BarChart3 },
    { name: "Line Graph", icon: TrendingUp },
    { name: "Pie Chart", icon: PieChart },
    { name: "Area Chart", icon: Activity },
    { name: "Scatter Plot", icon: Zap },
    { name: "Bar Chart", icon: BarChart3 },
    { name: "Line Graph", icon: TrendingUp },
  ];

  // Auto-scroll effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollAmount = 0;
    const scrollSpeed = 1; // pixels per frame
    const cardWidth = 300; // width + gap
    const totalWidth = cardWidth * charts.length;

    const autoScroll = () => {
      scrollAmount += scrollSpeed;

      // Reset scroll when we've scrolled past half the content (seamless loop)
      if (scrollAmount >= totalWidth / 2) {
        scrollAmount = 0;
      }

      container.scrollLeft = scrollAmount;
      requestAnimationFrame(autoScroll);
    };

    const scrollAnimation = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(scrollAnimation);
    };
  }, [charts.length]);

  return (
    <section className="py-32 relative overflow-hidden">
      <AnimatedSection>
        <div className="text-center mb-20 relative">
          <h2 className="text-6xl font-black text-white mb-6 hover:text-gray-200 transition-all duration-700 cursor-default tracking-tight">
            Generate Dynamic Charts
          </h2>
          <p className="text-2xl text-gray-400 hover:text-gray-300 transition-all duration-500 cursor-default font-light leading-relaxed">
            Instantly visualize your data with intelligent chart generation
          </p>

          {/* Geometric accent lines */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-56 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-30"></div>
        </div>
      </AnimatedSection>

      <div className="relative">
        {/* Auto-scrolling container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-hidden gap-8 px-8 py-6"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {charts.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="group flex-shrink-0 w-72 h-72 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm border border-gray-800/60 transition-all duration-700 hover:bg-black/90 hover:border-gray-600/80 hover:scale-110 hover:-translate-y-4 cursor-pointer relative overflow-hidden"
            >
              {/* Geometric corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-gray-600 opacity-50 group-hover:border-white group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-gray-600 opacity-50 group-hover:border-white group-hover:opacity-100 transition-all duration-500"></div>

              {/* Background geometric pattern */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-700">
                <div className="absolute top-8 right-8 w-4 h-4 border border-gray-400 rotate-45"></div>
                <div className="absolute bottom-8 left-8 w-3 h-3 border border-gray-500"></div>
              </div>

              <div className="text-gray-300 group-hover:text-white group-hover:scale-125 group-hover:rotate-6 transition-all duration-700 mb-6">
                <item.icon size={64} strokeWidth={1.5} />
              </div>

              <span className="text-white font-bold text-xl group-hover:text-gray-200 transition-all duration-500 text-center px-4 group-hover:tracking-wider">
                {item.name}
              </span>

              {/* Animated bottom line */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-700 delay-200"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CallToAction = () => (
  <section className="py-32 relative">
    <div className="container mx-auto px-8">
      <AnimatedSection>
        <div className="relative p-16 text-center overflow-hidden bg-black/80 backdrop-blur-sm border-2 border-gray-800/60 group hover:border-gray-600/80 transition-all duration-700 hover:scale-105 cursor-pointer">
          {/* Geometric background pattern */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
            <div className="absolute top-8 left-8 w-12 h-12 border border-gray-400 rotate-45"></div>
            <div className="absolute top-8 right-8 w-8 h-8 border border-gray-500 rotate-12"></div>
            <div className="absolute bottom-8 left-8 w-6 h-6 border border-gray-600"></div>
            <div className="absolute bottom-8 right-8 w-10 h-10 border border-gray-400 rotate-45"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-gray-500 opacity-30"></div>
          </div>

          {/* Corner geometric accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-gray-600 group-hover:border-white transition-all duration-500"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-gray-600 group-hover:border-white transition-all duration-500"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-gray-600 group-hover:border-white transition-all duration-500"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-gray-600 group-hover:border-white transition-all duration-500"></div>

          <div className="relative z-10">
            <h2 className="text-6xl font-black text-white mb-8 group-hover:text-gray-200 transition-all duration-700 tracking-tight">
              Ready to Transform Your Documents?
            </h2>
            <p className="max-w-3xl mx-auto text-gray-300 mb-12 text-2xl group-hover:text-white transition-all duration-500 font-light leading-relaxed">
              Join thousands of users who are already unlocking insights from
              their documents
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group/btn relative bg-transparent border-2 border-gray-600 text-white font-bold text-xl px-12 py-6 overflow-hidden transition-all duration-700 hover:border-white hover:shadow-2xl hover:shadow-white/30 hover:scale-110">
                <div className="absolute inset-0 bg-white transform -skew-x-12 -translate-x-full transition-transform duration-700 group-hover/btn:translate-x-0"></div>
                <span className="relative z-10 transition-colors duration-700 group-hover/btn:text-black">
                  Get Started Free
                </span>

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-white opacity-0 group-hover/btn:opacity-100 transition-all duration-500 delay-200"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-white opacity-0 group-hover/btn:opacity-100 transition-all duration-500 delay-300"></div>
              </button>

              <button className="relative group/demo text-gray-300 border-2 border-transparent font-bold text-xl px-12 py-6 transition-all duration-500 hover:border-gray-600 hover:text-white overflow-hidden">
                <span className="relative z-10">Watch Demo</span>

                {/* Animated underline */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-white transition-all duration-500 group-hover/demo:w-3/4"></div>
              </button>
            </div>

            {/* Geometric accent line */}
            <div className="mt-12 mx-auto w-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent group-hover:w-64 transition-all duration-1000 delay-300"></div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-16 border-t-2 border-gray-800/60 relative">
    {/* Geometric accent elements */}
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>

    <div className="container mx-auto px-8 text-center relative">
      {/* Subtle geometric pattern */}
      <div className="absolute top-4 left-8 w-4 h-4 border border-gray-700 rotate-45 opacity-30"></div>
      <div className="absolute top-4 right-8 w-3 h-3 border border-gray-600 opacity-40"></div>

      <p className="text-gray-400 hover:text-gray-300 transition-all duration-500 text-lg font-light tracking-wide">
        &copy; {new Date().getFullYear()} Oracyn. All rights reserved.
      </p>

      {/* Animated bottom accent */}
      <div className="mt-6 mx-auto w-0 h-0.5 bg-gradient-to-r from-transparent via-gray-500 to-transparent hover:w-48 transition-all duration-700"></div>
    </div>
  </footer>
);

const LandingPage = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen text-white overflow-x-hidden relative bg-black">
      <ThreeJsBackground />

      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <Features />
          <ChartsSlider />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
