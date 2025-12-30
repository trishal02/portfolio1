import TrackLines from "./TrackLines";
import SpeedStreaks from "./SpeedStreaks";

export default function F1Background() {
  return (
    <>
      <div className="fixed inset-0 -z-20 carbon-fiber" />
      <div className="fixed inset-0 -z-10 telemetry-grid opacity-20" />
      <TrackLines />
      <SpeedStreaks />
    </>
  );
}
