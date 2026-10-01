import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, Sparkles, Stars } from '@react-three/drei';
import { Group, Vector3 } from 'three';
import type { AppId } from '../types/apps';

interface WorldSceneProps {
  focused: boolean;
  onOpen: (app: AppId) => void;
}

type HtmlPortalRef = RefObject<HTMLDivElement>;

function PointerHint({ children, visible, portal, position, distanceFactor = 8 }: { children: string; visible: boolean; portal: HtmlPortalRef; position?: [number, number, number]; distanceFactor?: number }) {
  return (
    <Html portal={portal} position={position} center distanceFactor={distanceFactor} style={{ pointerEvents: 'none' }}>
      <span className={`world-object-hint${visible ? ' is-visible' : ''}`} aria-hidden={!visible}>{children}</span>
    </Html>
  );
}

function SugarOrb({ onOpen, portal }: { onOpen: () => void; portal: HtmlPortalRef }) {
  const group = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.position.y = 0.66 + Math.sin(clock.elapsedTime * 0.72) * 0.13;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.18) * 0.12;
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.3) * 0.035;
  });

  return (
    <group ref={group} position={[1.1, 0.66, -1.15]} scale={hovered ? 1.045 : 1}>
      <mesh
        onClick={(event) => { event.stopPropagation(); onOpen(); }}
        onPointerOver={(event) => { event.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = ''; }}
      >
        <sphereGeometry args={[1.27, 64, 48]} />
        <meshPhysicalMaterial
          color={hovered ? '#d23dc8' : '#7f268e'}
          metalness={0.7}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.15}
          emissive="#67116c"
          emissiveIntensity={hovered ? 0.5 : 0.27}
        />
      </mesh>
      <mesh scale={1.035}>
        <sphereGeometry args={[1.27, 48, 32]} />
        <meshBasicMaterial color="#f653e2" wireframe transparent opacity={hovered ? 0.17 : 0.08} />
      </mesh>
      <mesh rotation={[0.22, 0.1, -0.18]}>
        <torusGeometry args={[1.47, 0.018, 12, 120]} />
        <meshStandardMaterial color="#fa8fe8" emissive="#e12dc8" emissiveIntensity={1.5} metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh rotation={[1.22, 0.22, 0.04]}>
        <torusGeometry args={[1.48, 0.009, 8, 100]} />
        <meshBasicMaterial color="#ae84ff" transparent opacity={0.78} />
      </mesh>
      <group
        position={[0, 0.04, 1.145]}
        rotation={[0, 0, -0.08]}
        onClick={(event) => { event.stopPropagation(); onOpen(); }}
        onPointerOver={(event) => { event.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = ''; }}
      >
        <mesh>
          <sphereGeometry args={[0.73, 40, 28]} />
          <meshPhysicalMaterial color="#fff6ff" roughness={0.22} metalness={0.08} clearcoat={0.9} />
        </mesh>
        <mesh position={[0.05, 0, 0.63]} scale={[0.33, 0.42, 0.1]}>
          <sphereGeometry args={[1, 32, 24]} />
          <meshStandardMaterial color="#55116b" metalness={0.65} roughness={0.22} emissive="#9910bb" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.06, 0.01, 0.705]} scale={[0.12, 0.17, 0.06]}>
          <sphereGeometry args={[1, 28, 20]} />
          <meshBasicMaterial color="#100a18" />
        </mesh>
        <mesh position={[0.11, 0.095, 0.764]} scale={[0.048, 0.06, 0.035]}>
          <sphereGeometry args={[1, 20, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
      <pointLight position={[0, 0, 1.9]} color="#fa62e5" intensity={hovered ? 3 : 1.8} distance={5} />
      <PointerHint portal={portal} visible={hovered}>OPEN SUGRA</PointerHint>
    </group>
  );
}

function EyeObject({ onOpen, position, scale = 1, portal }: { onOpen: () => void; position: [number, number, number]; scale?: number; portal: HtmlPortalRef }) {
  const group = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.9 + position[0]) * 0.11;
      group.current.rotation.y = Math.sin(clock.elapsedTime * 0.35 + position[0]) * 0.16;
    }
  });

  const enter = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };
  const exit = () => { setHovered(false); document.body.style.cursor = ''; };
  const open = (event: { stopPropagation: () => void }) => { event.stopPropagation(); onOpen(); };

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh
        rotation={[0, 0, -0.14]}
        onClick={open}
        onPointerOver={enter}
        onPointerOut={exit}
        scale={hovered ? 1.06 : 1}
      >
        <sphereGeometry args={[0.72, 40, 28]} />
        <meshPhysicalMaterial color="#f8eefa" metalness={0.16} roughness={0.2} clearcoat={1} />
      </mesh>
      <mesh position={[0.02, 0, 0.48]} scale={[0.285, 0.36, 0.11]} onClick={open} onPointerOver={enter} onPointerOut={exit}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial color="#be62ff" metalness={0.6} roughness={0.2} emissive="#951aff" emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[0.03, 0, 0.55]} scale={[0.13, 0.2, 0.06]} onClick={open} onPointerOver={enter} onPointerOut={exit}>
        <sphereGeometry args={[1, 24, 18]} />
        <meshBasicMaterial color="#120817" />
      </mesh>
      <mesh rotation={[0.12, 0.24, 0]}>
        <torusGeometry args={[0.86, 0.025, 8, 72]} />
        <meshBasicMaterial color="#f176dc" transparent opacity={0.86} />
      </mesh>
      <PointerHint portal={portal} visible={hovered}>EYE CONTACT.</PointerHint>
    </group>
  );
}

function SugarCube({ onOpen, position, scale = 1, rotation = 0, portal }: { onOpen: () => void; position: [number, number, number]; scale?: number; rotation?: number; portal: HtmlPortalRef }) {
  const group = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.75 + position[0] * 2) * 0.12;
      group.current.rotation.y = rotation + clock.elapsedTime * 0.09;
      group.current.rotation.x = Math.sin(clock.elapsedTime * 0.24 + position[0]) * 0.05;
    }
  });
  const enter = (event: { stopPropagation: () => void }) => {
    event.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer';
  };
  const exit = () => { setHovered(false); document.body.style.cursor = ''; };
  const open = (event: { stopPropagation: () => void }) => { event.stopPropagation(); onOpen(); };

  return (
    <group ref={group} position={position} scale={scale * (hovered ? 1.1 : 1)}>
      <mesh onClick={open} onPointerOver={enter} onPointerOut={exit}>
        <boxGeometry args={[0.72, 0.72, 0.72]} />
        <meshPhysicalMaterial color="#fff5ff" metalness={0.22} roughness={0.24} clearcoat={1} emissive="#f154d9" emissiveIntensity={hovered ? 0.25 : 0.05} />
      </mesh>
      <mesh position={[0, 0, 0.365]} onClick={open} onPointerOver={enter} onPointerOut={exit}>
        <sphereGeometry args={[0.08, 20, 14]} />
        <meshBasicMaterial color="#7b1688" />
      </mesh>
      <PointerHint portal={portal} visible={hovered}>SUGAR DETECTED</PointerHint>
    </group>
  );
}

function RetroComputer({ onOpen, portal }: { onOpen: () => void; portal: HtmlPortalRef }) {
  const [hovered, setHovered] = useState(false);
  const monitor = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (monitor.current) monitor.current.rotation.y = Math.sin(clock.elapsedTime * 0.24) * 0.035;
  });
  const enter = (event: { stopPropagation: () => void }) => { event.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; };
  const exit = () => { setHovered(false); document.body.style.cursor = ''; };
  const open = (event: { stopPropagation: () => void }) => { event.stopPropagation(); onOpen(); };

  return (
    <group ref={monitor} position={[3.4, -1.3, -0.1]} scale={0.92}>
      <group onClick={open} onPointerOver={enter} onPointerOut={exit}>
        <mesh position={[0, 0.63, 0]} castShadow>
          <boxGeometry args={[2.12, 1.52, 0.34]} />
          <meshPhysicalMaterial color="#17121e" metalness={0.78} roughness={0.27} clearcoat={0.8} emissive="#321339" emissiveIntensity={hovered ? 0.35 : 0.16} />
        </mesh>
        <mesh position={[0, 0.67, 0.183]}>
          <boxGeometry args={[1.82, 1.16, 0.018]} />
          <meshBasicMaterial color="#160b20" />
        </mesh>
        <mesh position={[0, 0.68, 0.197]}>
          <planeGeometry args={[1.68, 1.02]} />
          <meshBasicMaterial color="#8c29a2" transparent opacity={0.45} />
        </mesh>
        <mesh position={[0, 0.68, 0.21]}>
          <planeGeometry args={[1.54, 0.88]} />
          <meshBasicMaterial color="#211027" />
        </mesh>
        <mesh position={[0, 0.68, 0.225]}>
          <planeGeometry args={[1.43, 0.75]} />
          <meshBasicMaterial color="#260f31" />
        </mesh>
        <mesh position={[0, 0.68, 0.232]}>
          <planeGeometry args={[1.34, 0.045]} />
          <meshBasicMaterial color="#f37de8" />
        </mesh>
        <mesh position={[0, 0.43, 0.235]}>
          <planeGeometry args={[0.72, 0.018]} />
          <meshBasicMaterial color="#b746d8" />
        </mesh>
        <mesh position={[0, 0.19, 0]}>
          <cylinderGeometry args={[0.15, 0.23, 0.42, 8]} />
          <meshStandardMaterial color="#31263b" metalness={0.8} roughness={0.22} />
        </mesh>
        <mesh position={[0, -0.03, 0.02]}>
          <boxGeometry args={[0.9, 0.11, 0.5]} />
          <meshStandardMaterial color="#21192b" metalness={0.85} roughness={0.23} />
        </mesh>
        <mesh position={[0, -0.31, 0.49]} rotation={[-0.12, 0, 0]}>
          <boxGeometry args={[1.58, 0.11, 0.58]} />
          <meshStandardMaterial color="#241b2d" metalness={0.8} roughness={0.28} />
        </mesh>
        {Array.from({ length: 21 }, (_, index) => (
          <mesh key={index} position={[-0.68 + (index % 7) * 0.22, -0.3, 0.43 + Math.floor(index / 7) * 0.17]}>
            <boxGeometry args={[0.14, 0.025, 0.075]} />
            <meshStandardMaterial color={index % 7 === 0 ? '#8e439b' : '#62546f'} metalness={0.45} roughness={0.35} />
          </mesh>
        ))}
      </group>
      <Html portal={portal} position={[0, 0.68, 0.24]} center distanceFactor={4.5} style={{ pointerEvents: 'none' }}>
        <span className="crt-wordmark">SUGRA<span>OS</span></span>
      </Html>
      <PointerHint portal={portal} visible={hovered} position={[0, 1.55, 0.1]} distanceFactor={6}>BOOT THE SYSTEM</PointerHint>
      <pointLight position={[0, 0.72, 0.45]} color="#ee59dd" intensity={hovered ? 2.4 : 1.2} distance={4} />
    </group>
  );
}

function TerminalObject({ onOpen, portal }: { onOpen: () => void; portal: HtmlPortalRef }) {
  const [hovered, setHovered] = useState(false);
  const group = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = Math.sin(clock.elapsedTime * 0.22) * 0.12;
  });
  return (
    <group
      ref={group}
      position={[-3.55, -1.45, -0.55]}
      scale={0.8}
      onClick={(event) => { event.stopPropagation(); onOpen(); }}
      onPointerOver={(event) => { event.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = ''; }}
    >
      <mesh>
        <boxGeometry args={[1.38, 1.08, 0.22]} />
        <meshPhysicalMaterial color="#18101e" metalness={0.8} roughness={0.24} clearcoat={0.7} emissive="#441751" emissiveIntensity={hovered ? 0.45 : 0.2} />
      </mesh>
      <mesh position={[0, 0.08, 0.12]}>
        <planeGeometry args={[1.08, 0.68]} />
        <meshBasicMaterial color="#160c1d" />
      </mesh>
      <mesh position={[-0.3, 0.18, 0.135]}>
        <planeGeometry args={[0.44, 0.028]} />
        <meshBasicMaterial color="#f466dd" />
      </mesh>
      <mesh position={[-0.19, 0.05, 0.136]}>
        <planeGeometry args={[0.65, 0.018]} />
        <meshBasicMaterial color="#a656d4" />
      </mesh>
      <mesh position={[-0.12, -0.08, 0.136]}>
        <planeGeometry args={[0.78, 0.018]} />
        <meshBasicMaterial color="#643d84" />
      </mesh>
      <PointerHint portal={portal} visible={hovered}>OPEN TERMINAL</PointerHint>
    </group>
  );
}

function WorldStage({ onOpen, mobile, htmlPortal }: { onOpen: (app: AppId) => void; mobile: boolean; htmlPortal: HtmlPortalRef }) {
  return (
    <>
      <color attach="background" args={['#08060d']} />
      <fog attach="fog" args={['#08060d', 7, 23]} />
      <ambientLight intensity={0.54} color="#bda0d8" />
      <hemisphereLight args={['#ffd4fa', '#120e1a', 0.85]} />
      <directionalLight position={[-4, 6, 6]} intensity={1.3} color="#fff0fb" />
      <pointLight position={[3, 3, 1]} intensity={3.2} color="#d33ade" distance={11} />
      <pointLight position={[-5, 0, -1]} intensity={2.4} color="#6825c3" distance={9} />
      <Stars radius={42} depth={30} count={mobile ? 420 : 1200} factor={mobile ? 2.5 : 3.4} saturation={0.3} fade speed={0.25} />
      <Sparkles count={mobile ? 36 : 110} scale={[15, 8, 12]} size={mobile ? 2 : 2.6} speed={0.22} opacity={0.6} color="#f391ef" />
      <group>
        <mesh position={[1.1, 0.72, -3.25]} rotation={[0.16, -0.18, -0.23]}>
          <torusGeometry args={[2.05, 0.025, 8, 160]} />
          <meshBasicMaterial color="#a443d6" transparent opacity={0.7} />
        </mesh>
        <mesh position={[1.1, 0.72, -3.3]} rotation={[1.12, -0.14, 0.2]}>
          <torusGeometry args={[2.4, 0.012, 6, 120]} />
          <meshBasicMaterial color="#fa55dc" transparent opacity={0.55} />
        </mesh>
        <mesh position={[-4.2, 1.05, -4.1]} rotation={[0, 0.24, 0.12]}>
          <torusGeometry args={[1.22, 0.035, 10, 96]} />
          <meshStandardMaterial color="#512362" emissive="#bc30cd" emissiveIntensity={0.8} metalness={0.75} roughness={0.25} />
        </mesh>
        <mesh position={[0, -2.42, -1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[40, 38]} />
          <meshStandardMaterial color="#08070d" metalness={0.56} roughness={0.44} />
        </mesh>
        <gridHelper args={[34, 34, '#5b2472', '#261532']} position={[0, -2.395, -1]} />
        <mesh position={[0, -2.35, -1.1]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.4, 5.4, 88]} />
          <meshBasicMaterial color="#732579" transparent opacity={0.17} side={2} />
        </mesh>
      </group>
      <Float speed={0.9} rotationIntensity={0.12} floatIntensity={0.24}>
        <group position={[-4.2, 1.02, -4.05]} onClick={() => onOpen('world')}>
          <mesh onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = ''; }}>
            <torusGeometry args={[1.23, 0.055, 10, 96]} />
            <meshBasicMaterial color="#f07ada" transparent opacity={0.72} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <sphereGeometry args={[0.92, 36, 24]} />
            <meshBasicMaterial color="#171022" transparent opacity={0.74} />
          </mesh>
        </group>
      </Float>
      <SugarOrb portal={htmlPortal} onOpen={() => onOpen('sugra')} />
      <EyeObject portal={htmlPortal} onOpen={() => onOpen('lore')} position={[-3.0, 0.52, -0.15]} scale={0.7} />
      <EyeObject portal={htmlPortal} onOpen={() => onOpen('lore')} position={[4.75, 1.75, -3.3]} scale={0.43} />
      <SugarCube portal={htmlPortal} onOpen={() => onOpen('gallery')} position={[-1.95, -0.55, 0.6]} scale={0.72} rotation={0.3} />
      <SugarCube portal={htmlPortal} onOpen={() => onOpen('gallery')} position={[4.9, -0.15, -1.9]} scale={0.42} rotation={0.8} />
      <SugarCube portal={htmlPortal} onOpen={() => onOpen('gallery')} position={[-4.1, 2.35, -3.7]} scale={0.36} rotation={0.5} />
      <RetroComputer portal={htmlPortal} onOpen={() => onOpen('sugra')} />
      <TerminalObject portal={htmlPortal} onOpen={() => onOpen('terminal')} />
      <Float speed={0.6} rotationIntensity={0.12} floatIntensity={0.16}>
        <mesh position={[5.4, 2.35, -6.3]} rotation={[0.3, 0.4, 0.4]}>
          <octahedronGeometry args={[0.55, 0]} />
          <meshPhysicalMaterial color="#9e6fd6" metalness={0.78} roughness={0.18} emissive="#45156d" emissiveIntensity={0.45} />
        </mesh>
      </Float>
    </>
  );
}

export default function WorldScene({ focused, onOpen }: WorldSceneProps) {
  const htmlPortal = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 700px)');
    const update = () => setIsMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return (
    <div className="world-canvas" aria-label="Interactive 3D SUGRA world">
      <div ref={htmlPortal} className="world-html-layer" aria-hidden="true" />
      <Canvas
        dpr={isMobile ? [1, 1.2] : [1, 1.65]}
        camera={{ position: [0, 0.2, 9.5], fov: isMobile ? 54 : 46, near: 0.1, far: 70 }}
        gl={{ alpha: false, antialias: !isMobile, powerPreference: 'high-performance' }}
        performance={{ min: 0.55 }}
      >
        <WorldStage onOpen={onOpen} mobile={isMobile} htmlPortal={htmlPortal} />
        <FocusDriver focused={focused} />
      </Canvas>
    </div>
  );
}

function FocusDriver({ focused }: { focused: boolean }) {
  const home = useMemo(() => new Vector3(0, 0.2, 9.5), []);
  const system = useMemo(() => new Vector3(1.15, 0.15, 8.3), []);
  const homeLook = useMemo(() => new Vector3(0, 0.05, -1.1), []);
  const systemLook = useMemo(() => new Vector3(1.05, -0.2, -0.6), []);
  const targetPosition = useMemo(() => new Vector3(), []);
  useFrame(({ camera, pointer }, delta) => {
    const blend = 1 - Math.exp(-delta * 1.15);
    targetPosition.copy(focused ? system : home);
    targetPosition.x += pointer.x * 0.16;
    targetPosition.y += pointer.y * 0.09;
    camera.position.lerp(targetPosition, blend);
    camera.lookAt(focused ? systemLook : homeLook);
  });
  return null;
}
