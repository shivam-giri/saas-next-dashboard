"use client";

import { useActionState } from "react";
import { useEffect, useRef } from "react";
import { sendInvitationAction } from "@/app/actions/team";

interface InviteFormProps {
    workspaceSlug: string;
}

export function InviteForm({ workspaceSlug }: InviteFormProps) {
    const [state, formAction, pending] = useActionState(sendInvitationAction, null);
    const formRef = useRef<HTMLFormElement>(null);

    // Clear the form on success
    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state?.success]);

    return (
        <div className="bg-[#1A1A2E] border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-1 text-[#E5E7EB]">Invite New Member</h2>
            <p className="text-lg text-[#9CA3AF] mb-5">
                An invitation email will be sent. The recipient can sign in with Google to accept.
            </p>

            <form ref={formRef} action={formAction} className="flex flex-col md:flex-row gap-3">
                {/* Hidden slug so the action knows which workspace */}
                <input type="hidden" name="workspaceSlug" value={workspaceSlug} />

                <div className="flex-1">
                    <label htmlFor="invite-email" className="sr-only">Email Address</label>
                    <input
                        type="email"
                        id="invite-email"
                        name="email"
                        required
                        placeholder="colleague@company.com"
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg"
                    />
                </div>

                <div className="w-full md:w-44">
                    <label htmlFor="invite-role" className="sr-only">Role</label>
                    <select
                        id="invite-role"
                        name="role"
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-[#1A1A2E] text-lg"
                    >
                        <option value="MEMBER">Member</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={pending}
                    id="send-invite-btn"
                    className="bg-[linear-gradient(135deg,#8B5CF6,#22D3EE)] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 px-6 rounded-lg transition text-lg flex items-center gap-2 whitespace-nowrap"
                >
                    {pending ? (
                        <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Sending…
                        </>
                    ) : (
                        "Send Invite"
                    )}
                </button>
            </form>

            {/* Feedback */}
            {state?.success && (
                <p className="mt-3 text-lg text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {state.success}
                </p>
            )}
            {state?.error && (
                <p className="mt-3 text-lg text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2 flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {state.error}
                </p>
            )}
        </div>
    );
}
