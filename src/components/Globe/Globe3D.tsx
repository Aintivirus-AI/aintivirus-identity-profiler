import { useRef, useMemo, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { Visitor } from '../../hooks/useVisitors';

interface Globe3DProps {
  visitors: Visitor[];
  currentVisitorId: string | null;
}

function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Generate arc points between two locations - reduced segments for performance
function generateArcPoints(
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number,
  segments: number = 20 // Reduced from 50
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const start = latLongToVector3(startLat, startLon, 2.05);
  const end = latLongToVector3(endLat, endLon, 2.05);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = new THREE.Vector3().lerpVectors(start, end, t);
    const arcHeight = Math.sin(t * Math.PI) * 0.5;
    point.normalize().multiplyScalar(2.05 + arcHeight);
    points.push(point);
  }

  return points;
}

// Simplified grid with fewer lines
function GlobeGrid() {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const radius = 2.02;

    // Reduced density: latitude lines every 30° instead of 20°
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lon = 0; lon <= 360; lon += 10) { // 10° steps instead of 5°
        const v1 = latLongToVector3(lat, lon, radius);
        const v2 = latLongToVector3(lat, lon + 10, radius);
        vertices.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
      }
    }

    // Reduced: longitude lines every 30° instead of 20°
    for (let lon = 0; lon < 360; lon += 30) {
      for (let lat = -60; lat < 60; lat += 10) { // 10° steps instead of 5°
        const v1 = latLongToVector3(lat, lon, radius);
        const v2 = latLongToVector3(lat + 10, lon, radius);
        vertices.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
      }
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geo;
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#00f0ff" opacity={0.12} transparent />
    </lineSegments>
  );
}

// Visitor pin component - optimized
function VisitorPin({ 
  lat, 
  lon, 
  isCurrentUser,
  visitorId,
  globeRef,
  onPositionUpdate,
}: { 
  lat: number; 
  lon: number; 
  isCurrentUser: boolean;
  visitorId: string;
  globeRef: React.RefObject<THREE.Group | null>;
  onPositionUpdate: (id: string, pos: { x: number; y: number; visible: boolean }) => void;
}) {
  const position = useMemo(() => latLongToVector3(lat, lon, 2.15), [lat, lon]);
  const labelPosition = useMemo(() => latLongToVector3(lat, lon, 2.5), [lat, lon]);
  const pinRef = useRef<THREE.Mesh>(null);
  const { camera, gl } = useThree();
  const frameCount = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const color = isCurrentUser ? '#00f0ff' : '#ff2d55';
  const size = isCurrentUser ? 0.1 : 0.06;

  useFrame((state) => {
    frameCount.current++;
    
    // Only update every 10th frame for performance (was 3)
    if (frameCount.current % 10 !== 0) return;

    if (pinRef.current && isCurrentUser) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
      pinRef.current.scale.setScalar(scale);
    }

    // Calculate screen position for the label (only for current user)
    if (isCurrentUser && globeRef.current) {
      const worldPos = labelPosition.clone();
      worldPos.applyMatrix4(globeRef.current.matrixWorld);
      
      const screenPos = worldPos.clone().project(camera);
      
      const canvas = gl.domElement;
      const rect = canvas.getBoundingClientRect();
      const x = (screenPos.x * 0.5 + 0.5) * rect.width + rect.left;
      const y = (-screenPos.y * 0.5 + 0.5) * rect.height + rect.top;
      
      const visible = screenPos.z < 1;
      
      // Only update if position changed significantly (5px threshold)
      if (Math.abs(lastPosRef.current.x - x) > 5 || Math.abs(lastPosRef.current.y - y) > 5) {
        lastPosRef.current = { x, y };
        onPositionUpdate(visitorId, { x, y, visible });
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={pinRef}>
        <sphereGeometry args={[size, 6, 6]} /> {/* Reduced from 8,8 */}
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Single glow ring instead of multiple */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 1.5, size * 2, 12]} /> {/* Reduced from 16 */}
        <meshBasicMaterial color={color} opacity={0.4} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Arc between two visitors
function VisitorArc({ 
  startLat, 
  startLon, 
  endLat, 
  endLon 
}: { 
  startLat: number; 
  startLon: number; 
  endLat: number; 
  endLon: number; 
}) {
  const points = useMemo(
    () => generateArcPoints(startLat, startLon, endLat, endLon),
    [startLat, startLon, endLat, endLon]
  );

  return (
    <Line
      points={points}
      color="#00f0ff"
      lineWidth={1}
      transparent
      opacity={0.4}
    />
  );
}

function RotatingGlobe({ 
  visitors,
  currentVisitorId,
  globeRef,
  onPositionUpdate,
}: { 
  visitors: Visitor[];
  currentVisitorId: string | null;
  globeRef: React.RefObject<THREE.Group | null>;
  onPositionUpdate: (id: string, pos: { x: number; y: number; visible: boolean }) => void;
}) {
  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.05;
    }
  });

  const currentVisitor = visitors.find(v => v.id === currentVisitorId);
  const otherVisitors = visitors.filter(v => v.id !== currentVisitorId && v.geo);

  return (
    <group ref={globeRef}>
      {/* Main sphere - reduced segments */}
      <Sphere args={[2, 32, 32]}> {/* Reduced from 64,64 */}
        <meshBasicMaterial color="#05050a" opacity={0.95} transparent />
      </Sphere>
      
      {/* Wireframe only - removed inner glow sphere */}
      <Sphere args={[2.01, 24, 24]}> {/* Reduced from 32,32 */}
        <meshBasicMaterial color="#00f0ff" wireframe opacity={0.08} transparent />
      </Sphere>

      {/* Grid lines */}
      <GlobeGrid />

      {/* Render all visitor pins */}
      {visitors.map((visitor) => {
        if (!visitor.geo) return null;
        const isCurrentUser = visitor.id === currentVisitorId;
        
        return (
          <VisitorPin
            key={visitor.id}
            lat={visitor.geo.lat}
            lon={visitor.geo.lng}
            isCurrentUser={isCurrentUser}
            visitorId={visitor.id}
            globeRef={globeRef}
            onPositionUpdate={onPositionUpdate}
          />
        );
      })}

      {/* Render arcs from current user to others */}
      {currentVisitor?.geo && otherVisitors.map((visitor) => (
        <VisitorArc
          key={`arc-${visitor.id}`}
          startLat={currentVisitor.geo!.lat}
          startLon={currentVisitor.geo!.lng}
          endLat={visitor.geo!.lat}
          endLon={visitor.geo!.lng}
        />
      ))}
    </group>
  );
}

function GlobeScene({ 
  visitors,
  currentVisitorId,
  globeRef,
  onPositionUpdate,
}: { 
  visitors: Visitor[];
  currentVisitorId: string | null;
  globeRef: React.RefObject<THREE.Group | null>;
  onPositionUpdate: (id: string, pos: { x: number; y: number; visible: boolean }) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.6} color="#00f0ff" />
      <RotatingGlobe 
        visitors={visitors}
        currentVisitorId={currentVisitorId}
        globeRef={globeRef}
        onPositionUpdate={onPositionUpdate}
      />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI - Math.PI / 4}
      />
    </>
  );
}

// Floating label rendered via portal
function FloatingLabel({ x, y, visible }: { x: number; y: number; visible: boolean }) {
  if (!visible) return null;
  
  return createPortal(
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)',
        zIndex: 99999,
        pointerEvents: 'none',
      }}
    >
      <div className="bg-cyber-bg/95 backdrop-blur-xl px-3 py-1.5 rounded-lg text-[10px] font-mono text-cyber-cyan whitespace-nowrap border border-cyber-cyan/30 shadow-lg shadow-cyber-cyan/20">
        <MapPin size={10} className="inline mr-1.5" />
        YOU ARE HERE
      </div>
    </div>,
    document.body
  );
}

export function Globe3D({ visitors, currentVisitorId }: Globe3DProps) {
  const globeRef = useRef<THREE.Group>(null);
  const [labelPositions, setLabelPositions] = useState<Record<string, { x: number; y: number; visible: boolean }>>({});

  // Throttled position update to reduce re-renders
  const handlePositionUpdate = useCallback((id: string, pos: { x: number; y: number; visible: boolean }) => {
    setLabelPositions(prev => {
      const existing = prev[id];
      // Only update if position changed significantly (reduces re-renders)
      if (existing && 
          Math.abs(existing.x - pos.x) < 1 && 
          Math.abs(existing.y - pos.y) < 1 &&
          existing.visible === pos.visible) {
        return prev;
      }
      return { ...prev, [id]: pos };
    });
  }, []);

  const currentLabelPos = currentVisitorId ? labelPositions[currentVisitorId] : null;

  return (
    <motion.div 
      className="w-full h-full relative"
      style={{ width: '100%', height: '100%', minHeight: '300px' }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, rgba(5,5,10,0.8) 100%)',
        }}
      />

      <Canvas 
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
        performance={{ min: 0.5 }} // Allow frame rate to drop
        style={{ width: '100%', height: '100%' }}
      >
        <GlobeScene 
          visitors={visitors}
          currentVisitorId={currentVisitorId}
          globeRef={globeRef}
          onPositionUpdate={handlePositionUpdate}
        />
      </Canvas>

      {/* Floating label for current user */}
      {currentLabelPos && (
        <FloatingLabel x={currentLabelPos.x} y={currentLabelPos.y} visible={currentLabelPos.visible} />
      )}
    </motion.div>
  );
}
