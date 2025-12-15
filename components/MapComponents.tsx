import React, { useEffect } from 'react';
import { useMap, Marker, Polyline, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Bus, Route, Stop } from '../types';
import { Bus as BusIcon, MapPin, Navigation, Clock, Activity } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix for default Leaflet icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- Custom Icons ---

const createBusIcon = (color: string, heading: number) => {
  const html = renderToStaticMarkup(
    <div className="relative w-10 h-10 flex items-center justify-center group">
       {/* Pulse Effect */}
       <div className="absolute inset-0 bg-white/40 rounded-full animate-ping opacity-75"></div>
       
       {/* Main Marker Circle */}
       <div className="relative z-10 w-9 h-9 bg-white rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.2)] flex items-center justify-center border-2 border-slate-50 transform transition-transform" style={{ borderColor: 'white' }}>
          
          {/* Rotating Direction Arrow inside */}
          <div className="absolute inset-0 rounded-full transition-transform duration-500" style={{ transform: `rotate(${heading}deg)` }}>
             <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rounded-full"></div>
          </div>

          <BusIcon size={18} fill={color} color={color} className="relative z-20" strokeWidth={2.5} />
       </div>
    </div>
  );

  return L.divIcon({
    html,
    className: 'custom-bus-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const createStopIcon = () => {
  const html = renderToStaticMarkup(
    <div className="text-slate-600 drop-shadow-md hover:scale-110 transition-transform hover:text-indigo-600">
      <div className="bg-white rounded-full p-1 shadow-md border border-slate-100">
        <MapPin size={16} fill="currentColor" className="opacity-80" />
      </div>
    </div>
  );
  return L.divIcon({
    html,
    className: 'custom-stop-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

// --- Components ---

interface RecenterProps {
  location?: { lat: number; lng: number };
  zoom?: number;
}

export const MapRecenter: React.FC<RecenterProps> = ({ location, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], zoom || map.getZoom(), {
        animate: true,
        duration: 1.5
      });
    }
  }, [location, map, zoom]);
  return null;
};

interface BusMarkerProps {
  bus: Bus;
  routeColor: string;
  routeName: string;
  labels: {
    bus: string;
    speed: string;
    arrival: string;
    seconds: string;
    minutes: string;
    offRoute: string;
  };
  isRtl: boolean;
}

export const BusMarker: React.FC<BusMarkerProps> = ({ bus, routeColor, routeName, labels, isRtl }) => {
  
  // Calculate Time Details
  let durationString = '';
  let arrivalClock = '';
  
  if (bus.etaSeconds !== undefined) {
    const now = new Date();
    const arrivalTime = new Date(now.getTime() + bus.etaSeconds * 1000);
    arrivalClock = arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    if (bus.etaSeconds < 60) {
      durationString = `${bus.etaSeconds} ${labels.seconds}`;
    } else {
      const mins = Math.floor(bus.etaSeconds / 60);
      const secs = bus.etaSeconds % 60;
      durationString = `${mins} ${labels.minutes}`;
      if (secs > 0) {
        durationString += ` ${secs} ${labels.seconds}`;
      }
    }
  }

  return (
    <Marker 
      position={[bus.location.lat, bus.location.lng]} 
      icon={createBusIcon(routeColor, bus.heading)}
    >
      <Popup className="bus-popup" closeButton={false}>
        <div className={`font-sans min-w-[220px] ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
          {/* Header Colored Bar */}
          <div className="h-2 w-full rounded-t-xl" style={{ backgroundColor: routeColor }}></div>
          
          <div className="p-4">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
               <div>
                  <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2 leading-none">
                     <span className="text-2xl">{bus.routeId.replace('r_', '')}</span>
                     <span className="text-xs text-slate-400 font-normal uppercase tracking-wide border px-1.5 rounded">{labels.bus}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{routeName}</p>
               </div>
               <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                  <BusIcon size={18} color={routeColor} />
               </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
               {/* Speed */}
               <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1 text-slate-400 text-[10px] uppercase font-bold mb-0.5">
                    <Activity size={10} /> {labels.speed}
                  </div>
                  <span className="font-mono font-bold text-slate-700 text-lg leading-none">{Math.round(bus.speedKmh)}</span>
                  <span className="text-[9px] text-slate-400">km/h</span>
               </div>
               
               {/* ETA */}
               <div className="bg-green-50 rounded-lg p-2 border border-green-100 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1 text-green-600 text-[10px] uppercase font-bold mb-0.5">
                    <Clock size={10} /> {labels.arrival}
                  </div>
                  <span className="font-mono font-bold text-green-700 text-lg leading-none">{arrivalClock}</span>
                  <span className="text-[9px] text-green-600 font-medium truncate max-w-full">{durationString}</span>
               </div>
            </div>

            {/* Alert */}
            {bus.isOffRoute && (
              <div className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded-lg flex items-center justify-center gap-2 border border-red-100 animate-pulse">
                <span>⚠️</span> {labels.offRoute}
              </div>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

interface StopMarkerProps {
  stop: Stop;
}

export const StopMarker: React.FC<StopMarkerProps> = ({ stop }) => {
  return (
    <Marker position={[stop.location.lat, stop.location.lng]} icon={createStopIcon()}>
       <Tooltip direction="top" offset={[0, -20]} opacity={1} className="custom-tooltip">
        <span className="font-bold font-sans text-slate-700">{(stop as any).name_resolved || "Stop"}</span>
      </Tooltip>
    </Marker>
  );
};

interface RoutePolylineProps {
  route: Route;
  isSelected: boolean;
}

export const RoutePolyline: React.FC<RoutePolylineProps> = ({ route, isSelected }) => {
  return (
    <>
      {/* Background/Outline for visibility */}
      <Polyline 
        positions={route.path.map(p => [p.lat, p.lng])}
        pathOptions={{ 
          color: isSelected ? 'white' : 'transparent',
          weight: isSelected ? 8 : 0, 
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round'
        }}
      />
      {/* Actual Line */}
      <Polyline 
        positions={route.path.map(p => [p.lat, p.lng])}
        pathOptions={{ 
          color: route.color, 
          weight: isSelected ? 5 : 4, 
          opacity: isSelected ? 1 : 0.5,
          dashArray: isSelected ? undefined : '1, 8',
          lineCap: 'round',
          lineJoin: 'round'
        }}
      />
    </>
  );
};