import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { STATIONS, EDGES, TRANSIT_LINES, stationToWorld, getStationColor } from '../data/cairoNetwork';

interface NetworkMap3DProps {
  selectedLine: string | null;
  selectedStation: string | null;
  onSelectStation: (stationId: string | null) => void;
  onResetView?: () => void;
}

interface CameraState {
  theta: number;
  phi: number;
  radius: number;
  targetTheta: number;
  targetPhi: number;
  targetRadius: number;
  targetPosition: THREE.Vector3 | null;
  isAnimating: boolean;
}

export default function NetworkMap3D({
  selectedLine,
  selectedStation,
  onSelectStation,
}: NetworkMap3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const stationMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const edgeLinesRef = useRef<Map<string, THREE.Line>>(new Map());
  const edgePulseMeshesRef = useRef<THREE.Mesh[]>([]);
  const pulseDataRef = useRef<{ edge: typeof EDGES[0]; progress: number }[]>([]);
  const cameraStateRef = useRef<CameraState>({
    theta: Math.PI / 4,
    phi: Math.PI / 3,
    radius: 150,
    targetTheta: Math.PI / 4,
    targetPhi: Math.PI / 3,
    targetRadius: 150,
    targetPosition: null,
    isAnimating: false,
  });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);

  const updateCamera = useCallback(() => {
    if (!cameraRef.current || !sceneRef.current) return;
    const state = cameraStateRef.current;
    const { x, y, z } = sceneRef.current.position;

    const targetX = state.targetPosition ? state.targetPosition.x : x;
    const targetY = state.targetPosition ? state.targetPosition.y : y;
    const targetZ = state.targetPosition ? state.targetPosition.z : z;

    cameraRef.current.position.set(
      targetX + state.radius * Math.sin(state.phi) * Math.cos(state.theta),
      targetY + state.radius * Math.cos(state.phi),
      targetZ + state.radius * Math.sin(state.phi) * Math.sin(state.theta)
    );
    cameraRef.current.lookAt(targetX, targetY, targetZ);
  }, []);

  const animateCamera = useCallback(() => {
    const state = cameraStateRef.current;
    if (state.isAnimating) {
      state.theta += (state.targetTheta - state.theta) * 0.05;
      state.phi += (state.targetPhi - state.phi) * 0.05;
      state.radius += (state.targetRadius - state.radius) * 0.05;

      if (
        Math.abs(state.targetTheta - state.theta) < 0.001 &&
        Math.abs(state.targetPhi - state.phi) < 0.001 &&
        Math.abs(state.targetRadius - state.radius) < 0.1
      ) {
        state.isAnimating = false;
      }
    }
    updateCamera();
  }, [updateCamera]);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020b18);
    scene.fog = new THREE.FogExp2(0x020b18, 0.0015);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.set(100, 80, 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0x112233, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    scene.add(directionalLight);

    const gridHelper = new THREE.GridHelper(600, 40, 0x0a1628, 0x0a1628);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 500 + Math.random() * 500;
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.cos(phi);
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1, sizeAttenuation: false });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const filteredEdges = selectedLine
      ? EDGES.filter(e => e.line === selectedLine)
      : EDGES;

    const visibleStationIds = new Set<string>();
    filteredEdges.forEach(edge => {
      visibleStationIds.add(edge.from);
      visibleStationIds.add(edge.to);
    });

    const edgesByLine = new Map<string, THREE.Line[]>();
    filteredEdges.forEach(edge => {
      const fromStation = STATIONS.find(s => s.id === edge.from);
      const toStation = STATIONS.find(s => s.id === edge.to);
      if (!fromStation || !toStation) return;

      const start = stationToWorld(fromStation.lat, fromStation.lng);
      const end = stationToWorld(toStation.lat, toStation.lng);

      const lineColor = new THREE.Color(
        TRANSIT_LINES.find(l => l.id === edge.line)?.color || '#ffffff'
      );

      const coreGeometry = new THREE.BufferGeometry();
      coreGeometry.setAttribute('position', new THREE.BufferAttribute(
        new Float32Array([start.x, start.y, start.z, end.x, end.y, end.z]),
        3
      ));
      const coreMaterial = new THREE.LineBasicMaterial({
        color: lineColor,
        linewidth: 2,
        transparent: true,
        opacity: 0.8,
      });
      const coreLine = new THREE.Line(coreGeometry, coreMaterial);
      scene.add(coreLine);
      edgeLinesRef.current.set(edge.from + '-' + edge.to, coreLine);

      const glowMaterial = new THREE.MeshBasicMaterial({
        color: lineColor,
        transparent: true,
        opacity: 0.15,
      });

      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      const midZ = (start.z + end.z) / 2;
      const length = Math.sqrt(
        Math.pow(end.x - start.x, 2) +
        Math.pow(end.y - start.y, 2) +
        Math.pow(end.z - start.z, 2)
      );
      const direction = new THREE.Vector3(
        (end.x - start.x) / length,
        (end.y - start.y) / length,
        (end.z - start.z) / length
      );
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction
      );
      const glowGeometry = new THREE.CylinderGeometry(1.5, 1.5, length, 8, 1, true);
      glowGeometry.applyQuaternion(quaternion);
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      glowMesh.position.set(midX, midY, midZ);
      scene.add(glowMesh);

      if (!edgesByLine.has(edge.line)) {
        edgesByLine.set(edge.line, []);
      }
      edgesByLine.get(edge.line)?.push(coreLine);
    });

    STATIONS.forEach(station => {
      const isVisible = visibleStationIds.has(station.id);
      const pos = stationToWorld(station.lat, station.lng);
      const color = getStationColor(station.type);

      const baseRadius = station.type === 'hub' ? 4 : station.type === 'capital' ? 5 : 3;
      const geometry = new THREE.SphereGeometry(baseRadius, 24, 24);
      const material = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.3,
        metalness: 0.7,
        roughness: 0.3,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.userData = { stationId: station.id };
      mesh.visible = isVisible;
      scene.add(mesh);
      stationMeshesRef.current.set(station.id, mesh);

      if (station.type === 'hub' || station.type === 'capital') {
        const pointLight = new THREE.PointLight(color, 0.8, 40);
        pointLight.position.set(pos.x, pos.y + 5, pos.z);
        scene.add(pointLight);
      }
    });

    const initPulseAnimations = () => {
      edgePulseMeshesRef.current.forEach(mesh => scene.remove(mesh));
      edgePulseMeshesRef.current = [];
      pulseDataRef.current = [];

      const visibleEdges = filteredEdges.slice(0, 60);
      visibleEdges.forEach(edge => {
        const fromStation = STATIONS.find(s => s.id === edge.from);
        const toStation = STATIONS.find(s => s.id === edge.to);
        if (!fromStation || !toStation) return;

        const lineColor = new THREE.Color(
          TRANSIT_LINES.find(l => l.id === edge.line)?.color || '#ffffff'
        );

        const pulseGeometry = new THREE.SphereGeometry(2.5, 16, 16);
        const pulseMaterial = new THREE.MeshBasicMaterial({
          color: lineColor,
          transparent: true,
          opacity: 0.9,
        });
        const pulseMesh = new THREE.Mesh(pulseGeometry, pulseMaterial);
        pulseMesh.visible = visibleStationIds.has(edge.from) && visibleStationIds.has(edge.to);
        scene.add(pulseMesh);
        edgePulseMeshesRef.current.push(pulseMesh);
        pulseDataRef.current.push({ edge, progress: Math.random() });
      });
    };
    initPulseAnimations();

    const handleResize = () => {
      const w = containerRef.current?.clientWidth || width;
      const h = containerRef.current?.clientHeight || height;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current && cameraRef.current) {
        const deltaX = e.clientX - lastMouseRef.current.x;
        const deltaY = e.clientY - lastMouseRef.current.y;
        lastMouseRef.current = { x: e.clientX, y: e.clientY };

        const state = cameraStateRef.current;
        state.theta -= deltaX * 0.01;
        state.phi = Math.max(0.3, Math.min(Math.PI - 0.3, state.phi + deltaY * 0.01));
        state.isAnimating = false;
        updateCamera();
      }

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshValues = Array.from(stationMeshesRef.current.values()).filter(m => m.visible);
      const intersects = raycaster.intersectObjects(meshValues);

      if (intersects.length > 0) {
        const stationId = (intersects[0].object as THREE.Mesh).userData.stationId;
        setHoveredStation(stationId);
      } else {
        setHoveredStation(null);
      }
    };

    const onClick = (e: MouseEvent) => {
      if (isDraggingRef.current) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshValues = Array.from(stationMeshesRef.current.values()).filter(m => m.visible);
      const intersects = raycaster.intersectObjects(meshValues);

      if (intersects.length > 0) {
        const stationId = (intersects[0].object as THREE.Mesh).userData.stationId;
        onSelectStation(stationId);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const state = cameraStateRef.current;
      state.targetRadius = Math.max(50, Math.min(400, state.radius + e.deltaY * 0.2));
      state.isAnimating = true;
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;
      pulseDataRef.current.forEach((data, index) => {
        const pulseMesh = edgePulseMeshesRef.current[index];
        if (!pulseMesh || !pulseMesh.visible) return;

        data.progress = (data.progress + 0.008) % 1;

        const fromStation = STATIONS.find(s => s.id === data.edge.from);
        const toStation = STATIONS.find(s => s.id === data.edge.to);
        if (!fromStation || !toStation) return;

        const start = stationToWorld(fromStation.lat, fromStation.lng);
        const end = stationToWorld(toStation.lat, toStation.lng);

        pulseMesh.position.set(
          start.x + (end.x - start.x) * data.progress,
          start.y + (end.y - start.y) * data.progress,
          start.z + (end.z - start.z) * data.progress
        );
      });

      animateCamera();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [selectedLine, selectedStation, onSelectStation, updateCamera, animateCamera]);

  useEffect(() => {
    if (!selectedStation || !sceneRef.current) return;

    const station = STATIONS.find(s => s.id === selectedStation);
    if (!station) return;

    const pos = stationToWorld(station.lat, station.lng);
    const state = cameraStateRef.current;
    state.targetPosition = new THREE.Vector3(pos.x, pos.y, pos.z);
    state.targetRadius = 60;
    state.isAnimating = true;
  }, [selectedStation]);

  useEffect(() => {
    stationMeshesRef.current.forEach((mesh, stationId) => {
      const material = mesh.material as THREE.MeshStandardMaterial;
      const isSelected = selectedStation === stationId;
      const isVisible = !selectedLine ||
        STATIONS.find(s => s.id === stationId)?.lines.includes(selectedLine);

      mesh.visible = isVisible;

      if (isSelected) {
        material.emissiveIntensity = 0.8;
        material.color.setHex(0xffffff);
      } else {
        material.emissiveIntensity = 0.3;
        const station = STATIONS.find(s => s.id === stationId);
        if (station) {
          material.color.setHex(getStationColor(station.type));
        }
      }
    });

    edgeLinesRef.current.forEach((line, key) => {
      const parts = key.split('-');
      const fromStation = STATIONS.find(s => s.id === parts[0]);
      const isVisible = !selectedLine || fromStation?.lines.includes(selectedLine);
      line.visible = isVisible;
    });
  }, [selectedLine, selectedStation]);

  const hoveredStationData = hoveredStation
    ? STATIONS.find(s => s.id === hoveredStation)
    : null;

  return (
    <div className="network-map-3d-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} className="network-map-canvas" style={{ width: '100%', height: '100%' }} />
      {hoveredStationData && (
        <div
          className="tooltip"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -150%)',
            background: 'rgba(4, 15, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 212, 255, 0.4)',
            borderRadius: '8px',
            padding: '12px 16px',
            zIndex: 100,
            pointerEvents: 'none',
            boxShadow: '0 0 30px rgba(0, 212, 255, 0.3)',
          }}
        >
          <div style={{ color: '#00d4ff', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
            {hoveredStationData.name}
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {hoveredStationData.lines.map(lineId => {
              const line = TRANSIT_LINES.find(l => l.id === lineId);
              return (
                <span
                  key={lineId}
                  style={{
                    background: line?.color,
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  {lineId}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}