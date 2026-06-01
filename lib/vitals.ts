import type { Metric } from "web-vitals";

export function reportWebVitals(metric: Metric) {
  // Enviar para Plausible como custom events
  if (typeof window !== "undefined" && (window as Window & { plausible?: (e: string, o: object) => void }).plausible) {
    (window as Window & { plausible?: (e: string, o: object) => void }).plausible?.(`Web Vitals`, {
      props: {
        metric_id:    metric.id,
        metric_name:  metric.name,
        metric_value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
        metric_rating:metric.rating,
      },
    });
  }
  // Log em desenvolvimento
  if (process.env.NODE_ENV === "development") {
    console.log(`[Web Vitals] ${metric.name}: ${metric.value} (${metric.rating})`);
  }
}
