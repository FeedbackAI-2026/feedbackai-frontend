# FeedbackAI — Ooredoo Algeria Frontend

**What if no customer complaint went unanswered?**

FeedbackAI is an intelligent customer feedback management platform developed as part of the **ThirdUni AI Program**, using Ooredoo Algeria as an illustrative use case.

This repository contains the frontend application built with **Next.js, TypeScript, Tailwind CSS, and Firebase**. It provides the customer-facing website, feedback submission system, authentication, and real-time admin dashboard.

## Project Overview

FeedbackAI aims to help businesses collect, analyze, and manage customer feedback more efficiently. The platform combines a user-friendly interface with backend AI processing and email integration to streamline complaint handling.

## How It Works

1. **Feedback Submission:** Customers submit feedback through the frontend.
2. **Data Storage:** Feedback is stored in Cloud Firestore.
3. **AI Analysis:** The backend processes new feedback and generates an AI-powered response.
4. **Response Storage:** The response and related metadata are saved to the corresponding Firestore document.
5. **Admin Dashboard:** Administrators monitor feedback and analysis through a real-time dashboard.
6. **Email Integration:** The system supports email responses through Gmail API integration.

## Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Authentication:** Firebase Authentication
- **Database:** Cloud Firestore
- **Data Visualization:** Recharts
- **Excel Export:** SheetJS
- **AI:** Backend AI integration
- **Email:** Gmail API integration

## Project Repositories

- **Frontend:** [feedbackai-frontend](https://github.com/FeedbackAI-2026/feedbackai-frontend)
- **Backend:** [feedbackai-backend](https://github.com/FeedbackAI-2026/feedbackai-backend)
- **Email Automation:** [EmailWorkflow](https://github.com/FeedbackAI-2026/EmailWorkflow)

## Scope of This Repository

This repository contains the frontend only. AI processing and Gmail API integration are handled by the backend and associated integration workflows.

## About

FeedbackAI is an educational and collaborative project developed as part of the **ThirdUni AI Program**, exploring how AI can help businesses improve customer support and manage complaints more effectively.

Ooredoo Algeria is presented as an illustrative use case, not as an official partner or endorser.
