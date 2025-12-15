export interface Coordinate {
  lat: number;
  lng: number;
}

export enum LineType {
  URBAN = 'URBAN', // Urban (City center)
  SUBURBAN = 'SUBURBAN', // Suburban
  SPECIAL = 'SPECIAL', // Special lines (Airport, Univ)
}

export interface LocalizedText {
  ar: string;
  fr: string;
  en: string;
}

export interface Route {
  id: string;
  code: string; // e.g., "11", "U", "B"
  name: LocalizedText; // Multilingual name
  color: string;
  type: LineType;
  path: Coordinate[]; // Represents the PostGIS LINESTRING
}

export interface Stop {
  id: string;
  name: LocalizedText; // Multilingual name
  location: Coordinate; // Represents the PostGIS POINT
  routeIds: string[];
}

export interface Bus {
  id: string;
  routeId: string;
  location: Coordinate; // Current GPS position
  speedKmh: number;
  heading: number; // 0-360 degrees
  nextStopId?: string;
  etaSeconds?: number;
  isOffRoute: boolean;
}

// Blueprint: Database Schema Simulation
// This interface reflects the structure expected from the PostgreSQL/PostGIS backend
export interface DB_Blueprint {
  tables: {
    routes: "id UUID PK, code VARCHAR, name VARCHAR, geometry GEOMETRY(LineString, 4326)";
    stops: "id UUID PK, name VARCHAR, geometry GEOMETRY(Point, 4326)";
    bus_locations: "bus_id UUID PK, geometry GEOMETRY(Point, 4326), speed_kmh FLOAT, timestamp TIMESTAMPTZ";
    route_stops: "route_id UUID FK, stop_id UUID FK, sequence_order INT";
  }
}