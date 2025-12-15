import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, ZoomControl, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Menu, Search, Map as MapIcon, Locate, LayoutList, Bus as BusIcon, AlertCircle, Info, Languages, ChevronRight, ChevronLeft, X } from 'lucide-react';
import clsx from 'clsx';

import { MOCK_ROUTES, MOCK_STOPS, ORAN_CENTER } from './constants';
import { Bus, Route, Stop, Coordinate } from './types';
import { generateInitialBuses, moveBuses } from './services/simulation';
import { BusMarker, StopMarker, RoutePolyline, MapRecenter } from './components/MapComponents';
import { translations, Language } from './translations';

const App = () => {
  // State
  const [lang, setLang] = useState<Language>('ar');
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Derived state
  const t = translations[lang];
  const isRtl = lang === 'ar';

  // Handle Document Direction
  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  // Initialize Data
  useEffect(() => {
    setTimeout(() => {
      setBuses(generateInitialBuses());
      setIsLoading(false);
    }, 1000);
  }, []);

  // Real-time Simulation Loop
  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => {
      setBuses(prevBuses => moveBuses(prevBuses));
    }, 5000);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Geolocation
  const handleLocateUser = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    } else {
      alert(t.locationNotSupported);
    }
  };

  // Filtering Logic
  const filteredRoutes = useMemo(() => {
    if (!searchQuery) return MOCK_ROUTES;
    return MOCK_ROUTES.filter(r => 
      r.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.name[lang].toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, lang]);

  const displayedBuses = useMemo(() => {
    if (!selectedRouteId) return buses;
    return buses.filter(b => b.routeId === selectedRouteId);
  }, [buses, selectedRouteId]);

  const displayedStops = useMemo(() => {
    if (!selectedRouteId) return [];
    return MOCK_STOPS.filter(s => s.routeIds.includes(selectedRouteId));
  }, [selectedRouteId]);

  // Route Selection Handler
  const handleSelectRoute = (id: string) => {
    setSelectedRouteId(id === selectedRouteId ? null : id);
    if (window.innerWidth < 768) {
        setSidebarOpen(false);
    }
  };

  const selectedRouteData = MOCK_ROUTES.find(r => r.id === selectedRouteId);

  return (
    <div className={`flex h-screen w-full bg-slate-50 overflow-hidden relative`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Mobile Overlay Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[450] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Glassmorphism Style */}
      <div 
        className={clsx(
          "fixed md:relative z-[500] h-full bg-white/95 backdrop-blur-xl shadow-2xl transition-all duration-300 ease-out flex flex-col border-r border-slate-200",
          sidebarOpen ? (isRtl ? "translate-x-0 w-[85%] md:w-96" : "translate-x-0 w-[85%] md:w-96") : (isRtl ? "translate-x-full md:translate-x-0 md:w-0 md:border-none md:overflow-hidden" : "-translate-x-full md:translate-x-0 md:w-0 md:border-none md:overflow-hidden")
        )}
      >
        {/* Modern Header with Gradient */}
        <div className="relative p-6 bg-gradient-to-br from-indigo-600 to-violet-700 text-white shrink-0 overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 rounded-full bg-black/10 blur-xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-xl shadow-inner backdrop-blur-sm border border-white/10">
                    <BusIcon size={26} className="text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-2xl leading-none tracking-tight">{t.appTitle}</h1>
                  <p className="text-xs text-indigo-200 mt-1 font-medium tracking-wide opacity-90">{t.appSubtitle}</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 hover:bg-white/20 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modern Search Input */}
            <div className="relative mt-4 group">
              <Search className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-3 text-indigo-200 group-focus-within:text-white transition-colors`} size={18} />
              <input 
                type="text"
                placeholder={t.searchPlaceholder}
                className={`w-full ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-200 focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-white/30 transition-all text-sm`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Language & Filter Section */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.language}</span>
           <div className="flex bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
             {(['ar', 'fr', 'en'] as Language[]).map((l) => (
                <button 
                  key={l}
                  onClick={() => setLang(l)} 
                  className={clsx(
                    "px-3 py-1 text-xs rounded-md font-medium transition-all duration-200", 
                    lang === l ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  {l.toUpperCase()}
                </button>
             ))}
           </div>
        </div>

        {/* Routes List - Modern Cards */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scroll-smooth bg-slate-50/50">
           <h2 className="text-xs font-bold text-slate-400 uppercase px-2 mb-1 mt-2">{t.availableRoutes}</h2>
           {filteredRoutes.map(route => {
             const isSelected = selectedRouteId === route.id;
             return (
               <button
                  key={route.id}
                  onClick={() => handleSelectRoute(route.id)}
                  className={clsx(
                    "group w-full p-3.5 rounded-2xl border flex items-center gap-4 transition-all duration-300 relative overflow-hidden",
                    isRtl ? "text-right pr-4" : "text-left pl-4",
                    isSelected 
                      ? "bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500/20 translate-x-1" 
                      : "bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5"
                  )}
               >
                  {/* Left Color Bar indicator */}
                  <div className={`absolute top-0 bottom-0 ${isRtl ? 'right-0' : 'left-0'} w-1.5 h-full transition-colors duration-300 ${isSelected ? 'bg-indigo-500' : 'bg-slate-200 group-hover:bg-indigo-300'}`}></div>

                  {/* Route Badge */}
                  <div 
                    className="w-12 h-12 flex items-center justify-center rounded-xl text-white font-bold text-lg shrink-0 shadow-lg transform group-hover:scale-110 transition-transform duration-300 relative z-10"
                    style={{ backgroundColor: route.color, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                  >
                    {route.code}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 relative z-10">
                    <p className={clsx("font-bold text-sm truncate transition-colors", isSelected ? "text-indigo-900" : "text-slate-700")}>
                      {route.name[lang]}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={clsx("text-[10px] px-2 py-0.5 rounded-full font-medium border", 
                        route.type === 'URBAN' ? "bg-blue-50 text-blue-600 border-blue-100" : 
                        route.type === 'SUBURBAN' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                        "bg-purple-50 text-purple-600 border-purple-100"
                      )}>
                        {route.type === 'URBAN' ? t.urban : route.type === 'SUBURBAN' ? t.suburban : t.special}
                      </span>
                    </div>
                  </div>
                  
                  {/* Arrow Icon */}
                  <div className={clsx("text-slate-300 transition-transform duration-300", isSelected ? "text-indigo-500" : "group-hover:translate-x-1")}>
                     {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                  </div>
               </button>
             );
           })}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white text-xs text-slate-500 text-center shrink-0">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <p className="font-medium text-slate-600">{t.updateFrequency}</p>
          </div>
          <p className="text-slate-400">{t.designedBy}</p>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative h-full w-full bg-slate-100">
        
        {/* Floating Controls (Modern FABs) */}
        <div className={`absolute top-6 ${isRtl ? 'right-6' : 'left-6'} z-[400] flex flex-col gap-3 pointer-events-none`}>
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="pointer-events-auto bg-white p-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-indigo-600 hover:bg-indigo-50 transition-all hover:scale-110 active:scale-95 border border-white/50"
              >
                <Menu size={24} />
              </button>
            )}
            <button 
                onClick={handleLocateUser}
                className="pointer-events-auto bg-white p-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-all hover:scale-110 active:scale-95 border border-white/50"
                title={t.myLocation}
              >
                <Locate size={24} />
            </button>
        </div>

        {/* Legend / Status Overlay (Glassmorphism Card) */}
        <div className={`absolute bottom-8 ${isRtl ? 'right-4 left-4 md:left-auto md:w-80' : 'left-4 right-4 md:right-auto md:w-80'} z-[400] transition-all duration-500 transform ${selectedRouteId || userLocation ? 'translate-y-0 opacity-100' : 'translate-y-0 opacity-100'}`}>
           <div className="bg-white/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-2xl border border-white/50 p-5 ring-1 ring-black/5">
             {selectedRouteId ? (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                 <div className="flex justify-between items-start mb-3">
                   <div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight">{t.details}</h3>
                      <span className="text-xs text-slate-500 font-medium">Live Tracking</span>
                   </div>
                   <button onClick={() => setSelectedRouteId(null)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full transition-colors font-medium">
                     {t.cancel}
                   </button>
                 </div>
                 
                 <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                    <div 
                      className="w-10 h-10 rounded-lg shadow-sm flex items-center justify-center text-white font-bold" 
                      style={{ backgroundColor: selectedRouteData?.color }}
                    >
                      {selectedRouteData?.code}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-sm truncate">{selectedRouteData?.name[lang]}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs text-slate-500">{displayedBuses.length} {t.activeBuses}</span>
                      </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-indigo-50/50 rounded-lg p-2 border border-indigo-100">
                       <p className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider">{t.urban}</p>
                       <p className="text-indigo-700 font-bold">12km</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                       <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">ETA Avg</p>
                       <p className="text-slate-700 font-bold">15m</p>
                    </div>
                 </div>
               </div>
             ) : (
               <div className="flex items-center gap-4">
                 <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl text-white shadow-lg shadow-indigo-200">
                   <MapIcon size={24} />
                 </div>
                 <div>
                   <p className="text-base font-bold text-slate-800">{t.welcomeTitle}</p>
                   <p className="text-xs text-slate-500 mt-1">{t.welcomeSubtitle}</p>
                 </div>
               </div>
             )}
           </div>
        </div>

        {/* Leaflet Map */}
        <MapContainer 
          center={[ORAN_CENTER.lat, ORAN_CENTER.lng]} 
          zoom={13} 
          scrollWheelZoom={true} 
          zoomControl={false}
          className="h-full w-full outline-none z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <ZoomControl position="topleft" />

          {/* User Location */}
          {userLocation && (
             <Marker position={[userLocation.lat, userLocation.lng]} icon={L.divIcon({
               className: 'bg-transparent',
               html: '<div class="pulse-ring"></div><div class="pulse-dot"></div>',
               iconSize: [20, 20]
             })}>
               <Popup>{t.myLocation}</Popup>
             </Marker>
          )}

          {/* Routes */}
          {MOCK_ROUTES.map(route => (
            <RoutePolyline 
              key={route.id} 
              route={route} 
              isSelected={selectedRouteId === route.id || selectedRouteId === null} 
            />
          ))}

          {/* Stops */}
          {displayedStops.map(stop => (
            <StopMarker key={stop.id} stop={{...stop, name_resolved: stop.name[lang]} as any} />
          ))}

          {/* Buses */}
          {displayedBuses.map(bus => {
             const route = MOCK_ROUTES.find(r => r.id === bus.routeId);
             return (
               <BusMarker 
                 key={bus.id} 
                 bus={bus} 
                 routeColor={route?.color || '#333'} 
                 routeName={route?.name[lang] || ''}
                 labels={{
                   bus: t.bus,
                   speed: t.speed,
                   arrival: t.arrival,
                   seconds: t.seconds,
                   minutes: t.minutes,
                   offRoute: t.offRoute
                 }}
                 isRtl={isRtl}
               />
             );
          })}

          <MapRecenter location={selectedRouteId && selectedRouteData ? selectedRouteData.path[Math.floor(selectedRouteData.path.length / 2)] : (userLocation || undefined)} zoom={selectedRouteId ? 14 : 15} />

        </MapContainer>
      </div>
    </div>
  );
};

export default App;