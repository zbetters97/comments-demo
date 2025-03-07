export function getTimeSince(date) {
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return minutes < 2 ? "A minute ago" : minutes + " minutes ago";
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return hours < 2 ? "An hour ago" : hours + " hours ago";
  }

  const days = Math.round(hours / 24);
  if (days < 7) {
    return days < 2 ? "A day ago" : days + " days ago";
  }

  const weeks = Math.round(days / 7);
  if (weeks < 4) {
    return weeks < 2 ? "A week ago" : weeks + " weeks ago";
  }

  const months = Math.round(days / 30.44);
  if (months < 12) {
    return months < 2 ? "A month ago" : months + " months ago";
  }

  const years = Math.round(months / 12);
  return years < 2 ? "A year ago" : years + " years ago";
}
