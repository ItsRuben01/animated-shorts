// ep14 reuses the steel-plant looks of ep9 (metal forming plant).
export { millLook, closeLook, studioLook, labLook, ramp, ease } from "../ep9/world";
import type { V3 } from "../engine/Stage";
export const cam = (from: V3, look: V3, fov = 44, to: V3 = from, lookTo: V3 = look) => ({ from, to, lookFrom: look, lookTo, fov });
