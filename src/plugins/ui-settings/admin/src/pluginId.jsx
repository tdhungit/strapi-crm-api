// @ts-ignore
import * as pluginPkg from '../../package.json';

const pluginId = pluginPkg.name.replace(/^(@[^/]+\/|strapi-)plugin-/, '');

export default pluginId;
