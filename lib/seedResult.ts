import { AnalysisResult } from "./types";

/**
 * Pre-computed result for SAMPLE_UTTERANCES[0]:
 * "I need to move money from my IRA to my brokerage account"
 *
 * Seeded to avoid a cold API call on first page load.
 * All subsequent analyses (different sample, typed utterance, voice, realtime) hit the live API.
 */
export const SEED_RESULT: AnalysisResult = {
  intent: {
    primary: "FUND_TRANSFER",
    variant: "IRA_TO_BROKERAGE_DISTRIBUTION",
    confidence: 0.91,
    sentiment: "neutral",
  },
  ivr: {
    spoken_response:
      "I can help you move money from your IRA to your brokerage account. [pause 400ms] Just so you know, a transfer from an IRA to a brokerage account is typically treated as a distribution and may be subject to taxes and, depending on your age, an early withdrawal penalty. [pause 300ms] To get started, can I get your account number or the phone number on file? [await]",
    entities_found: [
      "source_account_type: IRA",
      "destination_account_type: brokerage account",
    ],
    entities_missing: ["account_number", "transfer_amount", "investor_age", "IRA_type"],
    route:
      "Authenticate investor, collect transfer amount, surface tax disclosure, route to Fund Transfer workflow. If amount exceeds $50K or investor is under age 59.5, escalate to specialist.",
    fallback: "If authentication fails, offer callback or transfer to live agent.",
    status_badge: "IRA Transfer",
  },
  chatbot: {
    response:
      "I can help you with that. Moving money from an IRA to a brokerage account is usually considered a distribution, which means it may be taxable and could include a penalty if you are under age 59 and a half. Before we go further, I want to make sure you have the full picture. Would you like to connect with a specialist, or would you like to continue here and I can walk you through the steps?",
    quick_replies: ["Continue here", "Connect with a specialist", "Tell me about taxes first"],
    containment: "Partial",
    handoff_context:
      "Investor is requesting a transfer from an IRA to a brokerage account. IRA type, investor age, and transfer amount are not yet confirmed. Tax disclosure has been surfaced. Escalate if amount exceeds $50K or early withdrawal penalty may apply.",
    status_badge: "IRA Transfer",
  },
  agent_assist: {
    suggested_script:
      "Thanks for calling. I see you are looking to move money from your IRA to your brokerage account. Before we process that, I just want to walk you through a couple of things. This kind of move is generally treated as a distribution from your IRA, which means it could be taxable income for this year. And if you are under age 59 and a half, there may also be a 10 percent early withdrawal penalty, though there are some exceptions that might apply to you. Can I ask how old you are and roughly how much you are looking to move? That will help me make sure we handle this the right way for your situation.",
    policy_text:
      "IRA-to-brokerage transfers are treated as taxable distributions under IRS rules. Traditional IRA distributions are subject to ordinary income tax. Early withdrawal before age 59.5 triggers a 10 percent penalty unless an exception applies under IRC Section 72(t). Roth IRA withdrawal rules differ based on contribution age and account seasoning. Withholding election required via Form W-4P. Transfers over $50K require compliance review before execution. Confirm IRA type (Traditional, Roth, SEP, SIMPLE) before proceeding.",
    policy_ref:
      "Vestara Transfer Policy VTP-114 | IRS Form 1099-R (distribution reporting) | IRS Form W-4P (withholding election) | IRC Section 72(t) (early withdrawal exceptions)",
    auto_surfaced:
      "Source account type: IRA. Destination account type: brokerage. IRA type not confirmed. Investor age not confirmed. Transfer amount not confirmed. Tax disclosure triggered. Compliance escalation threshold: $50,000. Early withdrawal penalty flag: pending age confirmation.",
    compliance_flag:
      "IRA distribution tax disclosure required before transaction execution. If investor is under age 59.5, early withdrawal penalty flag must be acknowledged by investor in writing. If transfer amount exceeds $50,000, route to compliance review before processing.",
    status_badge: "IRA Transfer",
  },
  nlu: {
    intents: ["FUND_TRANSFER", "IRA_TO_BROKERAGE_DISTRIBUTION"],
    entities: [
      "source_account_type: IRA",
      "destination_account_type: brokerage account",
      "transfer_amount: not stated",
      "investor_age: not stated",
    ],
    training_phrases: [
      "I want to take money out of my IRA and put it in my regular account",
      "Can I move funds from my retirement account to my brokerage",
      "I need to pull money from my IRA into my investment account",
      "How do I transfer from my IRA to my Vestara brokerage account",
    ],
    confidence_threshold: 0.72,
    threshold_note:
      "If confidence falls below 0.72, the system should not assume an IRA distribution is intended and must present a clarifying question before surfacing tax disclosures or routing to transfer workflow.",
  },
};
