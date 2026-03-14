import ProfileForm from "@/components/forms/ProfileForm";
import { Loader } from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";



const UpdateProfile = () => {
  const { data: profile, isPending } = useGetCurrentUser();
  if(isPending) return <Loader /> 
  if (!profile) return (
    <div className="flex-center w-full h-full text-light-4">
       User not found
    </div>
  );
  return (
    <div className="flex flex-1">
        <div className="common-container">
          <div className="max-w-5xl flex-start gap-3 w-full">
            <img 
              src="/assets/icons/add-post.svg" 
              width={36}
              height={36}
              alt="add" 
            />
            <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
          </div>

          <ProfileForm user={profile as any} />
        </div>
    </div>
  )
}
export default UpdateProfile