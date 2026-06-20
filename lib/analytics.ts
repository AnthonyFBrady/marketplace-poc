export type AnalyticsEvent =
  | 'listing_viewed'
  | 'booking_cta_clicked'
  | 'message_cta_clicked'
  | 'list_gear_clicked'
  | 'filter_applied'
  | 'map_pin_clicked'
  | 'gallery_opened'
  | 'search_used'
  | 'nav_search_pill_clicked';

export function track(
  event: AnalyticsEvent,
  props?: Record<string, string | number | boolean>
): void {
  if (typeof window === 'undefined') return;
  // Wire to your analytics provider here:
  // posthog.capture(event, props)
  // mixpanel.track(event, props)
  if (process.env.NODE_ENV === 'development') {
    console.debug('[analytics]', event, props);
  }
}
