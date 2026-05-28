import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const MapTilerView = ({ markers = [], center = [106.660172, 10.762622], zoom = 12 }) => {
  const webviewRef = useRef(null);
  const iframeRef = useRef(null);

  const generateHtml = () => {
    return `
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
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            cursor: pointer;
          }
        </style>
      </head>
      <body>
      <div id="map"></div>
      <script>
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

        var markers = ${JSON.stringify(markers)};
        var currentMarkers = [];

        map.on('load', function () {
          updateMarkers(markers);
        });

        function updateMarkers(newMarkers) {
          currentMarkers.forEach(m => m.remove());
          currentMarkers = [];

          newMarkers.forEach(m => {
            var el = document.createElement('div');
            el.className = 'marker';
            if (m.color) el.style.backgroundColor = m.color;

            var popup = new maplibregl.Popup({ offset: 25 }).setText(m.title || 'Địa điểm');

            var marker = new maplibregl.Marker({element: el})
              .setLngLat([m.lng, m.lat])
              .setPopup(popup)
              .addTo(map);
            
            currentMarkers.push(marker);
          });
        }

        function handleMessage(dataStr) {
          try {
            var data = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
            if (data.type === 'updateMarkers') {
              updateMarkers(data.markers);
            } else if (data.type === 'flyTo') {
              map.flyTo({ center: [data.lng, data.lat], zoom: data.zoom || 14 });
            }
          } catch (e) {}
        }

        // For React Native Mobile
        document.addEventListener('message', function(event) {
          handleMessage(event.data);
        });
        
        // For React Native Web (iframe)
        window.addEventListener('message', function(event) {
          handleMessage(event.data);
        });
      </script>
      </body>
      </html>
    `;
  };

  useEffect(() => {
    const msg = { type: 'updateMarkers', markers };
    if (Platform.OS === 'web') {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(JSON.stringify(msg), '*');
      }
    } else {
      if (webviewRef.current) {
        webviewRef.current.postMessage(JSON.stringify(msg));
        webviewRef.current.injectJavaScript(`
          try { updateMarkers(${JSON.stringify(markers)}); } catch(e){}
          true;
        `);
      }
    }
  }, [markers]);

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

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <iframe
          ref={iframeRef}
          srcDoc={generateHtml()}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: generateHtml() }}
        style={styles.webview}
        scrollEnabled={false}
        bounces={false}
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
