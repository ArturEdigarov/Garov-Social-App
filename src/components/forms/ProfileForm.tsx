import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateProfile } from "@/lib/react-query/queriesAndMutations";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "@/components/shared/FileUploader";
import { ProfileValidation } from "@/lib/validation";
import { Loader } from "../shared/Loader";


type ProfileFormProps = {
  user: {
        userId: string;
        name: string;
        bio: string;
        file: File[];
        imageUrl: any;
        imageId: string;
        username: string;
        $id: any;
    }
}
const ProfileForm = ({ user }: ProfileFormProps) => {
    const { mutateAsync: updateProfile, isPending: isLoadingUpdate } = useUpdateProfile();
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  }) 
    async function onSubmit(values: z.infer<typeof ProfileValidation>) {
        const updatedPost = await updateProfile({
            ...values, 
            userId: user.$id,
            name: values.name,
            username: values.username,
            bio: values.bio,
            file: values.file, // Массив из FileUploader
            imageUrl: user.imageUrl,
            imageId: user.imageId,
        })
        if(!updatedPost){
          toast.error('Please try again');
        }
        return navigate(`/profile/${user.$id}`); 
    }
    const handleCancel = () => {
      navigate(-1); 
    };
  return (
    <>
      <Toaster />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Username</FormLabel>
                <FormControl>
                  <Textarea className="shad-textarea" placeholder="Your username..." {...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Profile Photo</FormLabel>
                <FormControl>
                  <FileUploader 
                    fieldChange={field.onChange}
                    mediaUrl={user?.imageUrl || ""}  
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" placeholder="Your name..." {...field}/>
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Add Bio (maximum 2200 characters long)</FormLabel>
                <FormControl>
                  <Textarea className="shad-textarea" placeholder="About You..." {...field}/>
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <div className="flex gap-4 items-center justify-end">

            <Button type="button" className="shad-button_dark_4" onClick={handleCancel}>
              Cancel
            </Button>

            <Button
              type="submit"
              className="shad-button_primary whitespace-nowrap"
              disabled={isLoadingUpdate}>
              {isLoadingUpdate ? (
                <div className="flex-center gap-2">
                  <Loader /> Updating...
                </div>
              ) : (
                "Update Profile"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}

export default ProfileForm
