import TrackLines from "./TrackLines";
import SpeedStreaks from "./SpeedStreaks";

export default function F1Background() {
  return (
    <>
      <div
        className="fixed inset-0 carbon-fiber"
        style={{
          zIndex: -20,
          opacity: 0.3, // Make carbon fiber semi-transparent to show aurora
          backgroundColor: "transparent", // Remove solid background to show aurora
        }}
      />
      <div
        className="fixed inset-0 telemetry-grid opacity-20"
        style={{ zIndex: -10 }}
      />
      <TrackLines />
      <SpeedStreaks />
    </>
  );
}
