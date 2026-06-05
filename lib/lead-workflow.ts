/**
 * Lead workflow helpers for enrollment/payment lifecycle tracking.
 *
 * This keeps status semantics consistent across API routes so ops and
 * automations can query a single shape in `leads.payload.workflow`.
 */

export type LeadWorkflowStage =
  | 'trial_requested'
  | 'registration_assist_requested'
  | 'pending_city_payment'
  | 'city_paid'
  | 'not_required'

export type LeadWorkflowPayload = {
  stage: LeadWorkflowStage
  cityPaymentStatus: 'pending_city_payment' | 'city_paid' | 'not_required'
  createdAt: string
  staleAfterHours?: number
}

function nowIso(): string {
  return new Date().toISOString()
}

export function buildPendingCityPaymentWorkflow(staleAfterHours = 24): LeadWorkflowPayload {
  return {
    stage: 'pending_city_payment',
    cityPaymentStatus: 'pending_city_payment',
    createdAt: nowIso(),
    staleAfterHours,
  }
}

export function buildTrialRequestedWorkflow(): LeadWorkflowPayload {
  return {
    stage: 'trial_requested',
    cityPaymentStatus: 'not_required',
    createdAt: nowIso(),
  }
}

export function buildRegistrationAssistWorkflow(staleAfterHours = 24): LeadWorkflowPayload {
  return {
    stage: 'registration_assist_requested',
    cityPaymentStatus: 'pending_city_payment',
    createdAt: nowIso(),
    staleAfterHours,
  }
}

