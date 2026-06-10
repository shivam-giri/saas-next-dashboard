import { redirect } from "next/navigation";
import { VerifyOTPForm } from "./verify-otp-form";

export default async function VerifyOTPPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = await searchParams;
    const email = resolvedParams?.email as string;

    if (!email) {
        redirect("/auth/signup");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F0F1A] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-[#1A1A2E] p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/30 text-center">
                <h2 className="text-3xl font-bold text-[#22D3EE] mb-2">Check your email</h2>
                <p className="text-gray-300 text-sm mb-6">
                    We sent a 6-digit verification code to <br/>
                    <span className="font-semibold text-white">{email}</span>
                </p>
                
                <VerifyOTPForm email={email} />
                
                <p className="mt-6 text-sm text-gray-400">
                    Didn&apos;t receive the email?{" "}
                    <a href="/auth/signup" className="text-[#22D3EE] hover:underline">
                        Sign up again
                    </a>
                </p>
            </div>
        </div>
    );
}
