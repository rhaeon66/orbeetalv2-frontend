export default function SectionShell({ className = "", children }) {
  return (
    <div className="page-container">
      <div className={className ? `content-container ${className}` : "content-container"}>
        {children}
      </div>
    </div>
  );
}
