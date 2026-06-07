import { Metadata } from 'next';
import { PublicationsPage } from "@/features/blog";

export const metadata: Metadata = {
  title: 'Publications & Reports',
  description: 'Official publications, manuals, guidelines, and evaluation reports from the SURWASH program.',
};

export default function PublicationsRoutePage() {
  return <PublicationsPage />;
}

