import { Avatar, AvatarGroup } from "@/registry/kit/ui/avatar";

const team = ["Mina Okafor", "Leo Varga", "Iris Chen", "Tomás Reyes", "Priya Raman", "Jonas Albrecht"];

export default function AvatarDemo() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-end gap-4">
        <Avatar alt="Mina Okafor" size="sm" />
        <Avatar alt="Leo Varga" />
        <Avatar alt="Iris Chen" size="lg" />
      </div>
      <AvatarGroup max={4}>
        {team.map((name) => (
          <Avatar key={name} alt={name} />
        ))}
      </AvatarGroup>
    </div>
  );
}
