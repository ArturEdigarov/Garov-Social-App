import { useUserContext } from "@/context/AuthContext";
import { useGetIsFollowing, useFollowUser, useUnFollowUser } from "@/lib/react-query/queriesAndMutations";
import { Button } from "../ui/button";
import { Loader } from "./Loader";

const FollowButton = ({ currentUserId }: { currentUserId: string }) => {
  const { user } = useUserContext();
  const { data: isFollowing, isLoading } = useGetIsFollowing(currentUserId, user.id);
  console.log('isFollowing data:', isFollowing);
  const isFollowingTest = isFollowing?.documents ? isFollowing.documents.length > 0 : false;

  const { mutate: followUser, isPending: isFollowingLoading } = useFollowUser();
  const { mutate: unFollowUser, isPending: isUnfollowingLoading } = useUnFollowUser();

  const isActionLoading = isFollowingLoading || isUnfollowingLoading;

const handleFollow = (e: React.MouseEvent) => {
  e.stopPropagation(); 
  if(isActionLoading) return; 
  if(isFollowingTest){
    unFollowUser({ followerId: user.id, followingId: currentUserId });
  } else{
    followUser({ 
      followerId: user.id, // Твой ID из AuthContext
      followingId: currentUserId        // ID того, на чьей ты странице
    });
  }
  };

  const isSelf = user.id === currentUserId;
  if (isSelf) return null;

  return (
    <Button 
      size="lg" 
      type="button" 
      className={`${isFollowingTest ? "shad-button_dark_4" : "shad-button_primary px-8"}`}
      onClick={handleFollow}
      disabled={isActionLoading || isLoading}
    >
      {(isActionLoading || isLoading) ? <Loader /> : (isFollowingTest ? "Unfollow" : "Follow")}
    </Button>
  );
};

export default FollowButton;