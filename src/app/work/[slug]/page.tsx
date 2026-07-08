import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCaseStudy,
  getAdjacent,
  caseOrder,
} from "@/data/caseStudyContent";
import CaseStudyView from "@/components/casestudy/CaseStudyView";

/** Pre-render every case study at build time. */
export function generateStaticParams() {
  return caseOrder.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: `${study.project} — ${study.title}`,
    description: study.lead ?? study.title,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const { prev, next } = getAdjacent(slug);
  return <CaseStudyView study={study} prev={prev} next={next} />;
}
