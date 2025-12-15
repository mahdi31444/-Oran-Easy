import { Bus, Route, Coordinate } from '../types';
import { MOCK_ROUTES } from '../constants';

// Helper to calculate distance between two points (Haversine formula equivalent to ST_Distance)
export const calculateDistance = (p1: Coordinate, p2: Coordinate): number => {
  const R = 6371e3; // metres
  const φ1 = p1.lat * Math.PI / 180;
  const φ2 = p2.lat * Math.PI / 180;
  const Δφ = (p2.lat - p1.lat) * Math.PI / 180;
  const Δλ = (p2.lng - p1.lng) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Initial generator for buses
export const generateInitialBuses = (): Bus[] => {
  const buses: Bus[] = [];
  MOCK_ROUTES.forEach((route) => {
    // Add 2 buses per route for simulation
    const start = route.path[0];
    const mid = route.path[Math.floor(route.path.length / 2)];
    
    buses.push({
      id: `bus_${route.code}_1`,
      routeId: route.id,
      location: { ...start }, // Spread to copy
      speedKmh: 20 + Math.random() * 30, // Random speed 20-50 km/h
      heading: 0,
      isOffRoute: false,
    });

    buses.push({
      id: `bus_${route.code}_2`,
      routeId: route.id,
      location: { ...mid },
      speedKmh: 20 + Math.random() * 30,
      heading: 0,
      isOffRoute: false,
    });
  });
  return buses;
};

// Simulate movement (Backend Logic Simulation)
// In a real app, this logic lives in Python/FastAPI which receives GPS streams
export const moveBuses = (currentBuses: Bus[]): Bus[] => {
  return currentBuses.map(bus => {
    const route = MOCK_ROUTES.find(r => r.id === bus.routeId);
    if (!route) return bus;

    // Simple movement simulation: find nearest point on path and move towards next point
    // This is a naive implementation of ST_LineLocatePoint logic
    
    let minDist = Infinity;
    let closestIndex = 0;

    route.path.forEach((p, idx) => {
      const d = calculateDistance(bus.location, p);
      if (d < minDist) {
        minDist = d;
        closestIndex = idx;
      }
    });

    // Determine target (next point in path)
    // If at end, loop back (circular route simulation for demo)
    const targetIndex = (closestIndex + 1) % route.path.length;
    const target = route.path[targetIndex];

    // Move 10% towards target (simulate 5 seconds of travel)
    const newLat = bus.location.lat + (target.lat - bus.location.lat) * 0.1;
    const newLng = bus.location.lng + (target.lng - bus.location.lng) * 0.1;

    // Calculate heading
    const y = Math.sin(target.lng - bus.location.lng) * Math.cos(target.lat);
    const x = Math.cos(bus.location.lat) * Math.sin(target.lat) -
              Math.sin(bus.location.lat) * Math.cos(target.lat) * Math.cos(target.lng - bus.location.lng);
    const θ = Math.atan2(y, x);
    const heading = (θ * 180 / Math.PI + 360) % 360;

    // ETA Simulation (Distance to target / Speed)
    // 500m approx average distance between mock points
    const distToNext = calculateDistance({lat: newLat, lng: newLng}, target); 
    const speedMps = bus.speedKmh * 1000 / 3600;
    const eta = speedMps > 0 ? Math.round(distToNext / speedMps) : 60;

    return {
      ...bus,
      location: { lat: newLat, lng: newLng },
      heading: heading,
      etaSeconds: eta,
      // Simulate geofencing alert: if random variance pushed it too far (not implemented here, but logic exists)
      isOffRoute: false 
    };
  });
};