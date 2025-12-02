import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { Feature, Geometry, FeatureCollection } from 'geojson';
import { RotateCw } from 'lucide-react';

interface WorldMapProps {
  activeCountryNames: string[];
  onCountryClick: (countryName: string) => void;
}

interface CountryFeature extends Feature<Geometry, { name: string }> {}

export const WorldMap: React.FC<WorldMapProps> = ({ activeCountryNames, onCountryClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [geography, setGeography] = useState<CountryFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAutoRotate, setIsAutoRotate] = useState(true);

  const projectionRef = useRef(d3.geoOrthographic().scale(130).translate([140, 140]).clipAngle(90));
  const pathRef = useRef(d3.geoPath().projection(projectionRef.current));
  const rotationTimer = useRef<d3.Timer | null>(null);
  const interactionTimeout = useRef<NodeJS.Timeout | null>(null);

  const startRotation = useCallback(() => {
     if (rotationTimer.current) return; 
     rotationTimer.current = d3.timer((elapsed) => {
        const projection = projectionRef.current;
        const path = pathRef.current;
        const rotate = projection.rotate();
        const speed = 0.15; 
        projection.rotate([rotate[0] + speed, rotate[1]]);
        
        const svg = d3.select(svgRef.current);
        svg.selectAll("g.countries-group path").attr("d", (d) => path(d as any) || "");
     });
  }, []);

  useEffect(() => {
    const fetchTopology = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
        const data = await response.json() as FeatureCollection<Geometry, { name: string }>;
        if (data && data.features) {
           setGeography(data.features);
        }
      } catch (error) {
        console.error("Failed to load map data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopology();
  }, []);

  useEffect(() => {
    if (!svgRef.current || geography.length === 0) return;

    const width = 280;
    const height = 280;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const projection = projectionRef.current;
    const path = pathRef.current;

    svg.append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", projection.scale())
      .attr("class", "fill-secondary/30 stroke-border stroke-2");

    const mapGroup = svg.append("g").attr("class", "countries-group");

    mapGroup.selectAll("path")
      .data(geography)
      .enter()
      .append("path")
      .attr("d", (d) => path(d as any) || "")
      .attr("class", "fill-background stroke-border/30 stroke-[0.5] cursor-pointer hover:fill-accent transition-colors")
      .on("click", (event, d) => {
        event.stopPropagation();
        if (d.properties?.name) {
            onCountryClick(d.properties.name);
        }
      })
      .append("title")
      .text((d) => d.properties.name);

    const drag = d3.drag<SVGSVGElement, unknown>()
      .on("start", () => {
        if (rotationTimer.current) {
          rotationTimer.current.stop();
          rotationTimer.current = null;
        }
        if (interactionTimeout.current) {
           clearTimeout(interactionTimeout.current);
        }
      })
      .on("drag", (event) => {
        const rotate = projection.rotate();
        const k = 75 / projection.scale();
        projection.rotate([
          rotate[0] + event.dx * k,
          rotate[1] - event.dy * k
        ]);
        mapGroup.selectAll("path").attr("d", (d) => path(d as any) || "");
      })
      .on("end", () => {
        if (isAutoRotate) {
           interactionTimeout.current = setTimeout(() => {
             startRotation();
           }, 5000);
        }
      });

    svg.call(drag);

    if (isAutoRotate) startRotation();

    return () => {
       if (rotationTimer.current) rotationTimer.current.stop();
       if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    };
  }, [geography, isAutoRotate, startRotation]);

  useEffect(() => {
      if (isAutoRotate) {
         if (!rotationTimer.current) startRotation();
      } else {
         if (rotationTimer.current) {
             rotationTimer.current.stop();
             rotationTimer.current = null;
         }
         if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
      }
  }, [isAutoRotate, startRotation]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("g.countries-group path")
       .attr("class", (d: any) => {
          const isActive = activeCountryNames.includes(d.properties.name);
          return isActive 
            ? "fill-primary stroke-border stroke-[1] cursor-pointer hover:fill-primary-dark transition-colors"
            : "fill-background stroke-border/30 stroke-[0.5] cursor-pointer hover:fill-accent transition-colors";
       });
  }, [activeCountryNames, geography]);

  return (
    <div className="flex flex-col items-center justify-center bg-blue-50/50 rounded-2xl border-2 border-border p-2 shadow-pixel-sm mb-4 group overflow-hidden">
      
      {loading ? (
        <div className="w-[280px] h-[280px] flex items-center justify-center text-text/50 text-xs font-bold animate-pulse">
          Loading World...
        </div>
      ) : (
        <>
          <div className="w-full aspect-square relative">
             <svg ref={svgRef} viewBox="0 0 280 280" className="cursor-move w-full h-full block" />
          </div>
          
          <div className="w-full flex items-center justify-between px-2 mt-2">
             <div className="text-[10px] text-text/40 font-bold uppercase tracking-wider">
               World Map
             </div>
             <button 
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                className={`p-1 rounded-lg border border-border transition-all z-10 active:translate-y-[1px] ${
                   isAutoRotate ? 'bg-success text-green-900' : 'bg-white text-gray-400'
                }`}
                title={isAutoRotate ? "Auto-Rotation On" : "Auto-Rotation Off"}
              >
                 <RotateCw size={12} className={isAutoRotate ? "animate-spin-slow" : ""} />
              </button>
          </div>
        </>
      )}
    </div>
  );
};
