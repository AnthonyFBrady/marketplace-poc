'use client';

import { useState, useCallback, useRef } from 'react';
import Map, { ViewStateChangeEvent } from 'react-map-gl/maplibre';
import type { ViewState } from 'react-map-gl/maplibre';
import useSupercluster from 'use-supercluster';
import { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Listing } from '@/lib/listings';
import { ListingPin } from '@/components/ListingPin';

type Props = {
  listings: Listing[];
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (listing: Listing | null) => void;
};

const TORONTO = { latitude: 43.6532, longitude: -79.3832, zoom: 12 };

export function MapView({ listings, selectedId, hoveredId, onSelect }: Props) {
  const [viewState, setViewState] = useState<Partial<ViewState>>({
    ...TORONTO,
    bearing: 0,
    pitch: 0,
  });
  const mapRef = useRef<{ flyTo: (opts: { center: [number, number]; zoom: number; duration: number }) => void } | null>(null);

  const onMove = useCallback((evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  }, []);

  // Build GeoJSON points for supercluster
  const points = listings.map((l) => ({
    type: 'Feature' as const,
    properties: { cluster: false, listingId: l.id, listing: l },
    geometry: { type: 'Point' as const, coordinates: [l.lng, l.lat] },
  }));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds: [-80.5, 43.3, -78.8, 44.0],
    zoom: viewState.zoom ?? TORONTO.zoom,
    options: { radius: 60, maxZoom: 16 },
  });

  const handleClusterClick = useCallback(
    (clusterId: number, longitude: number, latitude: number) => {
      if (!supercluster) return;
      const expansionZoom = Math.min(
        supercluster.getClusterExpansionZoom(clusterId),
        20
      );
      mapRef.current?.flyTo({
        center: [longitude, latitude],
        zoom: expansionZoom,
        duration: 500,
      });
    },
    [supercluster]
  );

  return (
    <Map
      ref={mapRef as React.Ref<unknown> as React.Ref<never>}
      {...viewState}
      onMove={onMove}
      mapStyle="https://tiles.openfreemap.org/styles/positron"
      style={{ width: '100%', height: '100%' }}
      onClick={() => onSelect(null)}
    >
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count, listingId, listing } =
          cluster.properties as {
            cluster: boolean;
            point_count?: number;
            listingId?: string;
            listing?: Listing;
          };

        if (isCluster && point_count !== undefined) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              latitude={latitude}
              longitude={longitude}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleClusterClick(cluster.id as number, longitude, latitude);
              }}
            >
              <div
                className="flex items-center justify-center rounded-full text-white font-semibold cursor-pointer transition-transform hover:scale-105"
                style={{
                  width: 40,
                  height: 40,
                  background: '#2D6A4F',
                  fontSize: 14,
                  boxShadow: '0 2px 8px rgba(45,106,79,0.35)',
                  border: '2px solid rgba(255,255,255,0.7)',
                }}
              >
                {point_count}
              </div>
            </Marker>
          );
        }

        if (!listing) return null;
        return (
          <ListingPin
            key={listing.id}
            listing={listing}
            selected={listing.id === selectedId || listing.id === hoveredId}
            onClick={onSelect}
          />
        );
      })}
    </Map>
  );
}
