import { getIndustryInshights } from '@/actions/dashboard';
import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import React from 'react'
import DashboardView from './_components/DashboardView';

const IndustryInsights = async () => {

  // Check if user is already onboarded
  const { isOnboarded } = await getUserOnboardingStatus();

  if (!isOnboarded) {
    redirect("/onboarding");
  }

  const insights = await getIndustryInshights();

  return (
    <div className="container mx-auto">
      <DashboardView insights={insights} />
    </div>
  )
}

export default IndustryInsights