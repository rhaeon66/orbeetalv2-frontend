export default function MilestoneScene({ className = "" }) {
  return (
    <img
      src="/images/about/milestones.svg"
      alt="A path of milestones leading up a mountain"
      width={500}
      height={500}
      draggable={false}
      className={`milestone-scene h-auto w-full ${className}`}
    />
  );
}
