import { useMap } from "react-leaflet/hooks";

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

export default ChangeView;
