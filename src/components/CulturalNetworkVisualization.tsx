import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface NetworkNode {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  color: string;
}

interface NetworkLink {
  source: string;
  target: string;
  strength: number;
}

interface CulturalNetworkVisualizationProps {
  connections: any[];
  entities: { [key: string]: any[] };
  width?: number;
  height?: number;
}

const CulturalNetworkVisualization: React.FC<CulturalNetworkVisualizationProps> = ({
  connections,
  entities,
  width = 800,
  height = 600
}) => {
  const { nodes, links } = useMemo(() => {
    const nodeMap = new Map<string, NetworkNode>();
    const networkLinks: NetworkLink[] = [];

    // First, identify all entities that have connections
    const connectedEntityIds = new Set<string>();
    connections.forEach(connection => {
      connectedEntityIds.add(connection.fromEntity.id);
      connectedEntityIds.add(connection.toEntity.id);
    });

    console.log(`📊 Network filtering: ${connectedEntityIds.size} connected entities out of ${Object.values(entities).reduce((sum, arr) => sum + arr.length, 0)} total`);

    // Only create nodes for connected entities
    const entityTypes = Object.keys(entities);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;

    // Color mapping for entity types
    const colorMap: { [key: string]: string } = {
      'places': '#f97316',
      'music': '#ec4899',
      'movies': '#8b5cf6',
      'books': '#10b981',
      'tv_shows': '#6366f1',
      'destinations': '#3b82f6',
      'podcasts': '#14b8a6',
      'brands': '#6b7280'
    };

    // Filter entities to only include connected ones and position them
    entityTypes.forEach((entityType, typeIndex) => {
      const connectedEntitiesOfType = entities[entityType].filter(entity => 
        connectedEntityIds.has(entity.id)
      );
      
      if (connectedEntitiesOfType.length === 0) return;

      const angle = (typeIndex / entityTypes.length) * 2 * Math.PI;
      const typeX = centerX + Math.cos(angle) * radius;
      const typeY = centerY + Math.sin(angle) * radius;
      
      const color = colorMap[entityType] || '#6b7280';

      // Add nodes for connected entities of this type
      connectedEntitiesOfType.forEach((entity: any, entityIndex: number) => {
        const entityAngle = angle + (entityIndex - connectedEntitiesOfType.length / 2) * 0.4;
        const entityRadius = radius + (entityIndex % 2 ? 60 : -60);
        
        const nodeX = centerX + Math.cos(entityAngle) * entityRadius;
        const nodeY = centerY + Math.sin(entityAngle) * entityRadius;

        nodeMap.set(entity.id, {
          id: entity.id,
          name: entity.name,
          type: entityType,
          x: nodeX,
          y: nodeY,
          color
        });
      });
    });

    // Create links from connections (all should be valid now)
    connections.forEach(connection => {
      const sourceNode = nodeMap.get(connection.fromEntity.id);
      const targetNode = nodeMap.get(connection.toEntity.id);
      
      if (sourceNode && targetNode) {
        networkLinks.push({
          source: connection.fromEntity.id,
          target: connection.toEntity.id,
          strength: connection.connectionStrength
        });
      }
    });

    console.log(`📊 Network created: ${nodeMap.size} nodes, ${networkLinks.length} links`);

    return {
      nodes: Array.from(nodeMap.values()),
      links: networkLinks
    };
  }, [connections, entities, width, height]);

  const getNodeRadius = (type: string) => {
    const radiusMap: { [key: string]: number } = {
      'places': 8,
      'music': 6,
      'movies': 6,
      'books': 5,
      'tv_shows': 6,
      'destinations': 7,
      'podcasts': 5,
      'brands': 5
    };
    return radiusMap[type] || 5;
  };

  // If no connections, show empty state
  if (connections.length === 0 || nodes.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">Cultural Connection Network</h3>
        <div className="flex items-center justify-center h-64 text-center">
          <div className="text-neutral-500">
            <div className="text-6xl mb-4">🔍</div>
            <h4 className="text-lg font-medium text-neutral-700 mb-2">
              Building Cultural Connections
            </h4>
            <p className="text-sm text-neutral-500 max-w-md">
              We're analyzing relationships between your recommendations. 
              Connections will appear as we discover shared themes and cultural affinities.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">Cultural Connection Network</h3>
      <div className="text-sm text-neutral-600 mb-4">
        Showing only entities with cultural connections ({nodes.length} of {Object.values(entities).reduce((sum, arr) => sum + arr.length, 0)} total recommendations)
      </div>
      <div className="relative">
        <svg width={width} height={height} className="border border-neutral-100 rounded-lg">
          {/* Background */}
          <rect width={width} height={height} fill="#fafafa" />
          
          {/* Links */}
          <g>
            {links.map((link, index) => {
              const sourceNode = nodes.find(n => n.id === link.source);
              const targetNode = nodes.find(n => n.id === link.target);
              
              if (!sourceNode || !targetNode) return null;
              
              const opacity = Math.max(0.3, link.strength);
              const strokeWidth = Math.max(1.5, link.strength * 4);
              
              return (
                <motion.line
                  key={index}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke="#6366f1"
                  strokeWidth={strokeWidth}
                  strokeOpacity={opacity}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                />
              );
            })}
          </g>
          
          {/* Nodes */}
          <g>
            {nodes.map((node, index) => (
              <motion.g
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={getNodeRadius(node.type)}
                  fill={node.color}
                  stroke="white"
                  strokeWidth="2"
                  className="hover:stroke-neutral-400 transition-colors cursor-pointer"
                />
                
                {/* Node labels */}
                <text
                  x={node.x}
                  y={node.y + getNodeRadius(node.type) + 15}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6b7280"
                  className="pointer-events-none"
                >
                  <tspan>
                    {node.name.length > 15 ? `${node.name.substring(0, 15)}...` : node.name}
                  </tspan>
                </text>
              </motion.g>
            ))}
          </g>
        </svg>
        
        {/* Legend - only show entity types that have connected entities */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-neutral-200">
          <h4 className="text-sm font-medium text-neutral-800 mb-2">Connected Domains</h4>
          <div className="space-y-1">
            {[...new Set(nodes.map(n => n.type))].map(entityType => {
              const color = nodes.find(n => n.type === entityType)?.color || '#6b7280';
              const count = nodes.filter(n => n.type === entityType).length;
              return (
                <div key={entityType} className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className="text-xs text-neutral-600 capitalize">{entityType}</span>
                  </div>
                  <span className="text-xs text-neutral-500">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Connection Stats */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-neutral-200">
          <div className="text-sm text-neutral-600">
            <div><strong>{nodes.length}</strong> connected entities</div>
            <div><strong>{links.length}</strong> cultural connections</div>
            <div><strong>{[...new Set(nodes.map(n => n.type))].length}</strong> active domains</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalNetworkVisualization; 