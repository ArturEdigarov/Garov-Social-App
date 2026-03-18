

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
import { SigninValidation } from "@/lib/validation"
import { z } from "zod"
import { Loader } from "@/components/shared/Loader"

import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"

const SigninForm = () => {

  const{ checkAuthStatus, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: signInAccount } = useSignInAccount();
// 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {

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
      <div className="sm:w-105 flex-center items-center flex-col">
        <img src='/assets/images/logo.png' alt="logo" className="m-auto max-w-40"/>
        <h2 className="h3-bold text-center md:h2-bold pt-5 sm:pt-12">Log in to your account</h2>
        <p className="text-light-3 text-center small-medium md:base-regular">Welcome back! Please enter your account details</p>
      

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col gap-5 w-full mt-4">
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
            {isUserLoading ? (
              <div className="flex-center flex justify-center items-center gap-2">
                <Loader />Loading...
              </div>
            ): 'Sign In'}
            </Button>

            <p className="text-small-regular text-light-2 text-center mt-2">Don't have an account?
              <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1"> Sign Up</Link>
            </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm;