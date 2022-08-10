export type AppPaths = {
  configFile: string,
  cacheDir: string,
};

export function getPaths(): AppPaths {
  const defaultHome = Deno.env.get("HOME");
  if (!defaultHome) {
    throw new Error("No $HOME env var set.");
  }

  const renderDir = `${defaultHome}/.render`;

  return {
    configFile: Deno.env.get("RENDERCLI_CONFIG_FILE") ?? `${renderDir}/config.yaml`,
    cacheDir: Deno.env.get("RENDERCLI_CACHE_DIR") ?? `${renderDir}/cache`,
  };
}