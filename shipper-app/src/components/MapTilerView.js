import React, { useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

let WebView = null;
if (Platform.OS !== 'web') {
  WebView = require('react-native-webview').WebView;
}

const MapTilerView = ({ markers = [], route = null, center = [106.660172, 10.762622], zoom = 12, onMarkerPress }) => {
  const webviewRef = useRef(null);
  const iframeRef = useRef(null);
  const onMarkerPressRef = useRef(onMarkerPress);
  const iframeLoadedRef = useRef(false);

  useEffect(() => {
    onMarkerPressRef.current = onMarkerPress;
  }, [onMarkerPress]);

  const htmlContentRef = useRef(null);

  if (!htmlContentRef.current) {
    const routeGeoJson = route ? {
      type: 'Feature',
      properties: {},
      geometry: route
    } : null;

    htmlContentRef.current = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
        <link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet" />
        <style>
          body { margin: 0; padding: 0; overflow: hidden; }
          #map { position: absolute; top: 0; bottom: 0; width: 100%; }
          .marker {
            background-color: #E63946;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 11px;
            font-weight: bold;
            transition: transform 0.2s;
          }
          .marker:hover {
            transform: scale(1.3);
          }
        </style>
      </head>
      <body>
      <div id="map"></div>
      <script>
        var mapLoaded = false;
        var map = new maplibregl.Map({
          container: 'map',
          style: {
            version: 8,
            sources: {
              'osm': {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '© OpenStreetMap contributors'
              }
            },
            layers: [{
              id: 'osm',
              type: 'raster',
              source: 'osm',
              minzoom: 0,
              maxzoom: 19
            }]
          },
          center: [${center[0]}, ${center[1]}],
          zoom: ${zoom},
          attributionControl: false
        });

        var pendingMarkers = ${JSON.stringify(markers)};
        var pendingRoute = ${JSON.stringify(routeGeoJson)};
        var currentMarkers = [];

        map.on('load', function () {
          mapLoaded = true;
          updateMarkers(pendingMarkers);
          if (pendingRoute) {
            drawRoute(pendingRoute);
          }
        });

        function drawRoute(geojson) {
          if (!mapLoaded) {
            pendingRoute = geojson;
            return;
          }
          if (!geojson) {
            try {
              if (map.getLayer('route-line')) map.removeLayer('route-line');
              if (map.getSource('route-src')) map.removeSource('route-src');
            } catch(e){}
            return;
          }
          
          var featureData = geojson;
          if (geojson.type === 'LineString') {
            featureData = { type: 'Feature', properties: {}, geometry: geojson };
          }
          if (featureData.type === 'Feature') {
            featureData = { type: 'FeatureCollection', features: [featureData] };
          }
          
          try {
            if (map.getSource('route-src')) {
              map.getSource('route-src').setData(featureData);
            } else {
              map.addSource('route-src', { type: 'geojson', data: featureData });
              map.addLayer({
                id: 'route-line',
                type: 'line',
                source: 'route-src',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: {
                  'line-color': '#4285F4',
                  'line-width': 5,
                  'line-opacity': 0.85
                }
              });
            }
          } catch(e) {
            console.error('drawRoute error', e);
          }
        }

        function updateMarkers(newMarkers) {
          if (!mapLoaded) {
            pendingMarkers = newMarkers;
            return;
          }
          currentMarkers.forEach(function(m) { m.remove(); });
          currentMarkers = [];

          newMarkers.forEach(function(m) {
            var el = document.createElement('div');
            el.className = 'marker';
            if (m.color) el.style.backgroundColor = m.color;
            if (m.label) el.innerHTML = m.label;

            var popup = new maplibregl.Popup({ offset: 25 }).setText(m.title || 'Địa điểm');

            var marker = new maplibregl.Marker({ element: el })
              .setLngLat([m.lng, m.lat])
              .setPopup(popup)
              .addTo(map);

            el.addEventListener('click', function(evt) {
              var msg = JSON.stringify({ type: 'markerClicked', id: m.id });
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(msg);
              } else {
                window.parent.postMessage(msg, '*');
              }
            });

            currentMarkers.push(marker);
          });
        }

        function handleExternalMessage(dataStr) {
          try {
            var data = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
            if (!data || !data.type) return;
            if (data.type === 'updateMarkers') {
              updateMarkers(data.markers);
            } else if (data.type === 'updateRoute') {
              drawRoute(data.route);
            } else if (data.type === 'flyTo') {
              if (mapLoaded) {
                map.flyTo({ center: [data.lng, data.lat], zoom: data.zoom || 14 });
              }
            }
          } catch (e) {}
        }

        // For React Native Mobile
        document.addEventListener('message', function(event) {
          handleExternalMessage(event.data);
        });
        
        // For Web (iframe) - filter out own messages
        window.addEventListener('message', function(event) {
          if (event.source === window) return;
          handleExternalMessage(event.data);
        });
      </script>
      </body>
      </html>
    `;
  }

  // Send route updates to the map
  const sendRouteToMap = useCallback((routeGeometry) => {
    const geojson = routeGeometry ? {
      type: 'Feature',
      properties: {},
      geometry: routeGeometry
    } : null;

    const msg = JSON.stringify({ type: 'updateRoute', route: geojson });

    if (Platform.OS === 'web') {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(msg, '*');
      }
    } else {
      if (webviewRef.current) {
        webviewRef.current.injectJavaScript(`
          try { handleExternalMessage('${msg.replace(/'/g, "\\'")}'); } catch(e){}
          true;
        `);
      }
    }
  }, []);

  // Send marker updates
  const sendMarkersToMap = useCallback((mkrs) => {
    const msg = JSON.stringify({ type: 'updateMarkers', markers: mkrs });
    if (Platform.OS === 'web') {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(msg, '*');
      }
    } else {
      if (webviewRef.current) {
        webviewRef.current.injectJavaScript(`
          try { updateMarkers(${JSON.stringify(mkrs)}); } catch(e){}
          true;
        `);
      }
    }
  }, []);

  useEffect(() => {
    sendMarkersToMap(markers);
  }, [markers]);

  useEffect(() => {
    sendRouteToMap(route);
  }, [route]);

  useEffect(() => {
    const msg = { type: 'flyTo', lat: center[1], lng: center[0], zoom };
    if (Platform.OS === 'web') {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(JSON.stringify(msg), '*');
      }
    } else {
      if (webviewRef.current && center) {
        webviewRef.current.injectJavaScript(`
          try { map.flyTo({ center: [${center[0]}, ${center[1]}], zoom: ${zoom} }); } catch(e){}
          true;
        `);
      }
    }
  }, [center, zoom]);

  // Web: listen for messages from iframe (marker clicks)
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    
    const onMessage = (event) => {
      try {
        const dataStr = event.nativeEvent ? event.nativeEvent.data : event.data;
        const data = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
        if (data.type === 'markerClicked' && onMarkerPressRef.current) {
          onMarkerPressRef.current(data.id);
        }
      } catch (e) {}
    };
    
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <iframe
          ref={iframeRef}
          srcDoc={htmlContentRef.current}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </View>
    );
  }

  // Mobile: handle messages from WebView
  const onWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'markerClicked' && onMarkerPressRef.current) {
        onMarkerPressRef.current(data.id);
      }
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: htmlContentRef.current }}
        style={styles.webview}
        scrollEnabled={false}
        bounces={false}
        onMessage={onWebViewMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default MapTilerView;
