import React from 'react'
import OnboardingForm from './_components/Onboarding'
import { industries } from '@/data/industries'
import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';

const Onboarding = async () => {

    // Check if user is already onboarded
    const { isOnboarded } = await getUserOnboardingStatus();

    if (isOnboarded) {
        redirect("/dashboard");
    }

    return (
        <main>
            <OnboardingForm industries={industries} />
        </main>
    )
}

export default Onboarding