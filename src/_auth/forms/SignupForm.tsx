

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupValidation } from "@/lib/validation"
import { z } from "zod"
import { Loader } from "@/components/shared/Loader"
import { useCreateUserAccount } from "@/lib/react-query/queriesAndMutations"
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"


const SignupForm = () => {

  const{ checkAuthStatus } = useUserContext();
  const navigate = useNavigate();
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount } = useSignInAccount();
// 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values);
    if(!newUser){
      console.log('Error creating account');
    }
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })
    if(!session){ 
      console.log('Error signing in');
    }
    const isLoggedIn = await checkAuthStatus();
    if(isLoggedIn) {
      form.reset();
      navigate('/');
    } else {
      console.log('Error');
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420px flex-center items-center flex-col">
        <img src='/assets/images/logo.svg' alt="logo" className="m-auto"/>
        <h2 className="h3-bold text-center md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
        <p className="text-light-3 text-center small-medium md:base-regular">To use Garov enter your account details</p>
      

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input bg-light-4 border-0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input bg-light-4 border-0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input bg-light-4 border-0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input bg-light-4 border-0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-primary-600">
            {isCreatingAccount ? (
              <div className="flex-center flex justify-center items-center gap-2">
                <Loader />Loading...
              </div>
            ): 'Sign Up'}
            </Button>

            <p className="text-small-regular text-light-2 text-center mt-2">Already have an account?
              <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1"> Log in</Link>
            </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm;