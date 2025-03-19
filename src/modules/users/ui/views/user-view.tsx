import { UserSection } from "@/modules/users/ui/sections/user-section";
import { UserVideosSection } from "../sections/user-videos-section";

interface UserViewProps {
  userId: string;
}

const UserView = ({ userId }: UserViewProps) => {
  return (
    <div className="flex flex-col max-w-[1400px] px-4 pt-2.5 mx-auto mb-10 gap-y-6">
      <UserSection userId={userId} />
      <UserVideosSection userId={userId} />
    </div>
  );
};

export { UserView };
