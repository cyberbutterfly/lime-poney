declare const require: any;
const requireAll = (requireContext: any) => requireContext.keys().map(requireContext);
const svgIcons: any = require.context('./svg', false, /.*\.svg$/);
export default requireAll(svgIcons).reduce((state: any, icon: any) => ({...state, [icon.default.id]: icon}), {});
