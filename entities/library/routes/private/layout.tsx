// The two shared stylesheets this segment used to import stay in app/private/
// with the mount: nothing outside app/ imports CSS in this repo, and the
// cascade order of a route sheet against app/styles/* is part of the page.
export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return children
}
