const initialCenter = [-27.49, -58.97];
const initialZoom = 16;

function homeView() {
  map.flyTo(initialCenter, initialZoom);
}