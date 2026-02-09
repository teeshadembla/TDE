export function capitalizeFirstLetter(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const sortAccordingToDate = (events) => {
  return events.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
}