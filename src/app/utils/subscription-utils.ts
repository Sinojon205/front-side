import {Subscription} from "rxjs";

export function cleanSubscription(sub: Subscription) {
  if (sub && !sub.closed) {
    sub.unsubscribe();
  }
  return null
}
