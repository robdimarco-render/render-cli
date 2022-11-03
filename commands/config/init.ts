import { ConfigLatest } from "../../config/types/index.ts";
import { Cliffy, Log, YAML } from "../../deps.ts";
import { ForceRequiredError } from "../../errors.ts";
import { pathExists } from "../../util/paths.ts";
import { getPaths } from "../../util/paths.ts";
import { standardAction, Subcommand } from "../_helpers.ts";
import { requestProfileInfo } from "./_shared.ts";

const desc = 
`Interactively creates a Render CLI config file.`;

export const configInitCommand =
  new Subcommand()
    .name('init')
    .description(desc)
    .option("-f, --force", "overwrites existing files if found.")
    .action((opts) => standardAction({
      interactive: async (logger: Log.Logger) => {
        const { renderDir, configFile } = await getPaths();

        if (await pathExists(configFile) && !opts.force) {
          throw new ForceRequiredError(`Render config file already exists at '${configFile}'`);
        }

        logger.debug("ensuring Render directory exists...");
        await Deno.mkdir(renderDir, { recursive: true });

        logger.info("Let's create your default profile.");
        const defaultProfile = await requestProfileInfo();

        const cfg: ConfigLatest = {
          version: 1,
          sshPreserveHosts: false,
          profiles: {
            default: defaultProfile,
          },
        };

        logger.info(`Writing profile to '${configFile}'...`);
        await Deno.writeTextFile(configFile, YAML.dump(cfg));

        logger.info("Done! You're ready to use the Render CLI!");
        return 0;
      },
    }))
    ;