import withPWAInit from "next-pwa";

function mediaRemotePattern() {
  try {
    const url = new URL(process.env.SERVER || "http://localhost:8000");
    const pattern = {
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
      pathname: "/media/**",
    };
    if (url.port) pattern.port = url.port;
    return pattern;
  } catch {
    return {
      protocol: "http",
      hostname: "localhost",
      port: "8000",
      pathname: "/media/**",
    };
  }
}

/** @type {import('next').NextConfig} */
const baseConfig = {
  turbopack: {},
  env: {
    SERVER: process.env.SERVER || "http://localhost:8000",
  },
  images: {
    remotePatterns: [
      mediaRemotePattern(),
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
    ],
  },
};

const withPWA = withPWAInit({
  dest: "public",
  register: false,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [
    /app-build-manifest\.json$/,
    /middleware-manifest\.json$/,
    /dynamic-css-manifest\.json$/,
  ],
});

export default withPWA(baseConfig);
