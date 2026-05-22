import Link from "next/link";
import { SignUpForm } from "./signup-form";

export default async function SignUpPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = await searchParams;
    const callbackUrl = (resolvedParams?.callbackUrl as string) || "/dashboard";

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F0F1A] py-12 px-4 sm:px-6 lg:px-8">


            <div className="max-w-md w-full bg-[#1A1A2E] p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/30 ">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-[#22D3EE]">
                        Create an Account
                    </h2>
                    <p className="mt-2 text-center text-lg text-[#9CA3AF] ">
                        Already have an account?{" "}
                        <Link
                            href={callbackUrl !== "/dashboard" ? `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/auth/signin"}
                            className="font-semibold text-[#22D3EE] hover:text-[#22D3EE] transition"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                <SignUpForm callbackUrl={callbackUrl} />
            </div>
        </div>
    );
}
