import { use, settings, schema } from 'nexus';
import { prisma } from 'nexus-plugin-prisma';
settings.change({
  schema: {
    nullable: {
      outputs: false,
      inputs: false,
    },
  },
});
schema.addToContext(({ req, res }) => {
  return {
    greeting: 'Howdy!',
  };
});

use(prisma());
