import { Footer } from "@/components/footer/footer";
import { RegisterForm } from "@/components/register/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center p-6">
        <RegisterForm />
      </main>
      <Footer />
    </div>
  );
}
