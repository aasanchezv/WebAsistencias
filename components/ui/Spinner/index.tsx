import './spinner.css';

type SpinnerProps = {
  size?: number;
  border?: number;
  primaryColor?: string;
  secondaryColor?: string;
};

export default function Spinner({
  size = 50,
  border = 5,
  primaryColor = "ffffff",
}: SpinnerProps) {
  const style: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: `${size}px`,
    borderTop: `${border}px solid #${primaryColor}`,
    borderRight: `${border}px solid #${primaryColor}`,
    borderLeft: `${border}px solid rgba(0,0,0,0)`,
    borderBottom: `${border}px solid #${primaryColor}`,
  };

  return <div className="spinner" style={style}></div>;
}