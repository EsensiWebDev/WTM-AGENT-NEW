import { Footer } from "@/components/footer/footer";
import { RegisterForm } from "@/components/register/register-form";
import { getCountryPhoneOptions } from "@/server/general";

export default async function RegisterPage() {
  const countryOptions = await getCountryPhoneOptions();

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center p-6">
        <RegisterForm countryOptions={countryOptions} />
      </main>
      <Footer />
    </div>
  );
}
