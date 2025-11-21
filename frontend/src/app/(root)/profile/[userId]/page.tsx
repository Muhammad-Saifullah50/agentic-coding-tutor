import { getUserDetails } from "@/actions/user.actions";
import Profile from "@/components/Profile";

interface PageProps {
  params: {
    userId: string;
  };
}

const UserProfilePage = async ({ params }: PageProps) => {
  const userProfile = await getUserDetails(params.userId);

  return <Profile userProfile={userProfile} />;
};

export default UserProfilePage;