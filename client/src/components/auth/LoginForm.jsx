import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthForm } from "@/hooks/useAuthForm";
import { loginSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { InputError } from "@/components/error";

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { handleLogin, errorLogin } = useAuthForm();

  const onSubmit = async (data) => {
    try {
      console.log("Form submitted:", data);
      handleLogin(data);
      reset();
    } catch (error) {}
  };

  return (
    <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          className="w-full"
          {...register("email")}
        />
        {errors.email && <InputError error={errors.email} errorType="email" />}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          className="w-full"
          {...register("password")}
        />
        {errors.password && (
          <InputError error={errors.password} errorType="password" />
        )}
      </div>
      {errorLogin && <InputError error={errorLogin?.data} errorType="login" />}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 w-full z-[99]"
      >
        {isSubmitting ? "Loading..." : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;
