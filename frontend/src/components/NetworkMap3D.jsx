import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { STATIONS, EDGES, TRANSIT_LINES, stationToWorld, getStationColor } from '../data/cairoNetwork';

export default function NetworkMap3D({ 
  selectedLine, 
  selectedStation, 
  onSelectStation 
}) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const stationMeshesRef = useRef(new Map());
  const [hoveredStation, setHoveredStation] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020b18);
    scene.fog = new THREE.Fog(0x020b18, 200, 500);
    sceneRef.current = scene;

    // Camera
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
    camera.position.set(0, 80, 100);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(50, 100, 50);
    scene.add(pointLight);

    // Grid floor
    const gridHelper = new THREE.GridHelper(400, 50, 0x1a1a2e, 0x16213e);
    scene.add(gridHelper);

    // Draw edges
    const edgesByLine = new Map();
    EDGES.forEach((edge) => {
      const fromStation = STATIONS.find(s => s.id === edge.from);
      const toStation = STATIONS.find(s => s.id === edge.to);
      if (!fromStation || !toStation) return;

      const start = stationToWorld(fromStation.lat, fromStation.lng);
      const end = stationToWorld(toStation.lat, toStation.lng);

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(
        new Float32Array([start.x, start.y, start.z, end.x, end.y, end.z]),
        3
      ));

      const line = TRANSIT_LINES.find(l => l.id === edge.line);
      const color = new THREE.Color(line?.color || '#ffffff');

      const material = new THREE.LineBasicMaterial({
        color,
        linewidth: 3,
        fog: false,
      });

      const lineObj = new THREE.Line(geometry, material);
      scene.add(lineObj);

      if (!edgesByLine.has(edge.line)) {
        edgesByLine.set(edge.line, []);
      }
      edgesByLine.get(edge.line)?.push(lineObj);
    });

    // Draw stations
    stationMeshesRef.current.clear();
    STATIONS.forEach((station) => {
      const pos = stationToWorld(station.lat, station.lng);
      const color = getStationColor(station.type);

      const geometry = new THREE.SphereGeometry(3, 16, 16);
      const material = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.3,
        metalness: 0.6,
        roughness: 0.3,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.userData = { stationId: station.id };
      scene.add(mesh);
      stationMeshesRef.current.set(station.id, mesh);

      // Point light for hubs
      if (station.type === 'hub' || station.type === 'capital') {
        const light = new THREE.PointLight(color, 1, 50);
        light.position.copy(mesh.position);
        scene.add(light);
      }
    });

    // Handle window resize
    const handleResize = () => {
      const w = containerRef.current?.clientWidth || width;
      const h = containerRef.current?.clientHeight || height;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Raycaster for hover/click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Array.from(stationMeshesRef.current.values()));

      if (intersects.length > 0) {
        const stationId = intersects[0].object.userData.stationId;
        setHoveredStation(stationId);
      } else {
        setHoveredStation(null);
      }
    };

    const onClick = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Array.from(stationMeshesRef.current.values()));

      if (intersects.length > 0) {
        const stationId = intersects[0].object.userData.stationId;
        onSelectStation(stationId);
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    // Update visibility based on selectedLine
    STATIONS.forEach((station) => {
      const mesh = stationMeshesRef.current.get(station.id);
      if (!mesh) return;

      const visible = !selectedLine || station.lines.includes(selectedLine);
      mesh.visible = visible;

      // Highlight selected station
      const material = mesh.material;
      if (selectedStation === station.id) {
        material.emissiveIntensity = 0.8;
        material.wireframe = false;
      } else {
        material.emissiveIntensity = 0.3;
      }
    });

    // Update edge visibility
    edgesByLine.forEach((lines, lineId) => {
      const visible = !selectedLine || selectedLine === lineId;
      lines.forEach(line => {
        line.visible = visible;
      });
    });

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [selectedLine, selectedStation, onSelectStation]);

  const hoveredStationName = hoveredStation 
    ? STATIONS.find(s => s.id === hoveredStation)?.name 
    : null;

  return (
    <div className="network-map-3d-container">
      <div ref={containerRef} className="network-map-canvas" />
      {hoveredStationName && (
        <div className="tooltip">
          {hoveredStationName}
        </div>
      )}
    </div>
  );
}
