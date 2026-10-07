# FeedbackAI — Ooredoo Algeria Frontend

Frontend of **FeedbackAI**, an intelligent customer feedback management project developed as part of the **ThirdUni AI Program**.

This repository contains the frontend application built with **Next.js, TypeScript, Tailwind CSS, and Firebase**. It provides the customer-facing website, feedback submission system, authentication, and real-time admin dashboard.

## Project Overview

FeedbackAI is designed to improve how customer feedback is collected, analyzed, and handled.

The complete workflow is:

Customer
│
│ 1. Submits feedback
▼
┌─────────────┐
│ FIRESTORE │
│ feedback/ │
└──────┬──────┘
│
│ 2. New feedback detected
▼
┌──────────────────┐
│ Backend / AI │
│ Team │
│ │
│ AI Analysis │
└────────┬─────────┘
│
│ 3. AI response saved
│ to the same document
▼
┌──────────────────┐
│ FIRESTORE │
│ aiResponse │
│ respondedAt │
│ sentByEmail │
└────────┬─────────┘
│
├──────────────────────┐
│ │
▼ ▼
┌──────────────────┐ ┌──────────────────┐
│ Admin Dashboard │ │ Gmail API │
│ │ │ │
│ Real-time data │ │ Email response │
└──────────────────┘ └──────────────────┘

Tech Stack
Next.js
TypeScript
Tailwind CSS
Firebase Authentication
Cloud Firestore
Recharts
SheetJS
AI backend integration
Gmail API integration

This repository contains the frontend only. AI processing and Gmail API integration are handled by the backend team.

Educational and collaborative project developed as part of the ThirdUni AI Program.
