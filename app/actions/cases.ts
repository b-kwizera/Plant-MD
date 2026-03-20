'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateCaseStatus(caseId: string, newStatus: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('cases')
    .update({ status: newStatus })
    .eq('id', caseId)

  if (error) throw new Error(error.message)

  revalidatePath('/cases')
  revalidatePath('/dashboard')
  revalidatePath('/experts')
  return { success: true }
}

export async function submitExpertReview(caseId: string, reviewData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  // 1. Insert the review
  const { error: reviewError } = await supabase
    .from('expert_reviews')
    .insert([{
      case_id: caseId,
      expert_id: user.id,
      ...reviewData,
      is_submitted: true
    }])

  if (reviewError) throw new Error(reviewError.message)

  // 2. Automatically update case status to 'Reviewed'
  const { error: caseError } = await supabase
    .from('cases')
    .update({ status: 'Reviewed' })
    .eq('id', caseId)

  if (caseError) throw new Error(caseError.message)

  revalidatePath('/cases')
  revalidatePath('/experts')
  return { success: true }
}
