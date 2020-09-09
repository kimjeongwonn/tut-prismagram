import { use, settings } from 'nexus';
import { prisma } from 'nexus-plugin-prisma';

settings.change({
  schema: {
    nullable: {
      outputs: false,
      inputs: false,
    },
  },
});

use(prisma());
