export type FeedbackStatus = "nouveau" | "en_cours" | "resolu";

export interface Feedback {
  id: string;
  customerId?: string;
  name: string;
  email: string;
  category?: string;
  subject?: string;
  message: string;
  rating?: number;
  status?: FeedbackStatus | string;
  createdAt?: string;
  aiResponse?: string;
  respondedAt?: string;
  sentByEmail?: boolean;
  sentiment?: string;
  priority?: string;
  mainIssue?: string;
  needsHuman?: boolean;
  emailSent?: boolean;
}

export interface FeedbackInput {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  rating: number;
}

interface ApiFeedback {
  id: string;
  customerName: string;
  customerEmail: string;
  reason: string;
  sentiment?: string;
  category?: string;
  priority?: string;
  mainIssue?: string;
  aiResponse?: string;
  status?: string;
  needsHuman?: boolean;
  emailSent?: boolean;
  createdAt?: string;
}

interface CreateFeedbackResponse {
  id: string;
  message: string;
}

interface AnalyzeResponse {
  id: string;
  analysis: {
    sentiment: string;
    category: string;
    priority: string;
    mainIssue: string;
  };
}

const API_BASE_URL = "https://feedbackai-b5l9.onrender.com";

function mapApiFeedback(item: ApiFeedback): Feedback {
  return {
    id: item.id,
    customerId: item.id,
    name: item.customerName,
    email: item.customerEmail,
    message: item.reason,
    category: item.category ?? "",
    subject: "",
    rating: 0,
    status: item.status ?? "nouveau",
    createdAt: item.createdAt,
    aiResponse: item.aiResponse,
    sentiment: item.sentiment,
    priority: item.priority,
    mainIssue: item.mainIssue,
    needsHuman: item.needsHuman,
    emailSent: item.emailSent,
  };
}

export async function submitFeedback(input: FeedbackInput): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      customerName: input.name.trim(),
      customerEmail: input.email.trim().toLowerCase(),
      reason: input.message.trim(),
    }),
  });

  let data: CreateFeedbackResponse | { error?: string; details?: string[] };

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Backend returned an invalid response (${response.status}).`,
    );
  }

  if (!response.ok) {
    const errorMessage =
      "error" in data && data.error
        ? data.error
        : "details" in data && data.details?.length
          ? data.details.join(", ")
          : `Failed to submit feedback (${response.status}).`;

    throw new Error(errorMessage);
  }

  if (!("id" in data) || !data.id) {
    throw new Error("Feedback was submitted but no feedback ID was returned.");
  }

  const feedbackId = data.id;

  // Run AI analysis after the feedback is created.
  // The backend currently protects this endpoint with bearerAuth.
  try {
    await analyzeFeedback(feedbackId);
  } catch (error) {
    console.error("AI analysis failed:", error);
    // The feedback itself was already successfully saved.
  }

  return feedbackId;
}

export async function analyzeFeedback(id: string): Promise<AnalyzeResponse> {
  const token = process.env.NEXT_PUBLIC_FEEDBACK_API_TOKEN;

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/feedback/${encodeURIComponent(id)}/analyze`,
    {
      method: "POST",
      headers,
    },
  );

  let data: AnalyzeResponse | { error?: string };

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Analysis endpoint returned an invalid response (${response.status}).`,
    );
  }

  if (!response.ok) {
    throw new Error(
      "error" in data && data.error
        ? data.error
        : `AI analysis failed (${response.status}).`,
    );
  }

  return data as AnalyzeResponse;
}

export async function getFeedbacks(): Promise<Feedback[]> {
  const response = await fetch(`${API_BASE_URL}/api/feedback`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to load feedbacks (${response.status}).`);
  }

  const data = await response.json();

  const feedbacks: ApiFeedback[] = Array.isArray(data)
    ? data
    : Array.isArray(data.feedbacks)
      ? data.feedbacks
      : [];

  return feedbacks.map(mapApiFeedback);
}

export function subscribeFeedback(
  callback: (items: Feedback[]) => void,
  onError?: (err: Error) => void,
): () => void {
  let stopped = false;

  const load = async () => {
    try {
      const items = await getFeedbacks();

      if (!stopped) {
        callback(items);
      }
    } catch (error) {
      if (!stopped) {
        onError?.(
          error instanceof Error
            ? error
            : new Error("Failed to load feedbacks."),
        );
      }
    }
  };

  void load();

  const interval = window.setInterval(() => {
    void load();
  }, 10000);

  return () => {
    stopped = true;
    window.clearInterval(interval);
  };
}
