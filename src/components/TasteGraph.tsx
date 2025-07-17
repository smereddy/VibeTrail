import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const TasteGraph: React.FC = () => {
  const { currentCity } = useApp();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // Create nodes from seeds and recommendations
    const nodes = [
      ...currentCity.seeds.map(seed => ({
        id: seed.id,
        name: seed.text,
        type: 'seed',
        category: seed.category,
        value: seed.confidence
      })),
      ...currentCity.recommendations.map(rec => ({
        id: rec.id,
        name: rec.name,
        type: 'recommendation',
        category: rec.category,
        value: rec.tasteStrength
      }))
    ];

    // Create links from relationships
    const links = currentCity.relationships.map(rel => ({
      source: rel.source,
      target: rel.target,
      strength: rel.strength,
      reason: rel.reason
    }));

    // Color scale for different categories
    const colorScale = d3.scaleOrdinal<string>()
      .domain(['seed', 'food', 'activity', 'media'])
      .range(['#8B5CF6', '#F59E0B', '#10B981', '#EF4444']);

    // Create simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).strength(d => d.strength))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Create SVG container
    const container = svg
      .attr('width', width)
      .attr('height', height);

    // Create tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '1000');

    // Create links
    const link = container.selectAll('.link')
      .data(links)
      .enter().append('line')
      .attr('class', 'link')
      .style('stroke', '#999')
      .style('stroke-width', (d: any) => Math.sqrt(d.strength * 5))
      .style('opacity', 0.6);

    // Create nodes
    const node = container.selectAll('.node')
      .data(nodes)
      .enter().append('circle')
      .attr('class', 'node')
      .attr('r', (d: any) => d.type === 'seed' ? 12 : 8)
      .style('fill', (d: any) => colorScale(d.type === 'seed' ? 'seed' : d.category))
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d: any) {
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`
          <strong>${d.name}</strong><br/>
          Category: ${d.category}<br/>
          Strength: ${Math.round(d.value * 100)}%
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        tooltip.transition().duration(500).style('opacity', 0);
      });

    // Create labels
    const label = container.selectAll('.label')
      .data(nodes)
      .enter().append('text')
      .attr('class', 'label')
      .style('font-size', '10px')
      .style('text-anchor', 'middle')
      .style('dy', '0.35em')
      .style('pointer-events', 'none')
      .text((d: any) => d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name);

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      label
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    // Cleanup
    return () => {
      tooltip.remove();
      simulation.stop();
    };
  }, [currentCity]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Taste Relationship Graph</h2>
      <p className="text-gray-600 mb-6">
        Visualizing cross-domain taste connections powered by Qloo's cultural intelligence. 
        Hover over nodes to see details.
      </p>
      
      <div className="flex justify-center mb-4">
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Seeds</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Food</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Activities</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Media</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <svg
          ref={svgRef}
          className="border border-gray-200 rounded-lg"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
    </motion.div>
  );
};

export default TasteGraph;