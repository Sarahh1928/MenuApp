import "./Spinner.css";

interface SpinnerProps {
  size?: number;
  inline?: boolean;
}

function Spinner({ size = 20, inline = false }: SpinnerProps) {
  return (
    <span
      className={inline ? "spinner spinner-inline" : "spinner"}
      style={{ width: size, height: size }}
    />
  );
}

export default Spinner;
