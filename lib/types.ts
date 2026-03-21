export interface AnalysisResult {
    intent: {
      primary: string;
      variant: string | null;
      confidence: number;
      sentiment: 'neutral' | 'concerned' | 'urgent' | 'distressed' | 'confused';
    };
    ivr: {
      spoken_response: string;
      entities_found: string[];
      entities_missing: string[];
      route: string;
      fallback: string;
      status_badge: string;
    };
    chatbot: {
      response: string;
      quick_replies: string[];
      containment: string;
      handoff_context: string;
      status_badge: string;
    };
    agent_assist: {
      suggested_script: string;
      policy_text: string;
      policy_ref: string;
      auto_surfaced: string;
      compliance_flag: string | null;
      status_badge: string;
    };
    nlu: {
      intents: string[];
      entities: string[];
      training_phrases: string[];
      confidence_threshold: number;
      threshold_note: string;
    };
  }
  
  export const SAMPLE_UTTERANCES = [
    "I need to move money from my IRA to my brokerage account",
    "I think there was an unauthorized transaction",
    "What's my current balance?",
    "I want to talk to someone about retiring next year",
    "My husband just passed and I need to update my beneficiary",
    "The market is down and I'm thinking about moving everything to cash",
    "I have called three times about this and nobody has fixed it",
    "STOP — just transfer me to someone, I don't want to go through all this again",
    "I don't even know who to talk to, everything is just wrong with my account",
    "My son set this up for me and I don't understand any of this",
    "I need this done today, I am leaving the country tomorrow",
  ] as const;