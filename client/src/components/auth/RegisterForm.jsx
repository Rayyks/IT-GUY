import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthForm } from "@/hooks/useAuthForm";
import { InputError } from "@/components/error";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schemas/authSchema";

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const { handleRegister, errorRegister } = useAuthForm();

  const onSubmit = async (data) => {
    try {
      console.log("Form submitted:", data);
      handleRegister(data);
      reset();
    } catch (error) {}
  };

  return (
    <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm font-medium">
          Nama Lengkap
        </label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Nama lengkap anda"
          className="w-full"
          {...register("name")}
        />
        {errors.name && <InputError error={errors.name} errorType="name" />}
      </div>
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="Username anda"
          className="w-full"
          {...register("username")}
        />
        {errors.username && (
          <InputError error={errors.username} errorType="username" />
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Nomor Telepon
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Nomor telepon anda"
          className="w-full"
          {...register("phone")}
        />
        {errors.phone && <InputError error={errors.phone} errorType="phone" />}
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Email anda"
          className="w-full"
          {...register("email")}
        />
        {errors.email && <InputError error={errors.email} errorType="email" />}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Password anda"
          className="w-full"
          {...register("password")}
        />
        {errors.password && (
          <InputError error={errors.password} errorType="password" />
        )}
      </div>
      {errorRegister && (
        <InputError error={errorRegister?.data} errorType="register" />
      )}

      <Button
        type="submit"
        className="mt-4 w-full cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Mendaftar..." : "Daftar"}
      </Button>
    </form>
  );
};

export default RegisterForm;
