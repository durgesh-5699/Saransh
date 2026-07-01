"use client";

import { Target, Clock, BadgeCheck, Sparkles, Lightbulb } from "lucide-react";

export function SummaryViewer({ summary }: any) {
  const icons = [Target, Clock, BadgeCheck, Sparkles];

  return (
    <div className="w-full max-w-4xl rounded-3xl bg-white shadow-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-rose-100">
          <Lightbulb className="w-5 h-5 text-rose-500" />
        </div>

        <div>
          <h2 className="font-bold text-lg text-gray-900">
            {summary.title}
          </h2>
          <p className="text-sm text-gray-500">{summary.subtitle}</p>
        </div>
      </div>

      {/* Points */}
      <div className="space-y-4">
        {summary.points.map((point: string, idx: number) => {
          const Icon = icons[idx];

          return (
            <div
              key={idx}
              className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm"
            >
              <div className="p-2 rounded-full bg-rose-50">
                <Icon className="w-5 h-5 text-rose-500" />
              </div>

              <p className="text-gray-700 font-medium">{point}</p>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700">
        This summary is AI-generated and may not capture every detail from the
        original document.
      </div>
    </div>
  );
}