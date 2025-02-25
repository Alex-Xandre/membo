export function getEventTimeStatus(
  eventStartDate: string,
  eventStartTime: string,
  eventEndDate: string,
  eventEndTime: string
): string {
  const now: Date = new Date();
  const eventStartDateTime: Date = new Date(`${eventStartDate}T${eventStartTime}:00`);
  const eventEndDateTime: Date = new Date(`${eventEndDate}T${eventEndTime}:00`);

  if (isNaN(eventStartDateTime.getTime()) || isNaN(eventEndDateTime.getTime())) {
    return 'Invalid event date';
  }

  const diffStartInMs: number = eventStartDateTime.getTime() - now.getTime();
  const diffEndInMs: number = eventEndDateTime.getTime() - now.getTime();

  if (diffEndInMs < 0) {
    // Event has already ended
    const diffInDays = Math.abs(Math.floor(diffEndInMs / (1000 * 60 * 60 * 24)));
    if (diffInDays === 0) return 'Event finished today';
    if (diffInDays === 1) return 'Event finished a day ago';
    if (diffInDays < 7) return `Event finished ${diffInDays} days ago`;
    return `Event finished ${Math.ceil(diffInDays / 7)} weeks ago`;
  }

  if (diffStartInMs <= 0 && diffEndInMs >= 0) return 'Event is happening now';

  const diffInMinutes: number = Math.floor(diffStartInMs / 60000);
  const diffInHours: number = Math.floor(diffInMinutes / 60);
  const diffInDays: number = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) return `In ${diffInMinutes} minutes`;
  if (diffInHours < 24) return diffInHours === 1 ? 'In an hour' : `In ${diffInHours} hours`;
  if (diffInDays === 1) return 'Starts in a day';
  if (diffInDays < 7) return `Starts in ${diffInDays} days`;

  return `Starts in ${Math.ceil(diffInDays / 7)} weeks`;
}
