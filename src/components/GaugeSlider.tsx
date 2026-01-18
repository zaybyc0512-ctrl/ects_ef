import React from 'react';

interface GaugeSliderProps {
    value: number;
    max?: number;
    onChange: (val: number) => void;
    colorHex: string; // e.g. "#22d3ee" (cyan-400) or "#f87171" (red-400)
    disabled?: boolean;
}

export default function GaugeSlider({
    value,
    max = 30, // Default max level for a stat usually isn't this high but safe upper bound 
    onChange,
    colorHex,
    disabled = false
}: GaugeSliderProps) {

    // Calculate percentage for background gradient
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div className="relative w-full h-6 flex items-center">
            <input
                type="range"
                min={0}
                max={max}
                step={1}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                disabled={disabled}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                    // Use inline style for dynamic gradient
                    background: `linear-gradient(to right, ${colorHex} 0%, ${colorHex} ${percentage}%, #334155 ${percentage}%, #334155 100%)`
                }}
            />

            {/* Custom Styles for Thumb (via styled-jsx or tailwind classes if possible, but input[type=range] works best with standard CSS or simple classes) 
          Tailwind doesn't have built-in utilities for ::webkit-slider-thumb out of box commonly used this way. 
          The style above handles the track. The thumb is handled by browser default often, but we can try to style it if needed. 
          For now, standard thumb is acceptable, but let's see if we can add a class.
      */}
            <style jsx>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #ffffff; /* White thumb */
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        input[type=range]::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border: none;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
      `}</style>
        </div>
    );
}
