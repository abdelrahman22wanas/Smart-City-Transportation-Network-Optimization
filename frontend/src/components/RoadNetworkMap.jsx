import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { neighborhoods, facilities, existingRoads, potentialNewRoads, normalizeRoadId } from '../data/cairoData';

const minX = 30.94;
const maxX = 31.80;
const minY = 29.85;
const maxY = 30.11;
const width = 1600;
const height = 1000;

function projectNode(node) {
  const x = ((node.x - minX) / (maxX - minX)) * width + 80;
  const y = height - ((node.y - minY) / (maxY - minY)) * height - 50;
  return { x, y };
}

function getNodeType(node) {
  if (String(node.id).startsWith('F')) return 'facility';
  return 'neighborhood';
}

export default function RoadNetworkMap({
  highlightedRoadIds = [],
  highlightedEdges = [],
  highlightedNodeIds = [],
  primaryPath = [],
  secondaryPath = [],
  showBaseNetwork = false,
  showPotentialRoads = false,
  animationDelay = 400,
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(1); // start at 1 so base network is fully visible
  const animationRef = useRef(null);

  const allNodesData = useMemo(() => [...neighborhoods, ...facilities], []);
  const nodeById = useMemo(
    () => new Map(allNodesData.map((node) => [node.id, node])),
    [allNodesData],
  );

  const allEdges = useMemo(() => {
    const roads = showPotentialRoads ? [...existingRoads, ...potentialNewRoads] : existingRoads;
    return roads.map((road, index) => {
      const fromNode = allNodesData.find(n => n.id === road.from);
      const toNode = allNodesData.find(n => n.id === road.to);
      if (!fromNode || !toNode) return null;

      const roadId = normalizeRoadId(road.from, road.to);
      const start = projectNode(fromNode);
      const end = projectNode(toNode);
      const length = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
      );

      return {
        id: roadId,
        index,
        from: road.from,
        to: road.to,
        start,
        end,
        length,
        distance_km: road.distance_km,
      };
    }).filter(Boolean);
  }, [allNodesData, showPotentialRoads]);

  const primaryHighlightedIds = useMemo(() =>
    new Set(highlightedRoadIds.map(id => String(id).trim()).filter(Boolean)),
    [highlightedRoadIds]
  );

  const highlightedEdgeGeometry = useMemo(() => {
    if (!highlightedEdges.length) return [];
    return highlightedEdges
      .map((edge, index) => {
        const fromNode = nodeById.get(edge.from);
        const toNode = nodeById.get(edge.to);
        if (!fromNode || !toNode) return null;
        return {
          id: edge.road_id ? String(edge.road_id).trim() : normalizeRoadId(edge.from, edge.to),
          index,
          start: projectNode(fromNode),
          end: projectNode(toNode),
        };
      })
      .filter(Boolean);
  }, [highlightedEdges, nodeById]);

  const secondaryHighlightedIds = useMemo(() =>
    new Set(secondaryPath.map(id => String(id).trim()).filter(Boolean)),
    [secondaryPath]
  );

  const sortedHighlightedEdges = useMemo(() => {
    return allEdges
      .filter(e => primaryHighlightedIds.has(e.id))
      .sort((a, b) => a.index - b.index);
  }, [allEdges, primaryHighlightedIds]);

  // Only animate when highlighted roads actually change to a non-empty set
  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const hasHighlightedRoads = highlightedRoadIds.length > 0 || highlightedEdgeGeometry.length > 0;
    if (!hasHighlightedRoads || (sortedHighlightedEdges.length === 0 && highlightedEdgeGeometry.length === 0)) {
      setIsAnimating(false);
      setAnimationProgress(1);
      return;
    }

    setIsAnimating(true);
    setAnimationProgress(0);

    const duration = 1800;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimationProgress(eased);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setAnimationProgress(1);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [highlightedRoadIds, highlightedEdgeGeometry.length, sortedHighlightedEdges.length]);

  const handleZoomIn = useCallback(() => setZoom(z => Math.min(z + 0.3, 3)), []);
  const handleZoomOut = useCallback(() => setZoom(z => Math.max(z - 0.3, 0.5)), []);
  const handleReset = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, []);

  const handleMouseDown = useCallback((e) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;

  const isNodeHighlighted = (nodeId) => highlightedNodeIds.includes(nodeId);

  const isNodePrimaryPath = (nodeId) => {
    if (!primaryPath || primaryPath.length === 0) return false;
    return primaryPath.includes(String(nodeId));
  };

  const getNodeColor = (node) => {
    const nodeId = node.id;
    if (isNodeHighlighted(nodeId)) return '#FFD700';
    if (isNodePrimaryPath(nodeId)) return '#00FF88';
    if (getNodeType(node) === 'facility') return '#FF6B35';
    return '#00B4D8';
  };

  // FIX: draw from start → animated endpoint (not from animated midpoint → end)
  const renderEdgeWithAnimation = (edge, color, isPrimary) => {
    const isInPrimary = primaryHighlightedIds.has(edge.id);
    const isInSecondary = secondaryHighlightedIds.has(edge.id);
    if (!isInPrimary && !isInSecondary) return null;

    const strokeWidth = isPrimary ? 5 : 4;
    const glowFilter = isPrimary ? 'url(#primaryPathGlow)' : 'url(#roadGlow)';

    // Animated endpoint: grows from start toward end
    const animX2 = edge.start.x + (edge.end.x - edge.start.x) * animationProgress;
    const animY2 = edge.start.y + (edge.end.y - edge.start.y) * animationProgress;

    return (
      <g key={`highlight-${edge.id}`}>
        {/* Outer glow */}
        <line
          x1={edge.start.x}
          y1={edge.start.y}
          x2={animX2}
          y2={animY2}
          stroke={color}
          strokeWidth={strokeWidth + 8}
          strokeLinecap="round"
          opacity={0.12}
          filter={glowFilter}
        />
        {/* Mid glow */}
        <line
          x1={edge.start.x}
          y1={edge.start.y}
          x2={animX2}
          y2={animY2}
          stroke={color}
          strokeWidth={strokeWidth + 3}
          strokeLinecap="round"
          opacity={0.25}
          filter={glowFilter}
        />
        {/* Core line — THE FIX: x1/y1 = start, x2/y2 = animated endpoint */}
        <line
          x1={edge.start.x}
          y1={edge.start.y}
          x2={animX2}
          y2={animY2}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter={glowFilter}
          opacity={isAnimating ? 1 : 0.92}
        />
      </g>
    );
  };

  return (
    <div className="road-network-map">
      <div className="road-map-toolbar">
        <div className="toolbar-group">
          <button type="button" className="map-tool-btn" onClick={handleZoomIn} title="Zoom In">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button type="button" className="map-tool-btn" onClick={handleZoomOut} title="Zoom Out">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button type="button" className="map-tool-btn" onClick={handleReset} title="Reset View">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
        <div className="toolbar-info">
          {highlightedRoadIds.length > 0 || highlightedEdgeGeometry.length > 0 ? (
            <span className="path-count">
              <span className="count-badge">{highlightedRoadIds.length || highlightedEdgeGeometry.length}</span>
              edges highlighted
              {isAnimating && <span className="animating-indicator"> • Drawing...</span>}
            </span>
          ) : (
            <span className="toolbar-hint">Click "Run" to visualize algorithm output</span>
          )}
        </div>
      </div>

      <div
        className="road-map-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <svg
          viewBox="-50 -100 1800 1200"
          preserveAspectRatio="xMidYMid meet"
          className="road-map-svg"
          style={{ transform, transformOrigin: 'center' }}
        >
          <defs>
            <filter id="roadGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="primaryPathGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="pulseGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect x="0" y="0" width="1760" height="1100" fill="#060d18" />

          {/* Subtle grid */}
          <g className="grid-lines" opacity={0.04}>
            {Array.from({ length: 25 }).map((_, i) => (
              <React.Fragment key={i}>
                <line x1="0" y1={i * 45} x2="1760" y2={i * 45} stroke="#4a9eff" strokeWidth={1} />
                <line x1={i * 70} y1="0" x2={i * 70} y2="1100" stroke="#4a9eff" strokeWidth={1} />
              </React.Fragment>
            ))}
          </g>

          {/* ── BASE NETWORK ──
              FIX: color changed from near-invisible #0f2942 to a readable #1e4a7a,
              opacity raised from 0.35 → 0.55 so roads are clearly visible */}
          {showBaseNetwork && (
            <g className="base-network">
              {allEdges.map((edge) => {
                const isPrimaryHighlighted = primaryHighlightedIds.has(edge.id);
                const isSecondaryHighlighted = secondaryHighlightedIds.has(edge.id);

                // Don't draw the dim base line under a highlighted edge
                if (isPrimaryHighlighted || isSecondaryHighlighted) return null;

                return (
                  <g key={edge.id}>
                    {/* Soft glow behind the road */}
                    <line
                      x1={edge.start.x}
                      y1={edge.start.y}
                      x2={edge.end.x}
                      y2={edge.end.y}
                      stroke="#4a9eff"
                      strokeWidth={5}
                      strokeLinecap="round"
                      opacity={0.12}
                    />
                    {/* Main road line — bright enough to be clearly visible */}
                    <line
                      x1={edge.start.x}
                      y1={edge.start.y}
                      x2={edge.end.x}
                      y2={edge.end.y}
                      stroke="#3a7bd5"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      opacity={0.85}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Highlighted / animated edges */}
          <g className="highlighted-network">
            {highlightedEdgeGeometry.length > 0
              ? highlightedEdgeGeometry.map((edge) => (
                  <g key={`highlight-${edge.id}`}>
                    <line
                      x1={edge.start.x}
                      y1={edge.start.y}
                      x2={edge.start.x + (edge.end.x - edge.start.x) * animationProgress}
                      y2={edge.start.y + (edge.end.y - edge.start.y) * animationProgress}
                      stroke="#00FF88"
                      strokeWidth={5}
                      strokeLinecap="round"
                      opacity={0.92}
                      filter="url(#primaryPathGlow)"
                    />
                  </g>
                ))
              : allEdges.map((edge) => {
                  if (primaryHighlightedIds.has(edge.id)) {
                    return renderEdgeWithAnimation(edge, '#00FF88', true);
                  }
                  if (secondaryHighlightedIds.has(edge.id)) {
                    return renderEdgeWithAnimation(edge, '#FF00FF', false);
                  }
                  return null;
                })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {allNodesData.map((node) => {
              const point = projectNode(node);
              const nodeId = node.id;
              const isHighlighted = isNodeHighlighted(nodeId);
              const isInPath = isNodePrimaryPath(nodeId);
              const isHovered = hoveredNode === nodeId;
              const isFacility = getNodeType(node) === 'facility';

              const color = getNodeColor(node);
              const baseRadius = isHighlighted ? 14 : isInPath ? 12 : isFacility ? 10 : 8;
              const showLabel = isHighlighted || isInPath || isHovered;

              return (
                <g
                  key={nodeId}
                  transform={`translate(${point.x}, ${point.y})`}
                  onMouseEnter={() => setHoveredNode(nodeId)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: 'pointer' }}
                  className="node-group"
                >
                  {(isHighlighted || isInPath) && (
                    <circle
                      r={baseRadius + 10}
                      fill="none"
                      stroke={color}
                      strokeWidth={2}
                      opacity={0}
                      filter="url(#pulseGlow)"
                      className="pulse-ring"
                    />
                  )}
                  {(isHighlighted || isInPath) && (
                    <circle
                      r={baseRadius + 6}
                      fill="none"
                      stroke={color}
                      strokeWidth={2}
                      opacity={0.3}
                      filter="url(#nodeGlow)"
                    />
                  )}
                  {isFacility ? (
                    <rect
                      x={-baseRadius}
                      y={-baseRadius}
                      width={baseRadius * 2}
                      height={baseRadius * 2}
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth={isHovered ? 3 : 2}
                      rx={3}
                      filter={isHighlighted || isInPath ? 'url(#nodeGlow)' : 'none'}
                      className="node-shape"
                    />
                  ) : (
                    <circle
                      r={baseRadius}
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth={isHovered ? 3 : 2}
                      filter={isHighlighted || isInPath ? 'url(#nodeGlow)' : 'none'}
                      className="node-shape"
                    />
                  )}
                  {showLabel && (
                    <g className="node-label-group">
                      <rect
                        x={-45}
                        y={baseRadius + 4}
                        width={90}
                        height={22}
                        fill="#0d1f35"
                        rx={4}
                        opacity={0.92}
                      />
                      <text
                        y={baseRadius + 19}
                        textAnchor="middle"
                        className="node-label"
                        fill={color}
                        fontSize="11"
                        fontWeight="600"
                      >
                        {node.name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Path order numbers */}
          {primaryPath.length > 0 && (
            <g className="path-order-numbers">
              {primaryPath.map((nodeId, index) => {
                const node = allNodesData.find(n => String(n.id) === String(nodeId));
                if (!node) return null;
                const point = projectNode(node);

                return (
                  <g
                    key={`order-${nodeId}-${index}`}
                    transform={`translate(${point.x}, ${point.y})`}
                    className="order-number"
                    style={{
                      opacity: isAnimating ? Math.min(1, animationProgress * primaryPath.length - index + 1) : 1,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    <circle r="13" fill="#00FF88" stroke="#060d18" strokeWidth="2" />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#060d18"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {index + 1}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      </div>

      <div className="road-map-legend">
        <span className="legend-item">
          <span className="legend-dot neighborhood" />
          Neighborhood
        </span>
        <span className="legend-item">
          <span className="legend-dot facility" />
          Facility
        </span>
        {primaryPath.length > 0 && (
          <span className="legend-item">
            <span className="legend-dot path" />
            Path
          </span>
        )}
        {secondaryPath.length > 0 && (
          <span className="legend-item">
            <span className="legend-dot secondary" />
            Secondary
          </span>
        )}
        <span className="legend-hint">Drag to pan • Scroll to zoom</span>
      </div>

      <style>{`
        .road-network-map {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #060d18;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #0f2942;
        }

        .road-map-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: linear-gradient(180deg, #0a1525 0%, #070d1a 100%);
          border-bottom: 1px solid #0f2942;
        }

        .toolbar-group { display: flex; gap: 6px; }

        .map-tool-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #1e4976;
          border-radius: 6px;
          background: rgba(30, 73, 118, 0.3);
          color: #4a9eff;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .map-tool-btn:hover {
          background: rgba(30, 73, 118, 0.6);
          border-color: #4a9eff;
          transform: translateY(-1px);
        }

        .toolbar-info { display: flex; align-items: center; gap: 8px; }

        .path-count {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #00FF88;
          font-size: 13px;
          font-weight: 500;
        }

        .count-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          height: 24px;
          padding: 0 8px;
          background: rgba(0, 255, 136, 0.15);
          border: 1px solid #00FF88;
          border-radius: 12px;
          font-weight: 600;
        }

        .animating-indicator {
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .toolbar-hint { color: #4a6a85; font-size: 13px; }

        .road-map-container {
          flex: 1;
          overflow: hidden;
          background: #060d18;
        }

        .road-map-svg {
          width: 100%;
          height: 100%;
          transition: transform 0.15s ease-out;
        }

        .node-group { transition: transform 0.2s ease; }
        .node-group:hover { transform: scale(1.1); }

        .node-label {
          font-family: 'JetBrains Mono', 'SF Mono', monospace;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
        }

        @keyframes pulse {
          0%, 100% { opacity: 0; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }

        .pulse-ring { animation: pulse 2s ease-in-out infinite; }

        .road-map-legend {
          display: flex;
          gap: 20px;
          padding: 12px 16px;
          background: linear-gradient(180deg, #070d1a 0%, #0a1525 100%);
          border-top: 1px solid #0f2942;
          flex-wrap: wrap;
          align-items: center;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6b8299;
          font-size: 12px;
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .legend-dot.neighborhood { background: #00B4D8; }
        .legend-dot.facility { background: #FF6B35; border-radius: 3px; }
        .legend-dot.path { background: #00FF88; box-shadow: 0 0 8px rgba(0,255,136,0.6); }
        .legend-dot.secondary { background: #FF00FF; box-shadow: 0 0 8px rgba(255,0,255,0.6); }

        .legend-hint { margin-left: auto; color: #3a4a65; font-size: 11px; }

        .order-number { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .order-number:hover { transform: scale(1.15); }
      `}</style>
    </div>
  );
}
