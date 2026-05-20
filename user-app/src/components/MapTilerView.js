import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const MapTilerView = ({ markers = [], center = [106.660172, 10.762622], zoom = 12 }) => {
  const webviewRef = useRef(null);

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
          style: 'https://api.maptiler.com/maps/streets-v4/style.json?key=VQHIJC9n9GeP4CUF5uDy',
          center: [${center[0]}, ${center[1]}],
          zoom: ${zoom},
          attributionControl: false
        });

        var markers = ${JSON.stringify(markers)};
        var currentMarkers = [];

        map.on('load', function () {
          // Add default markers
          updateMarkers(markers);
        });

        function updateMarkers(newMarkers) {
          // Remove old markers
          currentMarkers.forEach(m => m.remove());
          currentMarkers = [];

          // Add new markers
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

        // Listen for messages from React Native
        document.addEventListener('message', function(event) {
          try {
            var data = JSON.parse(event.data);
            if (data.type === 'updateMarkers') {
              updateMarkers(data.markers);
            } else if (data.type === 'flyTo') {
              map.flyTo({ center: [data.lng, data.lat], zoom: data.zoom || 14 });
            }
          } catch (e) {}
        });
      </script>
      </body>
      </html>
    `;
  };

  useEffect(() => {
    if (webviewRef.current) {
      const msg = JSON.stringify({ type: 'updateMarkers', markers });
      webviewRef.current.postMessage(msg);
      // Ensure it works on some platforms that use injectJavaScript
      webviewRef.current.injectJavaScript(`
        try { updateMarkers(${JSON.stringify(markers)}); } catch(e){}
        true;
      `);
    }
  }, [markers]);

  useEffect(() => {
    if (webviewRef.current && center) {
      webviewRef.current.injectJavaScript(`
        try { map.flyTo({ center: [${center[0]}, ${center[1]}], zoom: ${zoom} }); } catch(e){}
        true;
      `);
    }
  }, [center, zoom]);

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
