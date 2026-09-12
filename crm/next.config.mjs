/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  eslint: {
    // `next lint` defaults to app/, pages/, components/, lib/ and src/ only, so
    // the kernel  and the entity blocks  were linted by
    // nothing once code moved there — including the `import/no-restricted-paths`
    // boundary zones generated from entities.manifest.json, whose whole job is
    // to police those two directories. Naming the roots explicitly restores the
    // coverage for `npm run lint`, `next build`, and the lint-warning ratchet
    // (which shells out to `next lint` itself). lib/ and components/ are gone
    //; app/ is the composition root and the code is in the other two.
    dirs: ["app", "kernel", "entities"],
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // instrumentation.ts is where the composition root registers the event-bus
    // subscribers (app/events.ts, generated from deployments/*.json). Next 14
    // only runs that file behind this flag — off, `register()` is never called,
    // nothing subscribes, and every soft effect on the bus (a done card marking
    // its coaching commitment kept) silently stops. scripts/check-deployment
    // .test.mjs pins this line for that reason.
    instrumentationHook: true,
    // resvg ships a native binary per platform behind a `require` webpack cannot
    // follow. Left to the bundler, the exhibit renderer fails at runtime with a
    // missing .node file; as an external it loads from node_modules as intended.
    serverComponentsExternalPackages: ["@resvg/resvg-js"],
    // Resume uploads (recruiter intake, careers apply) arrive through server
    // actions; the framework default of 1 MB silently rejected files the app
    // itself allows up to 10 MB.
    serverActions: { bodySizeLimit: "10mb" },
  },
  async redirects() {
    return [
      // This deployment is the CRM only; the marketing site lives at bhutan-luxe.com.
      { source: '/', destination: '/admin', permanent: false },
    ]
  },
}

export default nextConfig
